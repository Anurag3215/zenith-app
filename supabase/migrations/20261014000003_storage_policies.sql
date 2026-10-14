-- ==============================================================================
-- ZENITH — Team No. 5 | Supabase Storage Buckets & Policies Migration
-- ==============================================================================
-- Buckets:
-- 1. documents: PRIVATE bucket for study guides, resumes, and internal notes.
-- 2. gallery: PUBLIC bucket for cohort photos and whiteboard milestones.
-- 3. avatars: PUBLIC bucket for member profile portraits.
-- ==============================================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('documents', 'documents', false, 15728640, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']),
    ('gallery', 'gallery', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Objects RLS Policies

-- Policy: documents (Private bucket - Authenticated members only)
CREATE POLICY "documents_select_authenticated"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "documents_insert_authenticated"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "documents_delete_owner"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND (auth.uid() = owner OR public.get_auth_role() = 'team_admin'));

-- Policy: gallery (Public read, authenticated upload)
CREATE POLICY "gallery_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "gallery_insert_authenticated"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "gallery_delete_uploader"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery' AND (auth.uid() = owner OR public.get_auth_role() IN ('captain', 'team_admin')));

-- Policy: avatars (Public read, member-scoped upload)
CREATE POLICY "avatars_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own_folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "avatars_update_own_folder"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "avatars_delete_own_folder"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
