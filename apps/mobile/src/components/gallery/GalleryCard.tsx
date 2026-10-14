import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GalleryItem } from '@zenith/shared';
import { MOBILE_THEME, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';

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
          <Ionicons name="camera-outline" size={32} color={MOBILE_THEME.skyBlue} />
          <Text style={styles.crestText}>Cohort Milestone Capture</Text>
        </View>

        {item.day_number ? (
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>DAY 0{item.day_number}</Text>
          </View>
        ) : null}

        {item.is_featured_showcase || item.status === 'approved_showcase' ? (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={10} color="#D97706" style={{ marginRight: 3 }} />
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
        ) : item.status === 'pending_review' ? (
          <View style={[styles.featuredBadge, styles.pendingBadge]}>
            <Text style={[styles.featuredBadgeText, styles.pendingBadgeText]}>Pending</Text>
          </View>
        ) : (
          <View style={[styles.featuredBadge, styles.internalBadge]}>
            <Text style={[styles.featuredBadgeText, styles.internalBadgeText]}>Internal</Text>
          </View>
        )}
      </View>

      {/* Content */}
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
                {item.is_featured_showcase ? 'Unfeature' : 'Feature ★'}
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
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    ...SHADOWS.card,
  },
  mediaPlaceholder: {
    height: 160,
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: MOBILE_THEME.borderLight,
  },
  innerCrest: {
    alignItems: 'center',
  },
  crestText: {
    color: MOBILE_THEME.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: RADII.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  featuredBadgeText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: '700',
  },
  pendingBadge: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  pendingBadgeText: {
    color: '#64748B',
  },
  internalBadge: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  internalBadgeText: {
    color: '#64748B',
  },
  dayBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderWidth: 1,
    borderColor: MOBILE_THEME.skyBlue,
    borderRadius: RADII.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dayBadgeText: {
    color: MOBILE_THEME.skyBlue,
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    padding: SPACING.md,
  },
  caption: {
    color: MOBILE_THEME.navyHeader,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  uploaderText: {
    color: MOBILE_THEME.textSecondary,
    fontSize: 11,
    marginBottom: SPACING.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  tagChip: {
    backgroundColor: MOBILE_THEME.bgLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.full,
    marginRight: 6,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
  },
  tagText: {
    color: MOBILE_THEME.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  curateBtn: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderWidth: 1,
    borderColor: MOBILE_THEME.skyBlue,
    borderRadius: RADII.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  curateText: {
    color: MOBILE_THEME.skyBlue,
    fontSize: 10,
    fontWeight: '800',
  },
});
