import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../src/theme';
import { Button } from '../../src/components/common/Button';

export default function SignedOutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.circle}>
        <Text style={styles.icon}>🔒</Text>
      </View>
      <Text style={styles.title}>WORKSPACE SESSION TERMINATED</Text>
      <Text style={styles.description}>
        You have successfully signed out of the ZENITH Team 5 private workspace. Your session tokens have been cleared from hardware storage.
      </Text>

      <View style={styles.actionBox}>
        <Button
          title="LOG IN AGAIN"
          onPress={() => router.replace('/(auth)/login')}
          variant="primary"
          size="lg"
          style={styles.btn}
        />
      </View>

      <Text style={styles.footerNote}>
        ZENITH — Team No. 5 • mPOWER Placement Training
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 2,
    borderColor: COLORS.brandCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
    maxWidth: 320,
  },
  actionBox: {
    width: '100%',
    maxWidth: 280,
  },
  btn: {
    width: '100%',
  },
  footerNote: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: SPACING.xxl,
    letterSpacing: 0.5,
  },
});
