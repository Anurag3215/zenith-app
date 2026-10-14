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

        {/* Curriculum Content Breakdown */}
        {day.status === 'completed' ? (
          <>
            <Text style={styles.sectionTitle}>DELIVERED TOPICS & SYLLABUS</Text>
            {day.topics_covered && day.topics_covered.length > 0 ? (
              <Card variant="default" style={styles.moduleCard}>
                {day.topics_covered.map((topic, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{topic}</Text>
                  </View>
                ))}
              </Card>
            ) : null}

            {day.skills_practiced && day.skills_practiced.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>SKILLS PRACTICED</Text>
                <View style={styles.tagsRow}>
                  {day.skills_practiced.map((skill, i) => (
                    <View key={i} style={styles.skillPill}>
                      <Text style={styles.skillText}>⚡ {skill}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            {day.learning_outcomes && day.learning_outcomes.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>VERIFIED LEARNING OUTCOMES</Text>
                <Card variant="default" style={styles.moduleCard}>
                  {day.learning_outcomes.map((outcome, i) => (
                    <View key={i} style={styles.outcomeRow}>
                      <Text style={styles.outcomeCheck}>✓</Text>
                      <Text style={styles.outcomeText}>{outcome}</Text>
                    </View>
                  ))}
                </Card>
              </>
            ) : null}

            {day.notes ? (
              <>
                <Text style={styles.sectionTitle}>COORDINATOR NOTES</Text>
                <Card variant="default" style={styles.moduleCard}>
                  <Text style={styles.notesText}>{day.notes}</Text>
                </Card>
              </>
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>CURRICULUM DELIVERY STATUS</Text>
            <Card variant="default" style={styles.pendingCard}>
              <View style={styles.pendingHeader}>
                <Text style={styles.pendingIcon}>⏳</Text>
                <Text style={styles.pendingTitle}>Awaiting Live Faculty Delivery</Text>
              </View>
              <Text style={styles.pendingDesc}>
                In strict compliance with placement evaluation guidelines, training topics, competencies, and deliverables for Day 0{day.day_number} remain unpopulated until delivered by faculty leads.
              </Text>
              <View style={styles.pendingDateBox}>
                <Text style={styles.pendingDateText}>
                  Scheduled Date: {day.schedule_date} • Status: Pending Faculty Delivery
                </Text>
              </View>
            </Card>
          </>
        )}

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
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs + 2,
  },
  bulletDot: {
    color: COLORS.brandCyanLight,
    fontSize: 14,
    marginRight: SPACING.xs,
    lineHeight: 18,
  },
  bulletText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xs + 1,
    lineHeight: 18,
    flex: 1,
  },
  skillPill: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  skillText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs + 2,
  },
  outcomeCheck: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '800',
    marginRight: SPACING.xs,
    lineHeight: 18,
  },
  outcomeText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xs + 1,
    lineHeight: 18,
    flex: 1,
  },
  notesText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs + 1,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  pendingCard: {
    marginBottom: SPACING.lg,
    borderColor: 'rgba(234, 179, 8, 0.3)',
    backgroundColor: 'rgba(234, 179, 8, 0.05)',
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs + 2,
  },
  pendingIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  pendingTitle: {
    color: COLORS.accentGoldBright,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
  },
  pendingDesc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  pendingDateBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  pendingDateText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});
