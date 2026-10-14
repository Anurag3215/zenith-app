import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reflection } from '@zenith/shared';
import { MOBILE_THEME, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';

interface ReflectionCardProps {
  reflection: Reflection;
  canApprove?: boolean;
  isAuthor?: boolean;
  onEdit?: () => void;
  onToggleApproval?: () => void;
}

export const ReflectionCard: React.FC<ReflectionCardProps> = ({
  reflection,
  canApprove = false,
  isAuthor = false,
  onEdit,
  onToggleApproval,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={14}
        color={i < rating ? MOBILE_THEME.brandGoldBright : '#CBD5E1'}
        style={{ marginRight: 1 }}
      />
    ));
  };

  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel={`Reflection by ${reflection.member_name}`}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorBlock}>
          <View style={styles.authorRow}>
            <Text style={styles.authorName}>{reflection.member_name}</Text>
            {reflection.is_draft ? (
              <View style={styles.draftBadge}>
                <Text style={styles.draftBadgeText}>Draft</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.subMeta}>
            <View style={styles.dayPill}>
              <Text style={styles.dayPillText}>Day 0{reflection.day_number}</Text>
            </View>
            <View style={styles.rolePill}>
              <Text style={styles.rolePillText}>
                {reflection.member_role.replace('_', ' ')}
              </Text>
            </View>
            {reflection.visibility === 'private' ? (
              <View style={styles.privatePill}>
                <Ionicons name="lock-closed" size={10} color="#64748B" style={{ marginRight: 2 }} />
                <Text style={styles.privatePillText}>Private</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.ratingBlock}>
          <View style={styles.starsRow}>{renderStars(reflection.mood_rating)}</View>
          <Text style={styles.ratingSubtext}>{reflection.mood_rating}/5 Confidence</Text>
        </View>
      </View>

      {/* Content Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>KEY TAKEAWAYS</Text>
        <Text style={styles.bodyText}>{reflection.key_takeaways}</Text>
      </View>

      {reflection.challenges_faced ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHALLENGES</Text>
          <Text style={styles.bodyText}>{reflection.challenges_faced}</Text>
        </View>
      ) : null}

      {reflection.action_items ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACTION ITEMS</Text>
          <Text style={styles.bodyText}>{reflection.action_items}</Text>
        </View>
      ) : null}

      {/* Footer / Showcase Status & Author Controls */}
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
              ? 'Featured on Evaluator Showcase ★'
              : reflection.visibility === 'private'
              ? 'Private Author Log'
              : 'Shared with Team 5'}
          </Text>
        </View>

        <View style={styles.controlsRow}>
          {isAuthor && onEdit ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={onEdit}
              accessibilityRole="button"
              accessibilityLabel="Edit your reflection"
            >
              <Ionicons name="pencil" size={12} color={MOBILE_THEME.navyHeader} style={{ marginRight: 3 }} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          ) : null}

          {canApprove && !reflection.is_draft && reflection.visibility !== 'private' ? (
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                reflection.is_approved_for_showcase && styles.toggleBtnActive,
              ]}
              onPress={onToggleApproval}
              accessibilityRole="button"
              accessibilityLabel="Toggle showcase approval status"
            >
              <Text
                style={[
                  styles.toggleText,
                  reflection.is_approved_for_showcase && styles.toggleTextActive,
                ]}
              >
                {reflection.is_approved_for_showcase ? 'Unpublish' : 'Feature ★'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.xl,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm + 2,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: MOBILE_THEME.borderLight,
  },
  authorBlock: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorName: {
    color: MOBILE_THEME.navyHeader,
    fontSize: 14,
    fontWeight: '800',
  },
  draftBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: RADII.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  draftBadgeText: {
    color: '#92400E',
    fontSize: 9,
    fontWeight: '700',
  },
  subMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayPill: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderRadius: RADII.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  dayPillText: {
    color: MOBILE_THEME.skyBlue,
    fontSize: 10,
    fontWeight: '700',
  },
  rolePill: {
    backgroundColor: MOBILE_THEME.bgLight,
    borderRadius: RADII.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  rolePillText: {
    color: MOBILE_THEME.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  privatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: RADII.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  privatePillText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  ratingBlock: {
    alignItems: 'flex-end',
  },
  starsRow: {
    flexDirection: 'row',
  },
  ratingSubtext: {
    color: MOBILE_THEME.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: MOBILE_THEME.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  bodyText: {
    color: MOBILE_THEME.navyHeader,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: MOBILE_THEME.borderLight,
  },
  showcaseStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  showcaseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  dotApproved: {
    backgroundColor: MOBILE_THEME.brandGoldBright,
  },
  dotInternal: {
    backgroundColor: '#94A3B8',
  },
  showcaseText: {
    color: MOBILE_THEME.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADII.md,
    backgroundColor: MOBILE_THEME.bgLight,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 6,
  },
  editText: {
    color: MOBILE_THEME.navyHeader,
    fontSize: 10,
    fontWeight: '700',
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADII.md,
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderWidth: 1,
    borderColor: MOBILE_THEME.skyBlue,
  },
  toggleBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  toggleText: {
    color: MOBILE_THEME.skyBlue,
    fontSize: 10,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#92400E',
  },
});
