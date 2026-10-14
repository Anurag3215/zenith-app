import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getContainerStyle = () => {
    const baseStyle: ViewStyle[] = [styles.button];

    // Size
    if (size === 'sm') baseStyle.push(styles.sizeSm);
    else if (size === 'lg') baseStyle.push(styles.sizeLg);
    else baseStyle.push(styles.sizeMd);

    // Variant
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'gold':
        baseStyle.push(styles.gold);
        break;
      case 'danger':
        baseStyle.push(styles.danger);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseText: TextStyle[] = [styles.text];

    if (size === 'sm') baseText.push(styles.textSm);
    else if (size === 'lg') baseText.push(styles.textLg);
    else baseText.push(styles.textMd);

    switch (variant) {
      case 'outline':
      case 'secondary':
        baseText.push(styles.textSecondary);
        break;
      case 'gold':
        baseText.push(styles.textGold);
        break;
      case 'danger':
        baseText.push(styles.textDanger);
        break;
      case 'ghost':
        baseText.push(styles.textGhost);
        break;
      default:
        baseText.push(styles.textPrimary);
    }

    return baseText;
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'gold' ? '#FFFFFF' : COLORS.brandCyan}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text style={[getTextStyle(), textStyle, icon ? { marginLeft: SPACING.sm } : undefined]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 48, // WCAG minimum touch target
  },
  sizeSm: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    minHeight: 40,
  },
  sizeMd: {
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    minHeight: 48,
  },
  sizeLg: {
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
    minHeight: 56,
  },
  primary: {
    backgroundColor: COLORS.brandElectric,
    borderColor: COLORS.brandElectricGlow,
  },
  secondary: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  gold: {
    backgroundColor: COLORS.accentGold,
    borderColor: COLORS.accentGoldBright,
  },
  danger: {
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: COLORS.borderSubtle,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  textSm: {
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  textMd: {
    fontSize: TYPOGRAPHY.sizes.md,
  },
  textLg: {
    fontSize: TYPOGRAPHY.sizes.lg,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: COLORS.brandCyanLight,
  },
  textGold: {
    color: '#050814',
  },
  textDanger: {
    color: '#FCA5A5',
  },
  textGhost: {
    color: COLORS.textSecondary,
  },
});
