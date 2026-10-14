import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { Badge } from '../../../src/components/common/Badge';
import { Card } from '../../../src/components/common/Card';
import { Button } from '../../../src/components/common/Button';
import { DEMO_TRAINING_DAYS } from '@zenith/shared';

export default function JourneyDayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const day = DEMO_TRAINING_DAYS.find((d) => d.id === id) || DEMO_TRAINING_DAYS[0];

  return (
    <View style={styles.screen}>
      <Header
        title={`DAY 0${day.day_number}`}
        subtitle="Curriculum Milestone Details"
        showBack
      />
      <DemoBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <Card variant="highlighted" style={styles.heroCard}>
          <View style={styles.topRow}>
            <Text style={styles.dayBadge}>DAY 0{day.day_number} • {day.schedule_date}</Text>
            <Badge label={day.status.replace('_', ' ')} variant="status" status={day.status} />
          </View>
          <Text style={styles.title}>{day.title}</Text>
          <Text style={styles.desc}>{day.description}</Text>
          {day.trainer_name ? (
            <Text style={styles.trainer}>Assigned Lead: {day.trainer_name}</Text>
          ) : null}
        </Card>

        {/* Detailed Module Breakdown */}
        <Text style={styles.sectionTitle}>DETAILED MODULE BREAKDOWN</Text>

        <Card variant="default" style={styles.moduleCard}>
          <Text style={styles.moduleTime}>SESSION 01 • MORNING (09:00 - 12:30)</Text>
          <Text style={styles.moduleName}>Foundational Theory & Interactive Concept Drill</Text>
          <Text style={styles.moduleDesc}>
            Deep-dive lecture on core concepts, live problem-solving walk-through, and architectural patterns.
          </Text>
        </Card>

        <Card variant="default" style={styles.moduleCard}>
          <Text style={styles.moduleTime}>SESSION 02 • AFTERNOON (13:30 - 17:00)</Text>
          <Text style={styles.moduleName}>Live Competitive Squad Sprint</Text>
          <Text style={styles.moduleDesc}>
            Timed cohort challenge where groups compete for points that reflect directly on the mPOWER live scoreboard.
          </Text>
        </Card>

        <Card variant="default" style={styles.moduleCard}>
          <Text style={styles.moduleTime}>SESSION 03 • EVENING (17:30 - 19:00)</Text>
          <Text style={styles.moduleName}>Team Debrief, Reflection & Mentorship Review</Text>
          <Text style={styles.moduleDesc}>
            Individual submission of structured takeaways and action items. Mentors inspect deliverables.
          </Text>
        </Card>

        {/* Focus Areas */}
        <Text style={styles.sectionTitle}>CURRICULUM TAGS</Text>
        <View style={styles.tagsRow}>
          {day.focus_areas.map((area, i) => (
            <View key={i} style={styles.tagPill}>
              <Text style={styles.tagText}>#{area}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <Button
            title="LOG DAY REFLECTION"
            onPress={() => router.push('/(tabs)/workspace/reflections')}
            variant="primary"
            size="md"
            style={styles.actionBtn}
          />
          <Button
            title="INSPECT DAY RESOURCES"
            onPress={() => router.push('/(tabs)/workspace/resources')}
            variant="secondary"
            size="md"
            style={styles.actionBtn}
          />
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
    paddingBottom: SPACING['5xl'],
  },
  heroCard: {
    marginBottom: SPACING.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dayBadge: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  desc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  trainer: {
    color: COLORS.accentGoldBright,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  moduleCard: {
    marginBottom: SPACING.md,
  },
  moduleTime: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  moduleName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    marginBottom: 4,
  },
  moduleDesc: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.xl,
  },
  tagPill: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  tagText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '600',
  },
  actionsBox: {
    marginTop: SPACING.sm,
  },
  actionBtn: {
    marginBottom: SPACING.md,
  },
});
