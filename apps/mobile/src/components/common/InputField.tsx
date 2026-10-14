import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOBILE_THEME, SPACING, RADII, TYPOGRAPHY } from '../../theme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string | null;
  helperText?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  variant?: 'light' | 'dark';
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  isPassword = false,
  leftIcon,
  variant = 'light',
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  const isLight = variant === 'light';

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: isLight ? MOBILE_THEME.textSecondary : '#A5A6C4' }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          isLight ? styles.inputLight : styles.inputDark,
          isFocused && (isLight ? styles.focusedLight : styles.focusedDark),
          Boolean(error) && styles.errorBorder,
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={isLight ? '#94A3B8' : '#71719A'}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          style={[styles.input, { color: isLight ? MOBILE_THEME.textDark : '#FFFFFF' }]}
          placeholderTextColor={isLight ? '#94A3B8' : '#71719A'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          accessibilityLabel={label || rest.placeholder}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={isLight ? '#64748B' : '#A5A6C4'}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    minHeight: 50,
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  inputDark: {
    backgroundColor: 'rgba(20, 11, 46, 0.7)',
    borderColor: 'rgba(168, 85, 247, 0.25)',
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
  },
  focusedLight: {
    borderColor: '#0284C7',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  focusedDark: {
    borderColor: '#A855F7',
    backgroundColor: 'rgba(28, 16, 60, 0.85)',
  },
  errorBorder: {
    borderColor: MOBILE_THEME.danger,
  },
  toggleBtn: {
    padding: SPACING.xs,
  },
  errorText: {
    color: MOBILE_THEME.danger,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  helperText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
});
