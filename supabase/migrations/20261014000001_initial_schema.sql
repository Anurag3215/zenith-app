-- ==============================================================================
-- ZENITH — Team No. 5 | Initial Database Schema Migration
-- ==============================================================================
-- Engine: PostgreSQL 15+ (Supabase)
-- Program: mPOWER Placement Training Program
-- ==============================================================================

-- 1. Custom Enumerations
CREATE TYPE app_role AS ENUM (
    'team_admin',
    'captain',
    'vice_captain',
    'member'
);

CREATE TYPE day_status AS ENUM (
    'upcoming',
    'in_progress',
    'completed'
);

CREATE TYPE access_tier AS ENUM (
    'internal_only',
    'showcase_public'
);

-- 2. Teams Table (ZENITH Team No. 5)
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_number INT NOT NULL UNIQUE CHECK (team_number > 0),
    name TEXT NOT NULL DEFAULT 'ZENITH',
    motto TEXT NOT NULL DEFAULT '[Pending Official Motto]',
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Profiles Table (Strictly 8 provisioned member accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '[Candidate Name Pending]',
    role app_role NOT NULL DEFAULT 'member',
    avatar_url TEXT,
    bio TEXT DEFAULT '[Candidate Bio Pending]',
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    linkedin_url TEXT,
    github_url TEXT,
    phone TEXT DEFAULT '[Verified Contact Pending]',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Scoreboard Groups Table
CREATE TABLE IF NOT EXISTS public.scoreboard_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name TEXT NOT NULL UNIQUE,
    group_number INT NOT NULL UNIQUE,
    rank INT NOT NULL DEFAULT 1 CHECK (rank > 0),
    current_points INT NOT NULL DEFAULT 0,
    previous_points INT NOT NULL DEFAULT 0,
    penalty_points INT NOT NULL DEFAULT 0 CHECK (penalty_points >= 0),
    bonus_points INT NOT NULL DEFAULT 0 CHECK (bonus_points >= 0),
    notes TEXT,
    last_updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Score Transactions (Immutable Audit Ledger)
CREATE TABLE IF NOT EXISTS public.score_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.scoreboard_groups(id) ON DELETE CASCADE,
    delta_points INT NOT NULL CHECK (delta_points <> 0),
    reason TEXT NOT NULL CHECK (char_length(reason) >= 3),
    event_type TEXT NOT NULL DEFAULT 'competition_adjustment',
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Training Days (4-Day Placement Curriculum)
CREATE TABLE IF NOT EXISTS public.training_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_number INT NOT NULL UNIQUE CHECK (day_number BETWEEN 1 AND 4),
    title TEXT NOT NULL,
    schedule_date DATE NOT NULL,
    description TEXT NOT NULL,
    focus_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
    status day_status NOT NULL DEFAULT 'upcoming',
    trainer_name TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Reflections Table
CREATE TABLE IF NOT EXISTS public.reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID NOT NULL REFERENCES public.training_days(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    key_takeaways TEXT NOT NULL CHECK (char_length(key_takeaways) >= 10),
    challenges_faced TEXT,
    action_items TEXT,
    mood_rating INT NOT NULL CHECK (mood_rating BETWEEN 1 AND 5),
    is_approved_for_showcase BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Learning Resources Documents
CREATE TABLE IF NOT EXISTS public.resources_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID REFERENCES public.training_days(id),
    uploader_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    mime_type TEXT NOT NULL,
    access_level access_tier NOT NULL DEFAULT 'internal_only',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Gallery Items
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID REFERENCES public.training_days(id),
    uploader_id UUID NOT NULL REFERENCES public.profiles(id),
    media_url TEXT NOT NULL,
    caption TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_featured_showcase BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- Indexes for Performance & Filter Operations
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_scoreboard_rank ON public.scoreboard_groups(rank);
CREATE INDEX IF NOT EXISTS idx_score_transactions_group ON public.score_transactions(group_id);
CREATE INDEX IF NOT EXISTS idx_score_transactions_created_at ON public.score_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_day_id ON public.reflections(day_id);
CREATE INDEX IF NOT EXISTS idx_reflections_member_id ON public.reflections(member_id);
CREATE INDEX IF NOT EXISTS idx_reflections_showcase ON public.reflections(is_approved_for_showcase);
CREATE INDEX IF NOT EXISTS idx_resources_access ON public.resources_documents(access_level);
CREATE INDEX IF NOT EXISTS idx_gallery_showcase ON public.gallery_items(is_featured_showcase);

-- ==============================================================================
-- Triggers and Stored Procedures
-- ==============================================================================

-- 1. Timestamp auto-updater
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_scoreboard_groups_updated_at
BEFORE UPDATE ON public.scoreboard_groups
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_training_days_updated_at
BEFORE UPDATE ON public.training_days
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_reflections_updated_at
BEFORE UPDATE ON public.reflections
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Scoreboard Rank Recalibration Trigger
CREATE OR REPLACE FUNCTION public.recalculate_scoreboard_ranks()
RETURNS TRIGGER AS $$
BEGIN
    WITH ranked AS (
        SELECT id, DENSE_RANK() OVER (
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

CREATE TRIGGER trg_recalculate_ranks_after_score
AFTER INSERT OR UPDATE OF current_points, bonus_points, penalty_points ON public.scoreboard_groups
FOR EACH STATEMENT EXECUTE FUNCTION public.recalculate_scoreboard_ranks();

-- 3. Atomic Score Adjustment Stored Procedure
-- STRICT RBAC RULE: Only Captain and Vice-Captain may edit scores.
-- Team Admin does NOT have score-editing rights unless explicitly holding captain/vice_captain.
CREATE OR REPLACE FUNCTION public.adjust_group_score(
    p_group_id UUID,
    p_delta_points INT,
    p_reason TEXT,
    p_event_type TEXT DEFAULT 'competition_adjustment'
)
RETURNS public.scoreboard_groups AS $$
DECLARE
    v_caller_role app_role;
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

    -- Validate group exists
    IF NOT EXISTS (SELECT 1 FROM public.scoreboard_groups WHERE id = p_group_id) THEN
        RAISE EXCEPTION 'Target competition group not found: %', p_group_id;
    END IF;

    -- Update score atomically
    UPDATE public.scoreboard_groups
    SET previous_points = current_points,
        current_points = current_points + p_delta_points,
        last_updated_by = auth.uid(),
        updated_at = now()
    WHERE id = p_group_id
    RETURNING * INTO v_updated_group;

    -- Record transaction in immutable audit ledger
    INSERT INTO public.score_transactions (
        group_id,
        delta_points,
        reason,
        event_type,
        created_by
    ) VALUES (
        p_group_id,
        p_delta_points,
        p_reason,
        p_event_type,
        auth.uid()
    );

    RETURN v_updated_group;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
