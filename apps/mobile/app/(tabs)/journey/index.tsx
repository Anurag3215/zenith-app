import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { JourneyDayCard } from '../../../src/components/journey/JourneyDayCard';
import { DEMO_TRAINING_DAYS } from '@zenith/shared';

export default function JourneyScreen() {
  const router = useRouter();

  const completedCount = DEMO_TRAINING_DAYS.filter((d) => d.status === 'completed').length;
  const progressPct = Math.round((completedCount / DEMO_TRAINING_DAYS.length) * 100);

  return (
    <View style={styles.screen}>
      <Header title="TRAINING JOURNEY" subtitle="4-Day Placement Curriculum" />
      <DemoBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress Bar Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>CURRICULUM COMPLETION</Text>
            <Text style={styles.progressPct}>{progressPct}%</Text>
          </View>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressSub}>
            {completedCount} of 4 Days Completed • Day 02 In Progress
          </Text>
        </View>

        {/* Timeline List */}
        <Text style={styles.sectionTitle}>CURRICULUM SCHEDULE</Text>
        {DEMO_TRAINING_DAYS.map((day, idx) => (
          <JourneyDayCard
            key={day.id}
            day={day}
            isLast={idx === DEMO_TRAINING_DAYS.length - 1}
            onPress={() => router.push(`/(tabs)/journey/${day.id}`)}
          />
        ))}
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
    paddingBottom: SPACING['5xl'],
  },
  progressCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  progressPct: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
  },
  barBackground: {
    height: 8,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceElevated,
    overflow: 'hidden',
    marginBottom: SPACING.xs + 2,
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.brandCyan,
    borderRadius: RADII.full,
  },
  progressSub: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
});
