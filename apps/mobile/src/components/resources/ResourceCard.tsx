import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ResourceItem } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';
import { Badge } from '../common/Badge';

interface ResourceCardProps {
  item: ResourceItem;
  onPress: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ item, onPress }) => {
  const formatSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Document: ${item.title}`}
    >
      <View style={styles.topRow}>
        <View style={styles.fileIconBox}>
          <Text style={styles.fileIconText}>PDF</Text>
        </View>

        <View style={styles.metaBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.subtext}>
            {item.category} • {formatSize(item.file_size)} • Uploaded by {item.uploader_name}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Badge
          label={item.access_level === 'showcase_public' ? 'PUBLIC SHOWCASE' : 'INTERNAL ONLY'}
          variant="custom"
          bg={item.access_level === 'showcase_public' ? COLORS.accentGoldSoft : COLORS.surfaceElevated}
          color={item.access_level === 'showcase_public' ? COLORS.accentGoldBright : COLORS.textMuted}
        />

        <View style={styles.actionPrompt}>
          <Text style={styles.actionPromptText}>VIEW DOCUMENT 📥</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  fileIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADII.md,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  fileIconText: {
    color: '#F87171',
    fontWeight: '800',
    fontSize: 12,
  },
  metaBlock: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm + 1,
    fontWeight: '700',
    lineHeight: 18,
  },
  subtext: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs + 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
  },
  actionPrompt: {
    paddingVertical: 2,
  },
  actionPromptText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
  },
});
