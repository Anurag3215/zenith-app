import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../theme';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryTitle?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Alert',
  message,
  onRetry,
  retryTitle = 'Retry Operation',
}) => {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>⚠</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button
          title={retryTitle}
          onPress={onRetry}
          variant="danger"
          size="sm"
          style={styles.retryBtn}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    marginVertical: SPACING.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: RADII.full,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1,
    borderColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  iconText: {
    fontSize: 24,
    color: COLORS.danger,
    fontWeight: '800',
  },
  title: {
    color: '#FCA5A5',
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.md,
    maxWidth: 300,
  },
  retryBtn: {
    minWidth: 140,
  },
});
