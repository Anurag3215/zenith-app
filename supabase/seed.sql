-- ==============================================================================
-- ZENITH — Team No. 5 | Development & Local Test Seed Script
-- ==============================================================================
-- NOTICE: For development, local simulation, and evaluator demonstration only.
-- All credentials and member entities are strictly labeled demonstration placeholders.
-- Production deployments must never be seeded with test data.
-- ==============================================================================

-- 1. Master Team Record (Team No. 5 - ZENITH)
INSERT INTO public.teams (id, team_number, name, motto, logo_url)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    5,
    'ZENITH',
    '[Official Team Motto Pending Formal Adoption]',
    NULL
) ON CONFLICT (team_number) DO UPDATE
SET name = EXCLUDED.name, motto = EXCLUDED.motto;

-- 2. Provision the Exactly 8 Authorized Member Accounts in auth.users & profiles
-- Passwords in local/test environment use pre-hashed standard bcrypt for test: "zenith2026"
-- Hash: $2a$10$wT4n4N9L1k0R8c0Wb0MeeOJ9dK4a4x8G4w6v7j9k0l1m2n3o4p5q6 (or standard Supabase extension)
DO $$
DECLARE
    v_team_id UUID := '55555555-5555-5555-5555-555555555555';
    v_u1 UUID := '11111111-1111-1111-1111-111111111111';
    v_u2 UUID := '22222222-2222-2222-2222-222222222222';
    v_u3 UUID := '33333333-3333-3333-3333-333333333333';
    v_u4 UUID := '44444444-4444-4444-4444-444444444444';
    v_u5 UUID := '55555555-5555-5555-5555-555555555556';
    v_u6 UUID := '66666666-6666-6666-6666-666666666666';
    v_u7 UUID := '77777777-7777-7777-7777-777777777777';
    v_u8 UUID := '88888888-8888-8888-8888-888888888888';
BEGIN
    -- Insert auth.users if supported by local Supabase instance
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES
        (v_u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@zenith5.edu', crypt('zenith2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Candidate 01 [Admin Pending]"}', now(), now()),
        (v_u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'captain@zenith5.edu', crypt('zenith2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Candidate 02 [Captain Pending]"}', now(), now()),
        (v_u3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vicecaptain@zenith5.edu', crypt('zenith2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Candidate 03 [Vice-Captain Pending]"}', now(), now()),
        (v_u4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member4@zenith5.edu', crypt('zenith2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Candidate 04 [Member Pending]"}', now(), now()),
        (v_u5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member5@zenith5.edu', crypt('zenith2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Candidate 05 [Member Pending]"}', now(), now()),
        (v_u6, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member6@zenith5.edu', crypt('zenith2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Candidate 06 [Member Pending]"}', now(), now()),
        (v_u7, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member7@zenith5.edu', crypt('zenith2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Candidate 07 [Member Pending]"}', now(), now()),
        (v_u8, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member8@zenith5.edu', crypt('zenith2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Candidate 08 [Member Pending]"}', now(), now())
    ON CONFLICT (id) DO NOTHING;

    -- Insert public.profiles for the 8 members
    INSERT INTO public.profiles (id, team_id, email, full_name, role, bio, skills, is_active)
    VALUES
        (v_u1, v_team_id, 'admin@zenith5.edu', 'Candidate 01 [Team Admin Pending]', 'team_admin', '[Official Biography Pending Institutional Verification]', '["Project Governance", "Cloud Architecture", "Agile Delivery"]'::jsonb, true),
        (v_u2, v_team_id, 'captain@zenith5.edu', 'Candidate 02 [Captain Pending]', 'captain', '[Official Biography Pending Institutional Verification]', '["Competitive Programming", "Data Structures", "Team Leadership"]'::jsonb, true),
        (v_u3, v_team_id, 'vicecaptain@zenith5.edu', 'Candidate 03 [Vice-Captain Pending]', 'vice_captain', '[Official Biography Pending Institutional Verification]', '["System Design", "Algorithms", "Peer Coaching"]'::jsonb, true),
        (v_u4, v_team_id, 'member4@zenith5.edu', 'Candidate 04 [Member Pending]', 'member', '[Official Biography Pending Institutional Verification]', '["Frontend Engineering", "React", "TypeScript"]'::jsonb, true),
        (v_u5, v_team_id, 'member5@zenith5.edu', 'Candidate 05 [Member Pending]', 'member', '[Official Biography Pending Institutional Verification]', '["Backend Engineering", "Python", "PostgreSQL"]'::jsonb, true),
        (v_u6, v_team_id, 'member6@zenith5.edu', 'Candidate 06 [Member Pending]', 'member', '[Official Biography Pending Institutional Verification]', '["Data Science", "Machine Learning", "Quantitative Aptitude"]'::jsonb, true),
        (v_u7, v_team_id, 'member7@zenith5.edu', 'Candidate 07 [Member Pending]', 'member', '[Official Biography Pending Institutional Verification]', '["DevOps & CI/CD", "Docker", "Linux Systems"]'::jsonb, true),
        (v_u8, v_team_id, 'member8@zenith5.edu', 'Candidate 08 [Member Pending]', 'member', '[Official Biography Pending Institutional Verification]', '["UI/UX Design", "Product Discovery", "Design Thinking"]'::jsonb, true)
    ON CONFLICT (id) DO UPDATE
    SET role = EXCLUDED.role, full_name = EXCLUDED.full_name, skills = EXCLUDED.skills;
END $$;

-- 3. Competition Scoreboard Groups (10 Groups, Group 5 is ZENITH)
INSERT INTO public.scoreboard_groups (id, group_name, group_number, rank, current_points, previous_points, bonus_points, penalty_points, notes)
VALUES
    ('aaaaaaaa-0001-0000-0000-000000000001', 'Group 01 (Apex)', 1, 1, 480, 420, 40, 0, 'Leader in Day 1 Aptitude Sprint'),
    ('aaaaaaaa-0005-0000-0000-000000000005', 'ZENITH (Team 5)', 5, 2, 465, 395, 50, 0, 'Top performing squad in Technical Coding round'),
    ('aaaaaaaa-0003-0000-0000-000000000003', 'Group 03 (Vanguard)', 3, 3, 440, 400, 30, 10, 'Consistent GD presentation scores'),
    ('aaaaaaaa-0002-0000-0000-000000000002', 'Group 02 (Titan)', 2, 4, 410, 380, 20, 0, 'Strong in Mock HR interviews'),
    ('aaaaaaaa-0004-0000-0000-000000000004', 'Group 04 (Pulse)', 4, 5, 390, 360, 15, 15, NULL),
    ('aaaaaaaa-0006-0000-0000-000000000006', 'Group 06 (Catalyst)', 6, 6, 375, 350, 10, 0, NULL),
    ('aaaaaaaa-0007-0000-0000-000000000007', 'Group 07 (Nova)', 7, 7, 350, 330, 10, 5, NULL),
    ('aaaaaaaa-0008-0000-0000-000000000008', 'Group 08 (Orbit)', 8, 8, 330, 310, 5, 0, NULL),
    ('aaaaaaaa-0009-0000-0000-000000000009', 'Group 09 (Sigma)', 9, 9, 310, 300, 0, 0, NULL),
    ('aaaaaaaa-0010-0000-0000-000000000010', 'Group 10 (Vector)', 10, 10, 290, 280, 0, 0, NULL)
ON CONFLICT (group_number) DO NOTHING;

-- 4. Four-Day Placement Curriculum
INSERT INTO public.training_days (id, day_number, title, schedule_date, description, focus_areas, status, trainer_name)
VALUES
    ('bbbbbbbb-0001-0000-0000-000000000001', 1, 'Aptitude Mastery, Orientation & Soft Skills Foundation', '2026-10-15', 'Cohort orientation, mPOWER competition briefing, quantitative aptitude baseline assessment, and professional communication standards.', '["Number Systems & Speed Math", "Logical Deductions", "Verbal Ability", "STAR Framing", "Team Norms"]'::jsonb, 'completed', 'Senior Corporate Trainer [Lead 1]'),
    ('bbbbbbbb-0002-0000-0000-000000000002', 2, 'Technical Deep Dive & Problem Solving [Upcoming]', '2026-10-16', '[Session Details Awaiting Delivery from Faculty - Scheduled for Day 2 Delivery]', '["[Pending Faculty Delivery]", "[Awaiting Curriculum Release]"]'::jsonb, 'upcoming', '[Faculty Allocation Pending]'),
    ('bbbbbbbb-0003-0000-0000-000000000003', 3, 'Mock Interviews & Group Discussions [Upcoming]', '2026-10-17', '[Session Details Awaiting Delivery from Faculty - Scheduled for Day 3 Delivery]', '["[Pending Faculty Delivery]", "[Awaiting Curriculum Release]"]'::jsonb, 'upcoming', '[Faculty Allocation Pending]'),
    ('bbbbbbbb-0004-0000-0000-000000000004', 4, 'Grand Evaluation & Placement Readiness [Upcoming]', '2026-10-18', '[Session Details Awaiting Delivery from Faculty - Scheduled for Day 4 Delivery]', '["[Pending Faculty Delivery]", "[Awaiting Curriculum Release]"]'::jsonb, 'upcoming', '[Evaluation Jury Allocation Pending]')
ON CONFLICT (day_number) DO NOTHING;

-- 5. Seed Initial Audit Log
INSERT INTO public.audit_logs (actor_id, action, target_table, target_id, new_values)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'SEED_PROVISIONING',
    'profiles',
    '8_ACCOUNTS',
    '{"message": "Initialized 8 authorized accounts with role segregation"}'::jsonb
);
