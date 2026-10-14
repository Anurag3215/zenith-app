import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScoreboardGroup } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';
import { Badge } from '../common/Badge';

interface ScoreboardCardProps {
  group: ScoreboardGroup;
  onPress?: () => void;
  canEdit?: boolean;
  onEditPress?: () => void;
}

export const ScoreboardCard: React.FC<ScoreboardCardProps> = ({
  group,
  onPress,
  canEdit = false,
  onEditPress,
}) => {
  const isOurTeam = group.is_current_team;
  const pointDelta = group.current_points - group.previous_points;

  const getRankGlyph = (r: number) => {
    if (r === 1) return '★ 1st';
    if (r === 2) return '◈ 2nd';
    if (r === 3) return '▲ 3rd';
    return `#0${r}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isOurTeam && styles.ourTeamCard,
        group.rank === 1 && styles.firstPlaceCard,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      accessibilityRole="summary"
      accessibilityLabel={`Rank ${group.rank}, ${group.group_name}, ${group.current_points} points`}
    >
      <View style={styles.topRow}>
        {/* Left: Rank & Group info */}
        <View style={styles.leftMeta}>
          <View
            style={[
              styles.rankBadge,
              group.rank === 1 && styles.rankBadgeGold,
              group.rank === 2 && styles.rankBadgeSilver,
              group.rank === 3 && styles.rankBadgeBronze,
            ]}
          >
            <Text
              style={[
                styles.rankText,
                group.rank === 1 && styles.rankTextGold,
                group.rank === 2 && styles.rankTextSilver,
                group.rank === 3 && styles.rankTextBronze,
              ]}
            >
              {getRankGlyph(group.rank)}
            </Text>
          </View>

          <View style={styles.nameBlock}>
            <View style={styles.titleWithBadge}>
              <Text style={[styles.groupName, isOurTeam && styles.ourTeamText]}>
                {group.group_name}
              </Text>
              {isOurTeam ? (
                <View style={styles.ourBadge}>
                  <Text style={styles.ourBadgeText}>OUR SQUAD</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.cohortSubtext}>
              Group {group.group_number} • Cohort Standings
            </Text>
          </View>
        </View>

        {/* Right: Point Total */}
        <View style={styles.rightPoints}>
          <Text style={[styles.pointsTotal, isOurTeam && styles.ourPointsTotal]}>
            {group.current_points}
          </Text>
          <Text style={styles.pointsLabel}>POINTS</Text>
        </View>
      </View>

      {/* Bottom Bar: Modifiers & Delta */}
      <View style={styles.bottomRow}>
        <View style={styles.pillsRow}>
          {pointDelta > 0 ? (
            <View style={styles.deltaPillPositive}>
              <Text style={styles.deltaTextPositive}>+{pointDelta} recent</Text>
            </View>
          ) : pointDelta < 0 ? (
            <View style={styles.deltaPillNegative}>
              <Text style={styles.deltaTextNegative}>{pointDelta} recent</Text>
            </View>
          ) : (
            <View style={styles.deltaPillNeutral}>
              <Text style={styles.deltaTextNeutral}>±0 neutral</Text>
            </View>
          )}

          {group.bonus_points > 0 ? (
            <View style={styles.bonusPill}>
              <Text style={styles.bonusText}>+{group.bonus_points} bonus</Text>
            </View>
          ) : null}

          {group.penalty_points > 0 ? (
            <View style={styles.penaltyPill}>
              <Text style={styles.penaltyText}>-{group.penalty_points} penalty</Text>
            </View>
          ) : null}
        </View>

        {canEdit ? (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={onEditPress}
            accessibilityRole="button"
            accessibilityLabel={`Edit score for ${group.group_name}`}
          >
            <Text style={styles.editBtnText}>ADJUST SCORE ✎</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {group.notes ? (
        <Text style={styles.notesText} numberOfLines={1}>
          Note: {group.notes}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  ourTeamCard: {
    borderColor: COLORS.brandCyan,
    backgroundColor: 'rgba(16, 28, 61, 0.95)',
    borderWidth: 1.5,
    ...SHADOWS.glowCyan,
  },
  firstPlaceCard: {
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  },
  rankBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    minWidth: 44,
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rankBadgeGold: {
    backgroundColor: COLORS.accentGoldSoft,
    borderColor: COLORS.accentGold,
  },
  rankBadgeSilver: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: '#94A3B8',
  },
  rankBadgeBronze: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderColor: '#D97706',
  },
  rankText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  rankTextGold: {
    color: COLORS.accentGoldBright,
  },
  rankTextSilver: {
    color: '#E2E8F0',
  },
  rankTextBronze: {
    color: '#FDBA74',
  },
  nameBlock: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  groupName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    marginRight: SPACING.sm,
  },
  ourTeamText: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
  },
  ourBadge: {
    backgroundColor: COLORS.brandCyanSoft,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.brandCyan,
  },
  ourBadgeText: {
    color: COLORS.brandCyanLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cohortSubtext: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
  },
  rightPoints: {
    alignItems: 'flex-end',
  },
  pointsTotal: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ourPointsTotal: {
    color: COLORS.brandCyanLight,
  },
  pointsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm + 2,
    paddingTop: SPACING.xs + 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  deltaPillPositive: {
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
    marginRight: SPACING.xs,
  },
  deltaTextPositive: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '700',
  },
  deltaPillNegative: {
    backgroundColor: COLORS.dangerSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
    marginRight: SPACING.xs,
  },
  deltaTextNegative: {
    color: COLORS.danger,
    fontSize: 10,
    fontWeight: '700',
  },
  deltaPillNeutral: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
    marginRight: SPACING.xs,
  },
  deltaTextNeutral: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  bonusPill: {
    backgroundColor: COLORS.accentGoldSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
    marginRight: SPACING.xs,
  },
  bonusText: {
    color: COLORS.accentGoldBright,
    fontSize: 10,
    fontWeight: '700',
  },
  penaltyPill: {
    backgroundColor: COLORS.dangerSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
  },
  penaltyText: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '700',
  },
  editBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.brandElectric,
  },
  editBtnText: {
    color: COLORS.brandElectricGlow,
    fontSize: 10,
    fontWeight: '700',
  },
  notesText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
});
