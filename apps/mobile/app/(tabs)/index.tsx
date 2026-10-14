import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { Header } from '../../src/components/common/Header';
import { DemoBanner } from '../../src/components/common/DemoBanner';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { DEMO_SCOREBOARD_GROUPS, DEMO_TRAINING_DAYS } from '@zenith/shared';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const ourTeam =
    DEMO_SCOREBOARD_GROUPS.find((g) => g.is_current_team) || DEMO_SCOREBOARD_GROUPS[1];
  const activeDay =
    DEMO_TRAINING_DAYS.find((d) => d.status === 'in_progress') || DEMO_TRAINING_DAYS[1];

  return (
    <View style={styles.screen}>
      <Header
        title="ZENITH"
        subtitle="Team No. 5 Workspace"
      />
      <DemoBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Welcome Greeting */}
        <View style={styles.greetingBox}>
          <Text style={styles.welcomeLabel}>WELCOME BACK,</Text>
          <Text style={styles.userName}>{user?.full_name || 'Team Member'}</Text>
          <Text style={styles.userRoleText}>
            Operational Role: <Text style={styles.roleHighlight}>{user?.role.replace('_', ' ').toUpperCase()}</Text>
          </Text>
        </View>

        {/* Hero Card: Live Standing Snapshot */}
        <Card variant="highlighted" style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroPre}>COMPETITION STANDINGS</Text>
              <Text style={styles.heroSquadName}>ZENITH — TEAM 05</Text>
            </View>
            <View style={styles.rankPill}>
              <Text style={styles.rankPillText}>RANK #{ourTeam.rank}</Text>
            </View>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{ourTeam.current_points}</Text>
              <Text style={styles.statLabel}>TOTAL POINTS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statNumber, styles.deltaColor]}>
                +{ourTeam.current_points - ourTeam.previous_points}
              </Text>
              <Text style={styles.statLabel}>RECENT GAIN</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>+{ourTeam.bonus_points}</Text>
              <Text style={styles.statLabel}>BONUS POINTS</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.heroActionBtn}
            onPress={() => router.push('/(tabs)/scoreboard')}
            accessibilityRole="button"
            accessibilityLabel="View full competition leaderboard"
          >
            <Text style={styles.heroActionText}>OPEN FULL SCOREBOARD →</Text>
          </TouchableOpacity>
        </Card>

        {/* Current Active Journey Day */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CURRENT TRAINING MILESTONE</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/journey')}>
            <Text style={styles.sectionActionText}>VIEW 4 DAYS →</Text>
          </TouchableOpacity>
        </View>

        <Card variant="default" style={styles.journeyCard}>
          <View style={styles.journeyHeader}>
            <View>
              <Text style={styles.dayIndex}>DAY 0{activeDay.day_number} ACTIVE</Text>
              <Text style={styles.dayDate}>{activeDay.schedule_date}</Text>
            </View>
            <Badge label="IN PROGRESS" variant="status" status="in_progress" />
          </View>

          <Text style={styles.dayTitle}>{activeDay.title}</Text>
          <Text style={styles.dayDesc} numberOfLines={2}>
            {activeDay.description}
          </Text>

          <View style={styles.focusPillsRow}>
            {activeDay.focus_areas.slice(0, 3).map((area, i) => (
              <View key={i} style={styles.focusPill}>
                <Text style={styles.focusPillText}>#{area}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Quick Launchpad Grid */}
        <Text style={styles.sectionTitle}>WORKSPACE DESTINATIONS</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.tile}
            onPress={() => router.push('/(tabs)/team')}
            accessibilityRole="button"
            accessibilityLabel="Team Directory"
          >
            <Text style={styles.tileIcon}>👥</Text>
            <Text style={styles.tileTitle}>Team Directory</Text>
            <Text style={styles.tileSub}>8 Verified Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => router.push('/(tabs)/workspace/reflections')}
            accessibilityRole="button"
            accessibilityLabel="Daily Reflections"
          >
            <Text style={styles.tileIcon}>✍</Text>
            <Text style={styles.tileTitle}>Reflections</Text>
            <Text style={styles.tileSub}>Day Logs & Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => router.push('/(tabs)/workspace/resources')}
            accessibilityRole="button"
            accessibilityLabel="Training Resources"
          >
            <Text style={styles.tileIcon}>📄</Text>
            <Text style={styles.tileTitle}>Resources</Text>
            <Text style={styles.tileSub}>Study Guides & PDFs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => router.push('/(tabs)/workspace/gallery')}
            accessibilityRole="button"
            accessibilityLabel="Media Gallery"
          >
            <Text style={styles.tileIcon}>📷</Text>
            <Text style={styles.tileTitle}>Media Gallery</Text>
            <Text style={styles.tileSub}>Training Moments</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: SPACING['4xl'],
  },
  greetingBox: {
    marginBottom: SPACING.lg,
  },
  welcomeLabel: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '800',
    marginTop: 2,
  },
  userRoleText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
  },
  roleHighlight: {
    color: COLORS.accentGoldBright,
    fontWeight: '700',
  },
  heroCard: {
    marginBottom: SPACING.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  heroPre: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroSquadName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  rankPill: {
    backgroundColor: COLORS.brandCyanSoft,
    borderWidth: 1,
    borderColor: COLORS.brandCyan,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
  },
  rankPillText: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.lg,
    paddingVertical: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '800',
  },
  deltaColor: {
    color: COLORS.success,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.borderSubtle,
  },
  heroActionBtn: {
    marginTop: SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  heroActionText: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  sectionHeader: {
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
    marginBottom: SPACING.sm,
  },
  sectionActionText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
  },
  journeyCard: {
    marginBottom: SPACING.xl,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  dayIndex: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dayDate: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  dayTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    marginTop: SPACING.xs,
    marginBottom: 4,
  },
  dayDesc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  focusPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  focusPill: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(30, 51, 104, 0.5)',
  },
  focusPillText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  tileIcon: {
    fontSize: 26,
    marginBottom: SPACING.sm,
  },
  tileTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
  },
  tileSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
