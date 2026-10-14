import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrainingDay } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';
import { Badge } from '../common/Badge';

interface JourneyDayCardProps {
  day: TrainingDay;
  onPress?: () => void;
  isLast?: boolean;
}

export const JourneyDayCard: React.FC<JourneyDayCardProps> = ({
  day,
  onPress,
  isLast = false,
}) => {
  const isCurrentDay = day.status === 'in_progress';

  return (
    <View style={styles.timelineRow}>
      {/* Left Stepper Indicator */}
      <View style={styles.stepperCol}>
        <View
          style={[
            styles.nodeCircle,
            day.status === 'completed' && styles.nodeCompleted,
            day.status === 'in_progress' && styles.nodeCurrent,
          ]}
        >
          <Text
            style={[
              styles.nodeText,
              day.status === 'completed' && styles.nodeTextCompleted,
              day.status === 'in_progress' && styles.nodeTextCurrent,
            ]}
          >
            {day.status === 'completed' ? '✓' : `0${day.day_number}`}
          </Text>
        </View>
        {!isLast ? (
          <View
            style={[
              styles.connectorLine,
              day.status === 'completed' && styles.connectorCompleted,
            ]}
          />
        ) : null}
      </View>

      {/* Right Content Card */}
      <TouchableOpacity
        style={[
          styles.card,
          isCurrentDay && styles.currentCard,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Day ${day.day_number}: ${day.title}, status: ${day.status}`}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.dayIndexText}>DAY 0{day.day_number} CURRICULUM</Text>
            <Text style={styles.dateSubtext}>{day.schedule_date}</Text>
          </View>
          <Badge label={day.status.replace('_', ' ')} variant="status" status={day.status} />
        </View>

        <Text style={styles.title}>{day.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {day.description}
        </Text>

        {day.trainer_name ? (
          <Text style={styles.trainerText}>Lead Mentor: {day.trainer_name}</Text>
        ) : null}

        {/* Focus Area Pill Chips */}
        <View style={styles.pillsContainer}>
          {day.focus_areas.map((area, idx) => (
            <View key={idx} style={styles.pillChip}>
              <Text style={styles.pillText}>#{area}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerActionText}>INSPECT DAY DELIVERABLES →</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  stepperCol: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 32,
  },
  nodeCircle: {
    width: 32,
    height: 32,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1.5,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCompleted: {
    backgroundColor: COLORS.successSoft,
    borderColor: COLORS.success,
  },
  nodeCurrent: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
    ...SHADOWS.glowCyan,
  },
  nodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  nodeTextCompleted: {
    color: COLORS.success,
  },
  nodeTextCurrent: {
    color: COLORS.brandCyanLight,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.borderSubtle,
    marginVertical: SPACING.xs,
  },
  connectorCompleted: {
    backgroundColor: COLORS.success,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  currentCard: {
    borderColor: COLORS.brandCyan,
    ...SHADOWS.glowCyan,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  dayIndexText: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dateSubtext: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  trainerText: {
    color: COLORS.accentGoldBright,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SPACING.xs,
  },
  pillChip: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(30, 51, 104, 0.5)',
  },
  pillText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  cardFooter: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs + 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
    alignItems: 'flex-end',
  },
  footerActionText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
