import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADII, SHADOWS } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'highlighted' | 'gold';
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  onPress,
  accessibilityLabel,
}) => {
  const getCardStyle = (): ViewStyle[] => {
    const cardStyles: ViewStyle[] = [styles.base];

    switch (variant) {
      case 'elevated':
        cardStyles.push(styles.elevated);
        break;
      case 'highlighted':
        cardStyles.push(styles.highlighted);
        break;
      case 'gold':
        cardStyles.push(styles.gold);
        break;
      default:
        cardStyles.push(styles.default);
    }

    return cardStyles;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[getCardStyle(), style]}
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.card,
  },
  default: {
    backgroundColor: COLORS.surfaceCard,
    borderColor: COLORS.borderSubtle,
  },
  elevated: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.borderAccent,
  },
  highlighted: {
    backgroundColor: COLORS.surfaceCard,
    borderColor: COLORS.brandCyan,
    ...SHADOWS.glowCyan,
  },
  gold: {
    backgroundColor: COLORS.surfaceCard,
    borderColor: COLORS.accentGold,
    ...SHADOWS.glowGold,
  },
});
