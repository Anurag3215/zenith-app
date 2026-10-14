import {
  ScoreboardGroup,
  Profile,
  TrainingDay,
  Reflection,
  ResourceItem,
  GalleryItem,
  AuditLog,
  DEMO_SCOREBOARD_GROUPS,
  DEMO_PROFILES,
  DEMO_TRAINING_DAYS,
  DEMO_REFLECTIONS,
  DEMO_RESOURCES,
  DEMO_GALLERY,
  DEMO_AUDIT_LOGS,
} from '@zenith/shared';
import { supabase, isSupabaseConfigured } from './supabase';

export const dataService = {
  // Scoreboard
  async fetchScoreboard(): Promise<ScoreboardGroup[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('scoreboard_groups')
        .select('*')
        .order('rank', { ascending: true });

      if (error) throw error;
      return data.map((g) => ({
        ...g,
        is_current_team: g.group_number === 5,
      }));
    }
    return DEMO_SCOREBOARD_GROUPS;
  },

  // Atomic Score Adjustment (Restricted to Captain & Vice-Captain via RPC)
  async adjustScore(
    groupId: string,
    delta: number,
    reason: string,
    category: string
  ): Promise<ScoreboardGroup> {
    if (isSupabaseConfigured) {
      // Calls PostgreSQL RPC which strictly verifies auth.uid() role IN ('captain', 'vice_captain')
      const { data, error } = await supabase.rpc('adjust_group_score', {
        p_group_id: groupId,
        p_delta_points: delta,
        p_reason: `${category}: ${reason}`,
        p_event_type: 'competition_adjustment',
      });

      if (error) throw error;
      return data as ScoreboardGroup;
    }

    // Local simulation fallback
    const target = DEMO_SCOREBOARD_GROUPS.find((g) => g.id === groupId);
    if (!target) throw new Error('Group not found');
    return {
      ...target,
      previous_points: target.current_points,
      current_points: target.current_points + delta,
      notes: `${category}: ${reason}`,
    };
  },

  // Team Profiles
  async fetchProfiles(): Promise<Profile[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data as Profile[];
    }
    return DEMO_PROFILES;
  },

  // Curriculum Days
  async fetchTrainingDays(): Promise<TrainingDay[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('training_days')
        .select('*')
        .order('day_number', { ascending: true });

      if (error) throw error;
      return data as TrainingDay[];
    }
    return DEMO_TRAINING_DAYS;
  },

  // Reflections
  async fetchReflections(): Promise<Reflection[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('reflections')
        .select(`
          *,
          profiles:member_id (full_name, role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map((r: any) => ({
        ...r,
        member_name: r.profiles?.full_name || '[Candidate Name Pending]',
        member_role: r.profiles?.role || 'member',
      }));
    }
    return DEMO_REFLECTIONS;
  },

  async submitReflection(payload: Omit<Reflection, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('reflections').insert({
        day_id: payload.day_id,
        member_id: payload.member_id,
        key_takeaways: payload.key_takeaways,
        challenges_faced: payload.challenges_faced,
        action_items: payload.action_items,
        mood_rating: payload.mood_rating,
        is_approved_for_showcase: false,
      });

      if (error) throw error;
      return;
    }
  },

  async toggleShowcaseApproval(reflectionId: string, currentStatus: boolean): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('reflections')
        .update({ is_approved_for_showcase: !currentStatus })
        .eq('id', reflectionId);

      if (error) throw error;
    }
  },

  // Resources
  async fetchResources(): Promise<ResourceItem[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('resources_documents')
        .select(`
          *,
          profiles:uploader_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map((res: any) => ({
        ...res,
        uploader_name: res.profiles?.full_name || 'Team 5 Member',
      }));
    }
    return DEMO_RESOURCES;
  },

  // Gallery
  async fetchGallery(): Promise<GalleryItem[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('gallery_items')
        .select(`
          *,
          profiles:uploader_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map((item: any) => ({
        ...item,
        uploader_name: item.profiles?.full_name || 'Team 5 Member',
      }));
    }
    return DEMO_GALLERY;
  },

  // Audit Logs (Restricted to Team Admin)
  async fetchAuditLogs(): Promise<AuditLog[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:actor_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data.map((log: any) => ({
        ...log,
        actor_name: log.profiles?.full_name || 'System / Admin',
      }));
    }
    return DEMO_AUDIT_LOGS;
  },
};
