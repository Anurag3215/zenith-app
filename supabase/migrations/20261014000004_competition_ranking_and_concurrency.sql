-- ==============================================================================
-- ZENITH — Team No. 5 | Competition Ranking (1224) & Concurrency Migration
-- ==============================================================================
-- 1. Standard competition ranking rule (1224 ranking: tied groups share the same
--    rank and next rank skips accordingly).
-- 2. Concurrency conflict detection for simultaneous score editing.
-- 3. Non-negative cumulative score enforcement.
-- ==============================================================================

-- 1. Update Automatic Rank Recalibration Stored Procedure
CREATE OR REPLACE FUNCTION public.recalculate_scoreboard_ranks()
RETURNS TRIGGER AS $$
BEGIN
    WITH ranked AS (
        SELECT id, RANK() OVER (
            ORDER BY (current_points + bonus_points - penalty_points) DESC, group_number ASC
        ) as calculated_rank
        FROM public.scoreboard_groups
    )
    UPDATE public.scoreboard_groups sg
    SET rank = ranked.calculated_rank
    FROM ranked
    WHERE sg.id = ranked.id AND sg.rank IS DISTINCT FROM ranked.calculated_rank;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Upgrade Atomic Score Adjustment Stored Procedure with Concurrency Check
CREATE OR REPLACE FUNCTION public.adjust_group_score(
    p_group_id UUID,
    p_delta_points INT,
    p_reason TEXT,
    p_event_type TEXT DEFAULT 'competition_adjustment',
    p_expected_current_points INT DEFAULT NULL
)
RETURNS public.scoreboard_groups AS $$
DECLARE
    v_caller_role app_role;
    v_current_points INT;
    v_updated_group public.scoreboard_groups;
BEGIN
    -- Query authenticated user role
    SELECT role INTO v_caller_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_caller_role IS NULL THEN
        RAISE EXCEPTION 'Access Denied: Unauthenticated caller.';
    END IF;

    -- Strict check: Captain and Vice-Captain only
    IF v_caller_role NOT IN ('captain', 'vice_captain') THEN
        RAISE EXCEPTION 'Access Denied: Only Captain and Vice-Captain may modify competition scores. Current role: %', v_caller_role;
    END IF;

    -- Fetch current group points and lock row
    SELECT current_points INTO v_current_points
    FROM public.scoreboard_groups
    WHERE id = p_group_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target competition group not found: %', p_group_id;
    END IF;

    -- Concurrency Conflict Detection:
    -- If expected points was supplied and differs from actual current database score,
    -- another editor modified this group in the interim!
    IF p_expected_current_points IS NOT NULL AND v_current_points <> p_expected_current_points THEN
        RAISE EXCEPTION 'Conflict Detected: The score for this group was modified by another editor while your form was open (Current database score: % pts, Your baseline: % pts). Please refresh the leaderboard.',
            v_current_points, p_expected_current_points;
    END IF;

    -- Non-negative total points validation
    IF (v_current_points + p_delta_points) < 0 THEN
        RAISE EXCEPTION 'Validation Error: Cumulative group points cannot be reduced below zero. (Attempted result: % pts)',
            (v_current_points + p_delta_points);
    END IF;

    -- Delta cannot be zero
    IF p_delta_points = 0 THEN
        RAISE EXCEPTION 'Validation Error: Score delta cannot be zero.';
    END IF;

    -- Mandatory justification length (min 3 chars)
    IF p_reason IS NULL OR char_length(trim(p_reason)) < 3 THEN
        RAISE EXCEPTION 'Validation Error: A mandatory audit justification of at least 3 characters is required.';
    END IF;

    -- Apply update atomically
    UPDATE public.scoreboard_groups
    SET previous_points = current_points,
        current_points = current_points + p_delta_points,
        last_updated_by = auth.uid(),
        updated_at = now()
    WHERE id = p_group_id
    RETURNING * INTO v_updated_group;

    -- Insert into immutable transaction ledger
    INSERT INTO public.score_transactions (
        group_id,
        delta_points,
        reason,
        event_type,
        created_by
    ) VALUES (
        p_group_id,
        p_delta_points,
        trim(p_reason),
        p_event_type,
        auth.uid()
    );

    RETURN v_updated_group;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
