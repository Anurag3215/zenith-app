import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { COLORS, RADII, SPACING } from '../src/theme';
import { Button } from '../src/components/common/Button';
import { ZenithLogo } from '../src/components/common/ZenithLogo';
import { MountainSummitView } from '../src/components/common/MountainSummitView';

// Internal navigation gating engine
function NavigationGuard() {
  const { status, error, clearError } = useAuth();
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

  // Screen 1: Branded Twilight Mountain Summit Launch Screen (Matching Blueprint Screen 1)
  if (status === 'initializing') {
    return (
      <View style={styles.splashContainer} accessibilityRole="alert" accessibilityLabel="Loading secure session">
        <StatusBar style="light" />

        <View style={styles.splashCenter}>
          {/* 8-pointed golden compass star */}
          <View style={styles.logoWrapper}>
            <ZenithLogo size={68} color="#E5A93C" />
          </View>
          <Text style={styles.splashBrand}>ZENITH</Text>
          <Text style={styles.splashTeam}>TEAM NO. 5</Text>
          <Text style={styles.splashSubtitle}>mPOWER Placement Training Program</Text>

          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#E5A93C" />
            <Text style={styles.sessionText}>Checking session...</Text>
          </View>
        </View>

        {/* Alpine Summit Silhouette & Tagline at bottom */}
        <View style={styles.mountainFooter}>
          <MountainSummitView />
        </View>
      </View>
    );
  }

  // Authentication Error Screen
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
              <StatusBar style="dark" />
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
        <StatusBar style="dark" />
        <NavigationGuard />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webOuterContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#070D1E',
    justifyContent: 'space-between',
    paddingTop: 80,
  },
  splashCenter: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoWrapper: {
    marginBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashBrand: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  splashTeam: {
    color: '#E5A93C',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  splashSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  sessionText: {
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  mountainFooter: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#070D1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  errorIconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADII.full,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  errorIconText: {
    color: '#EF4444',
    fontSize: 28,
    fontWeight: '800',
  },
  errorTitle: {
    color: '#F87171',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  errorDescription: {
    color: '#CBD5E1',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
    maxWidth: 300,
  },
  errorButtons: {
    width: '100%',
    maxWidth: 240,
  },
  retryBtn: {
    marginBottom: SPACING.md,
  },
  errorSupportText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: SPACING.lg,
    maxWidth: 280,
    lineHeight: 16,
  },
});
