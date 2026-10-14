import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ResourceItem } from '@zenith/shared';
import { MOBILE_THEME, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';

interface ResourceCardProps {
  item: ResourceItem;
  onPress: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ item, onPress }) => {
  const formatSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Determine icon & color accent based on file type & category
  const getIconConfig = () => {
    if (item.mime_type.includes('pdf')) {
      if (item.category === 'Aptitude') {
        return {
          bg: '#EFF6FF',
          border: '#BFDBFE',
          color: '#2563EB',
          label: 'PDF',
          icon: 'document-text-outline' as const,
        };
      } else if (item.category === 'HR & Soft Skills') {
        return {
          bg: '#FEF2F2',
          border: '#FECACA',
          color: '#DC2626',
          label: 'PDF',
          icon: 'document-outline' as const,
        };
      }
      return {
        bg: '#F0FDF4',
        border: '#BBF7D0',
        color: '#16A34A',
        label: 'PDF',
        icon: 'document-text-outline' as const,
      };
    } else if (item.mime_type.includes('zip') || item.mime_type.includes('archive')) {
      return {
        bg: '#FAF5FF',
        border: '#E9D5FF',
        color: '#9333EA',
        label: 'ZIP',
        icon: 'folder-outline' as const,
      };
    } else {
      return {
        bg: '#FFF7ED',
        border: '#FED7AA',
        color: '#EA580C',
        label: 'LINK',
        icon: 'link-outline' as const,
      };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Resource: ${item.title}`}
    >
      <View style={styles.leftRow}>
        {/* Left Colored Icon Tile */}
        <View
          style={[
            styles.iconTile,
            { backgroundColor: iconConfig.bg, borderColor: iconConfig.border },
          ]}
        >
          <Ionicons name={iconConfig.icon} size={20} color={iconConfig.color} />
          <Text style={[styles.tileLabel, { color: iconConfig.color }]}>
            {iconConfig.label}
          </Text>
        </View>

        {/* Text Block */}
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.subtitle}>
            {item.category} • {formatSize(item.file_size)}
          </Text>
          <View style={styles.pillRow}>
            {item.access_level === 'showcase_public' ? (
              <View style={styles.showcasePill}>
                <Ionicons name="star" size={10} color="#D97706" style={{ marginRight: 3 }} />
                <Text style={styles.showcasePillText}>Showcase Public</Text>
              </View>
            ) : (
              <View style={styles.internalPill}>
                <Ionicons name="lock-closed" size={10} color="#64748B" style={{ marginRight: 3 }} />
                <Text style={styles.internalPillText}>Internal Only</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Right Download / View Button */}
      <View style={styles.actionBtn}>
        <Ionicons name="cloud-download-outline" size={18} color={MOBILE_THEME.navyHeader} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: SPACING.sm,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: RADII.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  tileLabel: {
    fontSize: 8,
    fontWeight: '800',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: MOBILE_THEME.navyHeader,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 2,
  },
  subtitle: {
    color: MOBILE_THEME.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  pillRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  showcasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADII.full,
  },
  showcasePillText: {
    color: '#92400E',
    fontSize: 9,
    fontWeight: '700',
  },
  internalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADII.full,
  },
  internalPillText: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '600',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: RADII.full,
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
