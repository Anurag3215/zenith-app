import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../src/theme';
import { Button } from '../../src/components/common/Button';
import { useAuth } from '../../src/context/AuthContext';

export default function AuthErrorScreen() {
  const router = useRouter();
  const { error, clearError } = useAuth();

  const handleReturn = () => {
    clearError();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.circle}>
        <Text style={styles.icon}>✕</Text>
      </View>
      <Text style={styles.title}>AUTHENTICATION FAILURE</Text>
      <Text style={styles.message}>
        {error || 'Unable to establish secure cryptographic session with the identity provider.'}
      </Text>

      <View style={styles.actionBox}>
        <Button
          title="RETURN TO LOGIN"
          onPress={handleReturn}
          variant="primary"
          size="lg"
          style={styles.btn}
        />
      </View>

      <Text style={styles.subtext}>
        Security Policy: Public registration is closed. Accounts are restricted to the 8 verified mPOWER Team 5 members.
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
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 2,
    borderColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 36,
    color: COLORS.danger,
    fontWeight: '800',
  },
  title: {
    color: '#FCA5A5',
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
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
  subtext: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: SPACING.xl,
    lineHeight: 16,
    maxWidth: 280,
  },
});
