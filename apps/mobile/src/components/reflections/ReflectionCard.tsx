import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Reflection } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';
import { Badge } from '../common/Badge';

interface ReflectionCardProps {
  reflection: Reflection;
  canApprove?: boolean;
  onToggleApproval?: () => void;
}

export const ReflectionCard: React.FC<ReflectionCardProps> = ({
  reflection,
  canApprove = false,
  onToggleApproval,
}) => {
  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel={`Reflection by ${reflection.member_name}`}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorBlock}>
          <Text style={styles.authorName}>{reflection.member_name}</Text>
          <View style={styles.subMeta}>
            <Badge
              label={`DAY 0${reflection.day_number}`}
              variant="custom"
              bg={COLORS.surfaceElevated}
              color={COLORS.brandCyanLight}
            />
            <View style={{ marginLeft: SPACING.xs }}>
              <Badge
                label={reflection.member_role.replace('_', ' ')}
                variant="role"
                role={reflection.member_role}
              />
            </View>
          </View>
        </View>

        <View style={styles.ratingBlock}>
          <Text style={styles.starsText}>{renderStars(reflection.mood_rating)}</Text>
          <Text style={styles.ratingSubtext}>{reflection.mood_rating}/5 Mastery</Text>
        </View>
      </View>

      {/* Content Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>KEY TAKEAWAYS</Text>
        <Text style={styles.bodyText}>{reflection.key_takeaways}</Text>
      </View>

      {reflection.challenges_faced ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHALLENGES ENCOUNTERED</Text>
          <Text style={styles.bodyText}>{reflection.challenges_faced}</Text>
        </View>
      ) : null}

      {reflection.action_items ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CORRECTIVE ACTION ITEMS</Text>
          <Text style={styles.bodyText}>{reflection.action_items}</Text>
        </View>
      ) : null}

      {/* Footer / Showcase Status */}
      <View style={styles.footer}>
        <View style={styles.showcaseStatus}>
          <View
            style={[
              styles.showcaseDot,
              reflection.is_approved_for_showcase ? styles.dotApproved : styles.dotInternal,
            ]}
          />
          <Text style={styles.showcaseText}>
            {reflection.is_approved_for_showcase
              ? 'Featured on Evaluator Web Showcase'
              : 'Internal Workspace Only'}
          </Text>
        </View>

        {canApprove ? (
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={onToggleApproval}
            accessibilityRole="button"
            accessibilityLabel="Toggle showcase approval status"
          >
            <Text style={styles.toggleText}>
              {reflection.is_approved_for_showcase ? 'UNPUBLISH' : 'APPROVE FOR SHOWCASE ★'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 51, 104, 0.4)',
  },
  authorBlock: {
    flex: 1,
  },
  authorName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBlock: {
    alignItems: 'flex-end',
  },
  starsText: {
    color: COLORS.accentGoldBright,
    fontSize: 16,
    letterSpacing: 2,
  },
  ratingSubtext: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.sm + 2,
  },
  sectionTitle: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  bodyText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
  },
  showcaseStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  showcaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs + 2,
  },
  dotApproved: {
    backgroundColor: COLORS.accentGold,
  },
  dotInternal: {
    backgroundColor: COLORS.textMuted,
  },
  showcaseText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  toggleBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.brandCyan,
  },
  toggleText: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '700',
  },
});
