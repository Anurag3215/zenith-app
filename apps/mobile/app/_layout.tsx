import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { COLORS, TYPOGRAPHY, RADII, SPACING } from '../src/theme';
import { Button } from '../src/components/common/Button';

// Internal navigation gating engine
function NavigationGuard() {
  const { status, error, clearError, triggerAuthError } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'initializing') return;

    const inAuthGroup = segments[0] === '(auth)';

    if (status === 'unauthenticated' && !inAuthGroup) {
      // Strictly prevent unauthenticated access to private workspace
      router.replace('/(auth)/login');
    } else if (status === 'authenticated' && inAuthGroup) {
      // Once authenticated, route into main tabs
      router.replace('/(tabs)');
    }
  }, [status, segments]);

  // Screen 1: Branded Splash / Secure Session Loading Screen
  if (status === 'initializing') {
    return (
      <View style={styles.splashContainer} accessibilityRole="alert" accessibilityLabel="Loading secure session">
        <StatusBar style="light" />
        <View style={styles.crestCircle}>
          <Text style={styles.crestText}>ZENITH</Text>
          <Text style={styles.crestSub}>TEAM 05</Text>
        </View>
        <Text style={styles.splashTitle}>ZENITH — TEAM NO. 5</Text>
        <Text style={styles.splashTagline}>mPOWER Placement Training Program</Text>

        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.brandCyan} />
          <Text style={styles.sessionText}>Verifying Hardware Keystore & Session...</Text>
        </View>

        <Text style={styles.disclaimerText}>
          SECURE EVALUATION WORKSPACE • CLOSED PROVISIONING
        </Text>
      </View>
    );
  }

  // Screen 3b: Authentication Error Screen
  if (status === 'error' && error) {
    return (
      <View style={styles.errorContainer} accessibilityRole="alert">
        <StatusBar style="light" />
        <View style={styles.errorIconCircle}>
          <Text style={styles.errorIconText}>✕</Text>
        </View>
        <Text style={styles.errorTitle}>ACCESS DENIED</Text>
        <Text style={styles.errorDescription}>{error}</Text>
        <View style={styles.errorButtons}>
          <Button
            title="RETURN TO LOGIN"
            onPress={clearError}
            variant="primary"
            size="md"
            style={styles.retryBtn}
          />
        </View>
        <Text style={styles.errorSupportText}>
          Only the 8 pre-authorized Team 5 accounts have access. Contact your Team Admin if your account is locked.
        </Text>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <View style={styles.webOuterContainer}>
        <View style={styles.webFrame}>
          <SafeAreaProvider>
            <AuthProvider>
              <StatusBar style="light" />
              <NavigationGuard />
            </AuthProvider>
          </SafeAreaProvider>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <NavigationGuard />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webOuterContainer: {
    flex: 1,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh' as unknown as number,
    padding: 16,
  },
  webFrame: {
    width: '100%',
    maxWidth: 420,
    height: '100%',
    maxHeight: 880,
    backgroundColor: COLORS.backgroundDeep,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    overflow: 'hidden',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  crestCircle: {
    width: 96,
    height: 96,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 2,
    borderColor: COLORS.brandCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.brandCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  crestText: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  crestSub: {
    color: COLORS.accentGoldBright,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  splashTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  splashTagline: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
  loadingBox: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  sessionText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: SPACING.md,
    fontWeight: '500',
  },
  disclaimerText: {
    position: 'absolute',
    bottom: SPACING.xxl,
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  errorIconCircle: {
    width: 72,
    height: 72,
    borderRadius: RADII.full,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 2,
    borderColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  errorIconText: {
    color: COLORS.danger,
    fontSize: 32,
    fontWeight: '800',
  },
  errorTitle: {
    color: '#FCA5A5',
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  errorDescription: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
    maxWidth: 320,
  },
  errorButtons: {
    width: '100%',
    maxWidth: 260,
  },
  retryBtn: {
    marginBottom: SPACING.md,
  },
  errorSupportText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: SPACING.lg,
    maxWidth: 300,
    lineHeight: 16,
  },
});
