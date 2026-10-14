import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GalleryItem } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';

interface GalleryCardProps {
  item: GalleryItem;
  canCurate?: boolean;
  onPress: () => void;
  onToggleCurate?: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  item,
  canCurate = false,
  onPress,
  onToggleCurate,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Gallery: ${item.caption}`}
    >
      {/* Media Geometric Placeholder */}
      <View style={styles.mediaPlaceholder}>
        <View style={styles.innerCrest}>
          <Text style={styles.crestIcon}>📷</Text>
          <Text style={styles.crestText}>[Milestone Photo Record]</Text>
        </View>

        {item.day_number ? (
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>DAY 0{item.day_number}</Text>
          </View>
        ) : null}

        {item.is_featured_showcase || item.status === 'approved_showcase' ? (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>★ SHOWCASE FEATURED</Text>
          </View>
        ) : item.status === 'pending_review' ? (
          <View style={[styles.featuredBadge, styles.pendingBadge]}>
            <Text style={[styles.featuredBadgeText, styles.pendingBadgeText]}>⏳ PENDING REVIEW</Text>
          </View>
        ) : (
          <View style={[styles.featuredBadge, styles.internalBadge]}>
            <Text style={[styles.featuredBadgeText, styles.internalBadgeText]}>🔒 INTERNAL ONLY</Text>
          </View>
        )}
      </View>

      {/* Meta */}
      <View style={styles.content}>
        <Text style={styles.caption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.uploaderText}>Captured by {item.uploader_name}</Text>

        <View style={styles.bottomRow}>
          <View style={styles.tagsRow}>
            {item.tags.map((tag, idx) => (
              <View key={idx} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {canCurate && onToggleCurate ? (
            <TouchableOpacity
              style={styles.curateBtn}
              onPress={onToggleCurate}
              accessibilityRole="button"
            >
              <Text style={styles.curateText}>
                {item.is_featured_showcase ? 'UNFEATURE' : 'FEATURE ★'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  mediaPlaceholder: {
    height: 150,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    position: 'relative',
  },
  innerCrest: {
    alignItems: 'center',
  },
  crestIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  crestText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.accentGoldSoft,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  featuredBadgeText: {
    color: COLORS.accentGoldBright,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  content: {
    padding: SPACING.md,
  },
  caption: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  uploaderText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginBottom: SPACING.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
    marginRight: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(30, 51, 104, 0.4)',
  },
  tagText: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '600',
  },
  dayBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.brandCyan,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
  },
  dayBadgeText: {
    color: COLORS.brandCyanLight,
    fontSize: 9,
    fontWeight: '800',
  },
  pendingBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
  },
  pendingBadgeText: {
    color: COLORS.accentGoldBright,
  },
  internalBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  internalBadgeText: {
    color: '#94A3B8',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  curateBtn: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  curateText: {
    color: COLORS.accentGoldBright,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
