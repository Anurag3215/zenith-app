import {
  AppRole,
  Profile,
  Reflection,
  ResourceItem,
  GalleryItem,
  TrainingDay,
} from '../types';

/**
 * Permitted profile fields that ordinary members may edit on their own profile.
 * Sensitive fields (id, team_id, email, role, is_active) are strictly excluded.
 */
export const PERMITTED_MEMBER_EDIT_FIELDS: readonly (keyof Profile)[] = [
  'bio',
  'skills',
  'linkedin_url',
  'github_url',
  'phone',
  'avatar_url',
] as const;

export const RESTRICTED_PROFILE_FIELDS: readonly (keyof Profile)[] = [
  'id',
  'team_id',
  'email',
  'role',
  'is_active',
  'created_at',
  'updated_at',
] as const;

/**
 * Checks if a specific field on a profile can be edited by an actor.
 */
export function isProfileFieldEditable(
  actorRole: AppRole,
  actorId: string,
  targetProfileId: string,
  field: keyof Profile
): boolean {
  const isSelf = actorId === targetProfileId;

  // Non-self updates are completely blocked for ordinary members
  if (!isSelf && actorRole === 'member') {
    return false;
  }

  // Non-self role changes can only be performed by Team Admin via administrative procedures
  if (!isSelf && actorRole === 'team_admin') {
    return field === 'role';
  }

  // Ordinary members editing their own profile can only edit permitted fields
  if (isSelf) {
    return PERMITTED_MEMBER_EDIT_FIELDS.includes(field);
  }

  return false;
}

/**
 * Filters an updates payload to strip out any unauthorized fields based on the actor's role.
 */
export function filterPermittedProfileUpdates(
  actorRole: AppRole,
  actorId: string,
  targetProfileId: string,
  updates: Partial<Profile>
): { sanitized: Partial<Profile>; strippedFields: string[] } {
  const isSelf = actorId === targetProfileId;
  const sanitized: Partial<Profile> = {};
  const strippedFields: string[] = [];

  for (const [key, value] of Object.entries(updates)) {
    const fieldKey = key as keyof Profile;
    if (isProfileFieldEditable(actorRole, actorId, targetProfileId, fieldKey)) {
      (sanitized as Record<string, unknown>)[fieldKey] = value;
    } else {
      strippedFields.push(key);
    }
  }

  return { sanitized, strippedFields };
}

/**
 * Validates reflection text and constraints before persistence.
 */
export function validateReflectionSubmission(entry: {
  key_takeaways?: string;
  day_number?: number;
  mood_rating?: number;
}): { valid: boolean; error?: string } {
  if (!entry.key_takeaways || entry.key_takeaways.trim().length < 10) {
    return {
      valid: false,
      error: 'Key takeaways must contain at least 10 meaningful characters.',
    };
  }

  if (
    entry.day_number === undefined ||
    entry.day_number < 1 ||
    entry.day_number > 4
  ) {
    return {
      valid: false,
      error: 'Curriculum day must be between 1 and 4.',
    };
  }

  if (
    entry.mood_rating === undefined ||
    entry.mood_rating < 1 ||
    entry.mood_rating > 5
  ) {
    return {
      valid: false,
      error: 'Confidence / Mastery rating must be an integer between 1 and 5.',
    };
  }

  return { valid: true };
}

/**
 * Authority check for endorsing or unpublishing a reflection for the Evaluator Web Showcase.
 * Strictly permitted only for Captain, Vice-Captain, and Team Admin.
 */
export function canUserApproveShowcase(role?: AppRole): boolean {
  if (!role) return false;
  return role === 'captain' || role === 'vice_captain' || role === 'team_admin';
}

/**
 * Evaluator public view filter:
 * Strictly exposes published reflections approved for showcase, never drafts or unapproved items.
 */
export function filterShowcaseReflections(reflections: Reflection[]): Reflection[] {
  return reflections.filter(
    (r) => !r.is_draft && r.is_approved_for_showcase === true
  );
}

/**
 * Filters reflections viewable by a specific user within the mobile app workspace.
 */
export function filterWorkspaceReflections(
  reflections: Reflection[],
  currentUserId?: string,
  filterType: 'all' | 'my' | 'showcase' = 'all'
): Reflection[] {
  return reflections.filter((r) => {
    // Drafts are ONLY visible to the author who created them
    if (r.is_draft && r.member_id !== currentUserId) {
      return false;
    }

    // Private reflections are ONLY visible to the author
    if (r.visibility === 'private' && r.member_id !== currentUserId) {
      return false;
    }

    if (filterType === 'my') {
      return r.member_id === currentUserId;
    }

    if (filterType === 'showcase') {
      return !r.is_draft && r.is_approved_for_showcase;
    }

    return true;
  });
}

/**
 * Evaluator public view filter for learning resources.
 * Evaluators can ONLY access items explicitly tagged as 'showcase_public'.
 */
export function filterShowcaseResources(resources: ResourceItem[]): ResourceItem[] {
  return resources.filter((item) => item.access_level === 'showcase_public');
}

/**
 * Resource upload validation rules.
 */
export const MAX_DOCUMENT_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

export function validateResourceUpload(file: {
  size: number;
  mimeType: string;
  title: string;
}): { valid: boolean; error?: string } {
  if (!file.title || file.title.trim().length < 3) {
    return { valid: false, error: 'Document title must be at least 3 characters long.' };
  }
  if (file.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size exceeds maximum permitted limit (15 MB).' };
  }
  if (!ALLOWED_DOCUMENT_MIMES.includes(file.mimeType)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.mimeType}). Allowed: PDF, Word, Images.`,
    };
  }
  return { valid: true };
}

/**
 * Evaluator public view filter for media gallery items.
 */
export function filterShowcaseGallery(items: GalleryItem[]): GalleryItem[] {
  return items.filter((item) => item.is_featured_showcase === true);
}

/**
 * Validates 4-Day placement timeline state:
 * Day 1 is completed.
 * Days 2–4 are strictly upcoming with pending placeholders (no fabricated milestones).
 */
export function validateCurriculumIntegrity(days: TrainingDay[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const day1 = days.find((d) => d.day_number === 1);
  if (!day1 || day1.status !== 'completed') {
    errors.push('Day 1 must be present and marked as completed.');
  }

  const upcomingDays = days.filter((d) => d.day_number > 1);
  for (const day of upcomingDays) {
    if (day.status === 'completed') {
      errors.push(
        `Day ${day.day_number} must not be marked completed prior to actual faculty delivery.`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

export interface PublicProfile {
  id: string;
  full_name: string;
  role: AppRole;
  skills: string[];
  bio: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

/**
 * Strips private contact info (email, phone, account status) for public showcase consumption.
 */
export function sanitizePublicProfile(profile: Profile): PublicProfile {
  return {
    id: profile.id,
    full_name: profile.full_name,
    role: profile.role,
    skills: [...profile.skills],
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    linkedin_url: profile.linkedin_url,
    github_url: profile.github_url,
  };
}

