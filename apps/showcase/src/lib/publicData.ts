import {
  DEMO_PROFILES,
  DEMO_SCOREBOARD_GROUPS,
  DEMO_TRAINING_DAYS,
  DEMO_REFLECTIONS,
  DEMO_RESOURCES,
  DEMO_GALLERY,
  Profile,
  ScoreboardGroup,
  TrainingDay,
  Reflection,
  ResourceItem,
  GalleryItem,
  filterShowcaseReflections,
  filterShowcaseResources,
  filterShowcaseGallery,
} from '@zenith/shared';

/**
 * Public Sanitized Profile representation.
 * Explicitly strips sensitive fields: email, phone, is_active, team_id, created_at, updated_at.
 */
export interface PublicProfile {
  id: string;
  full_name: string;
  role: Profile['role'];
  avatar_url: string | null;
  bio: string | null;
  skills: string[];
  linkedin_url: string | null;
  github_url: string | null;
}

/**
 * Strips private contact and administrative credentials from member profiles.
 */
export function sanitizePublicProfile(profile: Profile): PublicProfile {
  return {
    id: profile.id,
    full_name: profile.full_name,
    role: profile.role,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    skills: profile.skills,
    linkedin_url: profile.linkedin_url,
    github_url: profile.github_url,
  };
}

/**
 * Public Data Bundle for Evaluators.
 * Strictly constrained by the Public Content Allowlist.
 */
export interface PublicShowcaseData {
  teamName: string;
  teamNumber: number;
  programName: string;
  tagline: string;
  snapshotTimestamp: string;
  roster: PublicProfile[];
  trainingDays: TrainingDay[];
  scoreboard: ScoreboardGroup[];
  reflections: Reflection[];
  resources: ResourceItem[];
  gallery: GalleryItem[];
}

/**
 * Retrieves public showcase data.
 * Guarantees that private drafts, member-only documents, and unapproved items are filtered out.
 */
export function getPublicShowcaseData(): PublicShowcaseData {
  // 1. Sanitize all 8 authorized profiles (no emails/phones)
  const publicRoster = DEMO_PROFILES.map(sanitizePublicProfile);

  // 2. Verified 4-day curriculum (Day 1 completed, Days 2-4 upcoming)
  const publicDays = DEMO_TRAINING_DAYS;

  // 3. Read-only Scoreboard standing (Deterministic 1224 rank order)
  const publicScoreboard = [...DEMO_SCOREBOARD_GROUPS].sort(
    (a, b) => a.rank - b.rank || a.group_number - b.group_number
  );

  // 4. Showcase-endorsed reflections (non-draft, approved only)
  const publicReflections = filterShowcaseReflections(DEMO_REFLECTIONS);

  // 5. Showcase-public resources (internal files excluded)
  const publicResources = filterShowcaseResources(DEMO_RESOURCES);

  // 6. Featured gallery images
  const publicGallery = filterShowcaseGallery(DEMO_GALLERY);

  return {
    teamName: 'ZENITH',
    teamNumber: 5,
    programName: 'mPOWER Placement Training Program',
    tagline: 'Precision, Teamwork, and Placement Excellence',
    snapshotTimestamp: '2026-10-15T00:00:00Z',
    roster: publicRoster,
    trainingDays: publicDays,
    scoreboard: publicScoreboard,
    reflections: publicReflections,
    resources: publicResources,
    gallery: publicGallery,
  };
}
