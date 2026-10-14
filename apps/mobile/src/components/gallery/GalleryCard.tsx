import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GalleryItem } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';

interface GalleryCardProps {
  item: GalleryItem;
  onPress: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onPress }) => {
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
          <Text style={styles.crestText}>[Milestone Photo Pending]</Text>
        </View>
        {item.is_featured_showcase ? (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>★ SHOWCASE FEATURED</Text>
          </View>
        ) : null}
      </View>

      {/* Meta */}
      <View style={styles.content}>
        <Text style={styles.caption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.uploaderText}>Captured by {item.uploader_name}</Text>

        <View style={styles.tagsRow}>
          {item.tags.map((tag, idx) => (
            <View key={idx} style={styles.tagChip}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
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
});
