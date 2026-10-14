import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, RADII } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { PodiumView } from '../../../src/components/scoreboard/PodiumView';
import { ScoreboardCard } from '../../../src/components/scoreboard/ScoreboardCard';
import { ScoreAdjustmentModal } from '../../../src/components/scoreboard/ScoreAdjustmentModal';
import { InputField } from '../../../src/components/common/InputField';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { ErrorState } from '../../../src/components/common/ErrorState';
import { useRealtimeScoreboard } from '../../../src/hooks/useRealtimeScoreboard';
import { RankedScoreboardGroup } from '@zenith/shared';
import { dataService } from '../../../src/services/dataService';

export default function ScoreboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    groups,
    allGroups,
    syncState,
    lastUpdated,
    searchQuery,
    setSearchQuery,
    isRefreshing,
    refresh,
    error,
  } = useRealtimeScoreboard();

  const [selectedGroup, setSelectedGroup] = useState<RankedScoreboardGroup | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // STRICT RBAC: Only Captain and Vice-Captain may edit scores!
  // Team Admin does NOT have score-editing rights unless holding Captain/Vice-Captain.
  const canEditScores = user?.role === 'captain' || user?.role === 'vice_captain';
  const canViewAudit = user?.role === 'captain' || user?.role === 'vice_captain' || user?.role === 'team_admin';

  const handleOpenEdit = (group: RankedScoreboardGroup) => {
    if (!canEditScores) return;
    setSelectedGroup(group);
    setModalVisible(true);
  };

  const handleSaveScore = async (
    groupId: string,
    delta: number,
    reason: string,
    category: string,
    expectedCurrentPoints: number
  ) => {
    try {
      await dataService.adjustScore(groupId, delta, reason, category);
      await refresh();
      setFeedbackToast({
        type: 'success',
        message: `Successfully recorded ${delta > 0 ? `+${delta}` : delta} pts for ${selectedGroup?.group_name}`,
      });
      setTimeout(() => setFeedbackToast(null), 3500);
    } catch (err: any) {
      setFeedbackToast({
        type: 'error',
        message: err?.message || 'Failed to update score.',
      });
      setTimeout(() => setFeedbackToast(null), 5000);
      throw err;
    }
  };

  const formatLocalTime = (date: Date | null) => {
    if (!date) return 'Waiting for sync...';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <View style={styles.screen}>
      <Header
        title="LIVE SCOREBOARD"
        subtitle="mPOWER Cohort Competition"
        rightAction={
          canViewAudit ? (
            <TouchableOpacity
              style={styles.auditBtn}
              onPress={() => router.push('/(tabs)/scoreboard/audit')}
              accessibilityRole="button"
              accessibilityLabel="View Score Audit Ledger"
            >
              <Text style={styles.auditBtnText}>AUDIT LOG 📜</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      <DemoBanner />

      {feedbackToast ? (
        <View
          style={[
            styles.toastBox,
            feedbackToast.type === 'error' ? styles.toastError : styles.toastSuccess,
          ]}
        >
          <Text
            style={[
              styles.toastText,
              feedbackToast.type === 'error' ? styles.toastTextError : styles.toastTextSuccess,
            ]}
          >
            {feedbackToast.type === 'error' ? '⚠ ' : '✓ '}
            {feedbackToast.message}
          </Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={COLORS.brandCyan}
          />
        }
      >
        {/* Real-time Status & Sync Heartbeat Indicator */}
        <View style={styles.statusBar}>
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusDot,
                syncState === 'live' && styles.dotLive,
                syncState === 'syncing' && styles.dotSyncing,
                syncState === 'stale' && styles.dotStale,
                syncState === 'offline' && styles.dotOffline,
              ]}
            />
            <Text style={styles.statusText}>
              {syncState === 'live'
                ? 'LIVE SUPABASE CDC'
                : syncState === 'syncing'
                ? 'CONNECTING...'
                : syncState === 'stale'
                ? 'REFRESHED (POLLING FALLBACK)'
                : 'OFFLINE CACHED'}
            </Text>
          </View>
          <Text style={styles.lastSyncText}>
            Updated: {formatLocalTime(lastUpdated)}
          </Text>
        </View>

        {error ? (
          <ErrorState
            title="SYNCHRONIZATION ERROR"
            message={error}
            onRetry={refresh}
            retryTitle="Reconnect to Supabase"
          />
        ) : null}

        {/* Search & Filter Bar */}
        <InputField
          label="FILTER COMPETING SQUADS"
          placeholder="Search by group name or rank..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchField}
        />

        {/* Top 3 Podium (Shown when not filtering search) */}
        {!searchQuery ? <PodiumView groups={allGroups} /> : null}

        {/* Role Notice on Score Editing */}
        {canEditScores ? (
          <View style={styles.captainNotice}>
            <Text style={styles.captainNoticeIcon}>★</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.captainNoticeTitle}>CAPTAIN / VICE-CAPTAIN PERMISSIONS ACTIVE</Text>
              <Text style={styles.captainNoticeText}>
                You have authorized clearance to commit score adjustments to the PostgreSQL ledger.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.memberNotice}>
            <Text style={styles.memberNoticeText}>
              READ-ONLY LEADERBOARD: Score modifications are restricted to Captain & Vice-Captain. Team Admin holds governance access.
            </Text>
          </View>
        )}

        {/* Leaderboard Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            RANKED SQUADS ({groups.length} TEAMS)
          </Text>
          <Text style={styles.tiePolicyText}>Standard 1224 Competition Tie Rule</Text>
        </View>

        {groups.length === 0 ? (
          <EmptyState
            title="NO MATCHING SQUADS FOUND"
            description={`No competing squad matched "${searchQuery}".`}
            actionTitle="CLEAR SEARCH"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          groups.map((group) => (
            <ScoreboardCard
              key={group.id}
              group={group}
              canEdit={canEditScores}
              onEditPress={() => handleOpenEdit(group)}
            />
          ))
        )}
      </ScrollView>

      {/* Captain / Vice-Captain Score Adjustment Modal */}
      <ScoreAdjustmentModal
        visible={modalVisible}
        group={selectedGroup}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveScore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },
  auditBtn: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.md,
  },
  auditBtnText: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '700',
  },
  toastBox: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  toastSuccess: {
    backgroundColor: COLORS.successSoft,
    borderBottomColor: COLORS.success,
  },
  toastError: {
    backgroundColor: COLORS.dangerSoft,
    borderBottomColor: COLORS.danger,
  },
  toastText: {
    fontSize: 11,
    fontWeight: '700',
  },
  toastTextSuccess: {
    color: COLORS.success,
  },
  toastTextError: {
    color: '#FCA5A5',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs + 2,
  },
  dotLive: {
    backgroundColor: COLORS.success,
  },
  dotSyncing: {
    backgroundColor: COLORS.brandCyan,
  },
  dotStale: {
    backgroundColor: COLORS.accentGold,
  },
  dotOffline: {
    backgroundColor: COLORS.danger,
  },
  statusText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lastSyncText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  searchField: {
    marginBottom: SPACING.md,
  },
  captainNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentGoldSoft,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  captainNoticeIcon: {
    color: COLORS.accentGoldBright,
    fontSize: 20,
    marginRight: SPACING.md,
  },
  captainNoticeTitle: {
    color: COLORS.accentGoldBright,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  captainNoticeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  memberNotice: {
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADII.lg,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.lg,
  },
  memberNoticeText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tiePolicyText: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '600',
  },
});
