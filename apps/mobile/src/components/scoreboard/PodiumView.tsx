import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScoreboardGroup } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../theme';

interface PodiumViewProps {
  groups: ScoreboardGroup[];
  onSelectGroup?: (group: ScoreboardGroup) => void;
}

export const PodiumView: React.FC<PodiumViewProps> = ({ groups }) => {
  const top1 = groups.find((g) => g.rank === 1) || groups[0];
  const top2 = groups.find((g) => g.rank === 2) || groups[1];
  const top3 = groups.find((g) => g.rank === 3) || groups[2];

  const renderPodiumStep = (
    group: ScoreboardGroup | undefined,
    place: 1 | 2 | 3,
    height: number,
    color: string,
    badgeText: string,
    glyph: string
  ) => {
    if (!group) return <View style={[styles.stepCol, { height }]} />;

    const isOurTeam = group.is_current_team;

    return (
      <View style={styles.stepCol} accessibilityRole="summary" accessibilityLabel={`${place} place: ${group.group_name}, ${group.current_points} points`}>
        {/* Crown / Glyph Indicator */}
        <View style={[styles.glyphContainer, { borderColor: color }]}>
          <Text style={[styles.glyphText, { color }]}>{glyph}</Text>
        </View>

        {/* Group Name & Points */}
        <Text numberOfLines={1} style={[styles.groupName, isOurTeam && styles.ourTeamName]}>
          {group.group_name}
        </Text>
        <Text style={[styles.pointsText, { color }]}>{group.current_points} pts</Text>

        {/* Physical Podium Pedestal */}
        <View
          style={[
            styles.pedestal,
            {
              height,
              borderColor: isOurTeam ? COLORS.brandCyan : color,
              borderTopColor: color,
            },
            isOurTeam && styles.ourTeamPedestal,
          ]}
        >
          <View style={[styles.rankBadge, { backgroundColor: color }]}>
            <Text style={styles.rankBadgeText}>{badgeText}</Text>
          </View>
          <Text style={styles.pedestalSubtext}>
            {place === 1 ? 'GOLD LEADER' : place === 2 ? 'SILVER' : 'BRONZE'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>CURRENT PODIUM STANDINGS</Text>
      <View style={styles.podiumRow}>
        {/* 2nd Place (Left) */}
        {renderPodiumStep(top2, 2, 100, COLORS.podiumSilver, '2nd', 'II')}

        {/* 1st Place (Center - Highest) */}
        {renderPodiumStep(top1, 1, 135, COLORS.podiumGold, '1st', '★ I')}

        {/* 3rd Place (Right) */}
        {renderPodiumStep(top3, 3, 80, COLORS.podiumBronze, '3rd', 'III')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.lg,
  },
  heading: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  glyphContainer: {
    width: 32,
    height: 32,
    borderRadius: RADII.full,
    borderWidth: 1.5,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  glyphText: {
    fontWeight: '800',
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  groupName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  ourTeamName: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
  },
  pointsText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  pedestal: {
    width: '100%',
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADII.lg,
    borderTopRightRadius: RADII.lg,
    borderTopWidth: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: SPACING.sm,
  },
  ourTeamPedestal: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderLeftColor: COLORS.brandCyan,
    borderRightColor: COLORS.brandCyan,
  },
  rankBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
    marginBottom: 4,
  },
  rankBadgeText: {
    color: '#050814',
    fontSize: 10,
    fontWeight: '800',
  },
  pedestalSubtext: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
