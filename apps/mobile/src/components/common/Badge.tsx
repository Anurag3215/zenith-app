import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../theme';
import { AppRole, DayStatus } from '@zenith/shared';

interface BadgeProps {
  label: string;
  variant?: 'role' | 'rank' | 'status' | 'custom';
  role?: AppRole;
  rank?: number;
  status?: DayStatus;
  color?: string;
  bg?: string;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'custom',
  role,
  rank,
  status,
  color,
  bg,
}) => {
  let badgeBg: string = bg || COLORS.surfaceElevated;
  let textColor: string = color || COLORS.textSecondary;
  let borderColor: string = COLORS.borderSubtle;

  if (variant === 'role' && role) {
    switch (role) {
      case 'captain':
        badgeBg = COLORS.accentGoldSoft;
        textColor = COLORS.accentGoldBright;
        borderColor = COLORS.accentGold;
        break;
      case 'vice_captain':
        badgeBg = COLORS.brandCyanSoft;
        textColor = COLORS.brandCyanLight;
        borderColor = COLORS.brandCyan;
        break;
      case 'team_admin':
        badgeBg = COLORS.brandElectricSoft;
        textColor = COLORS.brandElectricGlow;
        borderColor = COLORS.brandElectric;
        break;
      default:
        badgeBg = 'rgba(148, 163, 184, 0.12)';
        textColor = COLORS.textSecondary;
        borderColor = COLORS.borderSubtle;
    }
  } else if (variant === 'rank' && rank !== undefined) {
    if (rank === 1) {
      badgeBg = COLORS.accentGoldSoft;
      textColor = COLORS.accentGoldBright;
      borderColor = COLORS.accentGold;
    } else if (rank === 2) {
      badgeBg = 'rgba(148, 163, 184, 0.2)';
      textColor = '#E2E8F0';
      borderColor = '#94A3B8';
    } else if (rank === 3) {
      badgeBg = 'rgba(217, 119, 6, 0.2)';
      textColor = '#FDBA74';
      borderColor = '#D97706';
    } else {
      badgeBg = 'rgba(16, 28, 61, 0.8)';
      textColor = COLORS.textMuted;
      borderColor = COLORS.borderSubtle;
    }
  } else if (variant === 'status' && status) {
    switch (status) {
      case 'completed':
        badgeBg = COLORS.successSoft;
        textColor = COLORS.success;
        borderColor = COLORS.success;
        break;
      case 'in_progress':
        badgeBg = COLORS.brandCyanSoft;
        textColor = COLORS.brandCyanLight;
        borderColor = COLORS.brandCyan;
        break;
      default:
        badgeBg = 'rgba(148, 163, 184, 0.1)';
        textColor = COLORS.textMuted;
        borderColor = COLORS.borderSubtle;
    }
  }

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: badgeBg, borderColor },
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Badge: ${label}`}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
