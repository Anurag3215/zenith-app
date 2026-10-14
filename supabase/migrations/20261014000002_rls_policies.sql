-- ==============================================================================
-- ZENITH — Team No. 5 | Row Level Security (RLS) Policies Migration
-- ==============================================================================
-- Engine: PostgreSQL 15+ (Supabase)
-- Enforces: Principle of Least Privilege, Role-Based Access Control (RBAC),
-- and Strict Separation of Captain Score Editing vs Admin Governance.
-- ==============================================================================

-- 1. Enable RLS on 100% of Exposed Application Tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoreboard_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Get caller's current role from public.profiles
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS app_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==============================================================================
-- 2. Table: teams
-- ==============================================================================
CREATE POLICY "teams_select_policy"
ON public.teams FOR SELECT
USING (true); -- Publicly readable for authenticated members and evaluators

CREATE POLICY "teams_update_admin_only"
ON public.teams FOR UPDATE
TO authenticated
USING (public.get_auth_role() = 'team_admin')
WITH CHECK (public.get_auth_role() = 'team_admin');

-- ==============================================================================
-- 3. Table: profiles
-- ==============================================================================
-- Authenticated members can view all 8 team profiles
CREATE POLICY "profiles_select_authenticated"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Anonymous evaluators can view only active profiles on public showcase
CREATE POLICY "profiles_select_anonymous_showcase"
ON public.profiles FOR SELECT
TO anon
USING (is_active = true);

-- Members can edit their own profile details (bio, skills, links)
-- Role elevation is strictly forbidden in client update
CREATE POLICY "profiles_update_self"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND
    -- Prevent self-role elevation: role must remain equal to existing database role
    role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
);

-- Team Admin can update role assignments and active status
CREATE POLICY "profiles_update_admin"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.get_auth_role() = 'team_admin')
WITH CHECK (public.get_auth_role() = 'team_admin');

-- ==============================================================================
-- 4. Table: scoreboard_groups
-- ==============================================================================
-- Scoreboard is readable by all authenticated members and public evaluators
CREATE POLICY "scoreboard_groups_select_all"
ON public.scoreboard_groups FOR SELECT
USING (true);

-- STRICT RBAC RULE: Only Captain and Vice-Captain may modify scores!
-- Team Admin CANNOT edit scores unless explicitly holding Captain or Vice-Captain role.
CREATE POLICY "scoreboard_groups_update_captain_only"
ON public.scoreboard_groups FOR UPDATE
TO authenticated
USING (public.get_auth_role() IN ('captain', 'vice_captain'))
WITH CHECK (public.get_auth_role() IN ('captain', 'vice_captain'));

-- ==============================================================================
-- 5. Table: score_transactions
-- ==============================================================================
-- Authenticated members can view the full transaction history
CREATE POLICY "score_transactions_select_authenticated"
ON public.score_transactions FOR SELECT
TO authenticated
USING (true);

-- Only Captain and Vice-Captain can insert score transactions
CREATE POLICY "score_transactions_insert_captain_only"
ON public.score_transactions FOR INSERT
TO authenticated
WITH CHECK (
    public.get_auth_role() IN ('captain', 'vice_captain') AND
    created_by = auth.uid()
);

-- Immutable Ledger: Updates and Deletions are completely forbidden
CREATE POLICY "score_transactions_no_update"
ON public.score_transactions FOR UPDATE
USING (false);

CREATE POLICY "score_transactions_no_delete"
ON public.score_transactions FOR DELETE
USING (false);

-- ==============================================================================
-- 6. Table: training_days
-- ==============================================================================
CREATE POLICY "training_days_select_all"
ON public.training_days FOR SELECT
USING (true);

CREATE POLICY "training_days_update_admin_only"
ON public.training_days FOR UPDATE
TO authenticated
USING (public.get_auth_role() = 'team_admin')
WITH CHECK (public.get_auth_role() = 'team_admin');

-- ==============================================================================
-- 7. Table: reflections
-- ==============================================================================
-- Authenticated members can read all team reflections
CREATE POLICY "reflections_select_authenticated"
ON public.reflections FOR SELECT
TO authenticated
USING (true);

-- Anonymous evaluators can ONLY view reflections explicitly approved for showcase
CREATE POLICY "reflections_select_showcase_approved"
ON public.reflections FOR SELECT
TO anon
USING (is_approved_for_showcase = true);

-- Members can insert their own reflection
CREATE POLICY "reflections_insert_self"
ON public.reflections FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = member_id);

-- Members can update their own reflection content
CREATE POLICY "reflections_update_self"
ON public.reflections FOR UPDATE
TO authenticated
USING (auth.uid() = member_id)
WITH CHECK (auth.uid() = member_id);

-- Captain, Vice-Captain, and Team Admin can endorse/toggle showcase approval
CREATE POLICY "reflections_update_showcase_approval"
ON public.reflections FOR UPDATE
TO authenticated
USING (public.get_auth_role() IN ('captain', 'vice_captain', 'team_admin'))
WITH CHECK (public.get_auth_role() IN ('captain', 'vice_captain', 'team_admin'));

-- Authors can delete their own reflection
CREATE POLICY "reflections_delete_self"
ON public.reflections FOR DELETE
TO authenticated
USING (auth.uid() = member_id);

-- ==============================================================================
-- 8. Table: resources_documents
-- ==============================================================================
-- Authenticated members can access all resources
CREATE POLICY "resources_select_authenticated"
ON public.resources_documents FOR SELECT
TO authenticated
USING (true);

-- Anonymous evaluators can ONLY view resources classified as showcase_public
CREATE POLICY "resources_select_showcase_public"
ON public.resources_documents FOR SELECT
TO anon
USING (access_level = 'showcase_public');

-- Authenticated members can upload resources
CREATE POLICY "resources_insert_authenticated"
ON public.resources_documents FOR INSERT
TO authenticated
WITH CHECK (uploader_id = auth.uid());

-- Uploader or Team Admin can update/delete resources
CREATE POLICY "resources_modify_uploader_or_admin"
ON public.resources_documents FOR UPDATE
TO authenticated
USING (uploader_id = auth.uid() OR public.get_auth_role() = 'team_admin');

CREATE POLICY "resources_delete_uploader_or_admin"
ON public.resources_documents FOR DELETE
TO authenticated
USING (uploader_id = auth.uid() OR public.get_auth_role() = 'team_admin');

-- ==============================================================================
-- 9. Table: gallery_items
-- ==============================================================================
-- Authenticated members can view all gallery items
CREATE POLICY "gallery_select_authenticated"
ON public.gallery_items FOR SELECT
TO authenticated
USING (true);

-- Anonymous evaluators can ONLY view featured showcase items
CREATE POLICY "gallery_select_featured_showcase"
ON public.gallery_items FOR SELECT
TO anon
USING (is_featured_showcase = true);

CREATE POLICY "gallery_insert_authenticated"
ON public.gallery_items FOR INSERT
TO authenticated
WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "gallery_modify_uploader_or_leads"
ON public.gallery_items FOR UPDATE
TO authenticated
USING (uploader_id = auth.uid() OR public.get_auth_role() IN ('captain', 'team_admin'));

CREATE POLICY "gallery_delete_uploader_or_leads"
ON public.gallery_items FOR DELETE
TO authenticated
USING (uploader_id = auth.uid() OR public.get_auth_role() IN ('captain', 'team_admin'));

-- ==============================================================================
-- 10. Table: audit_logs
-- ==============================================================================
-- Strictly restricted to Team Admin
CREATE POLICY "audit_logs_select_admin_only"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.get_auth_role() = 'team_admin');

-- Clients cannot insert, update, or delete audit logs directly
CREATE POLICY "audit_logs_no_client_insert"
ON public.audit_logs FOR INSERT
WITH CHECK (false);

CREATE POLICY "audit_logs_no_client_update"
ON public.audit_logs FOR UPDATE
USING (false);

CREATE POLICY "audit_logs_no_client_delete"
ON public.audit_logs FOR DELETE
USING (false);
