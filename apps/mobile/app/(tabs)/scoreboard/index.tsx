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
import { DEMO_SCOREBOARD_GROUPS, ScoreboardGroup } from '@zenith/shared';

export default function ScoreboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [groups, setGroups] = useState<ScoreboardGroup[]>(DEMO_SCOREBOARD_GROUPS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ScoreboardGroup | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Score modification is strictly permitted for Captain and Vice-Captain (and Admin for emergency)
  const canEditScores =
    user?.role === 'captain' || user?.role === 'vice_captain' || user?.role === 'team_admin';

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleOpenEdit = (group: ScoreboardGroup) => {
    if (!canEditScores) return;
    setSelectedGroup(group);
    setModalVisible(true);
  };

  const handleSaveScore = (
    groupId: string,
    delta: number,
    reason: string,
    category: string
  ) => {
    // Optimistic UI calculation with rank recalibration
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          previous_points: g.current_points,
          current_points: g.current_points + delta,
          notes: `${category}: ${reason} (by ${user?.full_name || 'Captain'})`,
        };
      }
      return g;
    });

    // Recompute dense ranks
    updated.sort(
      (a, b) =>
        b.current_points + b.bonus_points - b.penalty_points -
        (a.current_points + a.bonus_points - a.penalty_points)
    );

    const reRanked = updated.map((g, idx) => ({ ...g, rank: idx + 1 }));
    setGroups(reRanked);

    setFeedbackToast(`Adjusted score by ${delta > 0 ? `+${delta}` : delta} for ${selectedGroup?.group_name}`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="LIVE SCOREBOARD"
        subtitle="mPOWER Cohort Standings"
        rightAction={
          <TouchableOpacity
            style={styles.auditBtn}
            onPress={() => router.push('/(tabs)/scoreboard/audit')}
            accessibilityRole="button"
            accessibilityLabel="View Score Audit Ledger"
          >
            <Text style={styles.auditBtnText}>AUDIT LOG 📜</Text>
          </TouchableOpacity>
        }
      />
      <DemoBanner />

      {feedbackToast ? (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>✓ {feedbackToast}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.brandCyan}
          />
        }
      >
        {/* Sync Status Banner */}
        <View style={styles.syncStatusRow}>
          <View style={styles.syncPulse} />
          <Text style={styles.syncStatusText}>
            DEMO SIMULATOR • REALTIME PUSH & FALLBACK POLLING READY
          </Text>
        </View>

        {/* Podium Stage */}
        <PodiumView groups={groups} />

        {/* Role Notice on Score Editing */}
        {canEditScores ? (
          <View style={styles.captainNotice}>
            <Text style={styles.captainNoticeIcon}>★</Text>
            <Text style={styles.captainNoticeText}>
              CAPTAIN PRIVILEGES ACTIVE: Tap 'Adjust Score' on any card to simulate scoring updates.
            </Text>
          </View>
        ) : (
          <View style={styles.memberNotice}>
            <Text style={styles.memberNoticeText}>
              MEMBER VIEW: Live scores are read-only. Score adjustments are restricted to Captain & Vice-Captain.
            </Text>
          </View>
        )}

        {/* Leaderboard Section */}
        <Text style={styles.sectionTitle}>ALL COMPETING GROUPS</Text>
        {groups.map((group) => (
          <ScoreboardCard
            key={group.id}
            group={group}
            canEdit={canEditScores}
            onEditPress={() => handleOpenEdit(group)}
          />
        ))}
      </ScrollView>

      {/* Captain Score Adjustment Modal */}
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
    backgroundColor: COLORS.successSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.success,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  toastText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '700',
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  syncPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brandCyan,
    marginRight: SPACING.xs + 2,
  },
  syncStatusText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  captainNoticeText: {
    color: COLORS.accentGoldBright,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
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
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
});
