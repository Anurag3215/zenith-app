import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  ScoreboardGroup,
  calculateCompetitionRankings,
  RankedScoreboardGroup,
} from '@zenith/shared';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { dataService } from '../services/dataService';

export type SyncState = 'live' | 'syncing' | 'offline' | 'stale';

interface UseRealtimeScoreboardReturn {
  groups: RankedScoreboardGroup[];
  allGroups: RankedScoreboardGroup[];
  syncState: SyncState;
  lastUpdated: Date | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
  error: string | null;
}

export function useRealtimeScoreboard(): UseRealtimeScoreboardReturn {
  const [rawGroups, setRawGroups] = useState<ScoreboardGroup[]>([]);
  const [syncState, setSyncState] = useState<SyncState>('syncing');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<any>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch latest data from database or verified mock fallback
  const loadScoreboardData = useCallback(async (isManualPull = false) => {
    if (isManualPull) setIsRefreshing(true);
    setError(null);

    try {
      const data = await dataService.fetchScoreboard();
      setRawGroups(data);
      setLastUpdated(new Date());

      if (isSupabaseConfigured) {
        // If channel is connected, status is live; else fallback refreshed
        setSyncState((prev) => (prev === 'live' ? 'live' : 'stale'));
      } else {
        setSyncState('stale');
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to sync competition scores.');
      setSyncState('offline');
    } finally {
      if (isManualPull) setIsRefreshing(false);
    }
  }, []);

  // Initial load and Realtime channel setup
  useEffect(() => {
    loadScoreboardData();

    if (isSupabaseConfigured) {
      setSyncState('syncing');

      // Setup Supabase Realtime WebSocket subscription
      const channel = supabase
        .channel('scoreboard-live-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'scoreboard_groups' },
          () => {
            // Instant push notification on any score alteration
            loadScoreboardData();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setSyncState('live');
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setSyncState('stale');
          }
        });

      channelRef.current = channel;

      // 10-second polling fallback in case WebSocket drops
      pollingTimerRef.current = setInterval(() => {
        loadScoreboardData();
      }, 10000);

      // AppState foreground/background handling
      const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
        if (nextState === 'active') {
          loadScoreboardData();
        }
      });

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
        }
        if (pollingTimerRef.current) {
          clearInterval(pollingTimerRef.current);
        }
        subscription.remove();
      };
    } else {
      setSyncState('stale');
    }
  }, [loadScoreboardData]);

  // Compute 1224 competition rankings
  const allRankedGroups = calculateCompetitionRankings(rawGroups);

  // Filter by search query
  const filteredGroups = allRankedGroups.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      g.group_name.toLowerCase().includes(q) ||
      `group ${g.group_number}`.includes(q) ||
      `#0${g.rank}`.includes(q)
    );
  });

  return {
    groups: filteredGroups,
    allGroups: allRankedGroups,
    syncState,
    lastUpdated,
    searchQuery,
    setSearchQuery,
    isRefreshing,
    refresh: () => loadScoreboardData(true),
    error,
  };
}
