export type AppRole = 'team_admin' | 'captain' | 'vice_captain' | 'member';

export type DayStatus = 'upcoming' | 'in_progress' | 'completed';

export type AccessTier = 'internal_only' | 'showcase_public';

export interface Profile {
  id: string;
  team_id: string;
  email: string;
  full_name: string;
  role: AppRole;
  avatar_url: string | null;
  bio: string | null;
  skills: string[];
  linkedin_url: string | null;
  github_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScoreboardGroup {
  id: string;
  group_name: string;
  group_number: number;
  rank: number;
  current_points: number;
  previous_points: number;
  penalty_points: number;
  bonus_points: number;
  notes: string | null;
  is_current_team?: boolean;
  last_updated_by: string | null;
  updated_at: string;
}

export interface ScoreTransaction {
  id: string;
  group_id: string;
  group_name?: string;
  delta_points: number;
  reason: string;
  event_type: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
}

export interface TrainingDay {
  id: string;
  day_number: 1 | 2 | 3 | 4;
  title: string;
  schedule_date: string;
  description: string;
  focus_areas: string[];
  trainer_name?: string;
  status: DayStatus;
  updated_at: string;
}

export interface Reflection {
  id: string;
  day_id: string;
  day_number: 1 | 2 | 3 | 4;
  member_id: string;
  member_name: string;
  member_role: AppRole;
  key_takeaways: string;
  challenges_faced: string;
  action_items: string;
  mood_rating: 1 | 2 | 3 | 4 | 5;
  is_approved_for_showcase: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResourceItem {
  id: string;
  day_id?: string;
  uploader_id: string;
  uploader_name: string;
  title: string;
  category: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  access_level: AccessTier;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  day_id?: string;
  uploader_id: string;
  uploader_name: string;
  media_url: string;
  caption: string;
  tags: string[];
  is_featured_showcase: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  target_table: string;
  target_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: string;
}

export interface AuthSession {
  user: Profile;
  token: string;
  expires_at: number;
}
