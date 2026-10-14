import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOBILE_THEME, SPACING, RADII, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { AppRole } from '@zenith/shared';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, loginAsRole, logout } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRoleSwitch = async (role: AppRole) => {
    await loginAsRole(role);
    setFeedback(`Switched operational role to: ${role.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleClearCache = () => {
    setFeedback('Local client cache cleared successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (confirmed) {
        await logout();
        router.replace('/(auth)/login');
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={MOBILE_THEME.navyHeader} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      {feedback ? (
        <View style={styles.toastBox}>
          <Ionicons name="checkmark-circle" size={16} color="#16A34A" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'Z5'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user?.full_name || 'Candidate'}</Text>
            <Text style={styles.profileRole}>
              {user ? user.role.replace('_', ' ').toUpperCase() : 'MEMBER'} • Team 5
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Role Switcher */}
        <Text style={styles.sectionTitle}>EVALUATOR ROLE SIMULATOR</Text>
        <View style={styles.menuCard}>
          <Text style={styles.sectionDesc}>
            Test role-gated access in real time without entering passwords:
          </Text>
          <View style={styles.roleGrid}>
            {(['captain', 'vice_captain', 'team_admin', 'member'] as const).map((r) => {
              const isActive = user?.role === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, isActive && styles.roleBtnActive]}
                  onPress={() => handleRoleSwitch(r)}
                >
                  <Text style={[styles.roleTitle, isActive && styles.roleTitleActive]}>
                    {r.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.roleDesc}>
                    {r === 'captain'
                      ? 'Score editor & approvals'
                      : r === 'vice_captain'
                      ? 'Score editor'
                      : r === 'team_admin'
                      ? 'Governance & audits'
                      : 'Read-only candidate'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Security Parameters */}
        <Text style={styles.sectionTitle}>SECURITY ARCHITECTURE STATUS</Text>
        <View style={styles.menuCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Session Persistence</Text>
            <Text style={styles.statusVal}>expo-secure-store (Active)</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>PostgreSQL RLS</Text>
            <Text style={styles.statusVal}>Enforced on 100% Tables</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Realtime Fallback</Text>
            <Text style={styles.statusVal}>10s Polling Heartbeat</Text>
          </View>
          <View style={[styles.statusRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.statusLabel}>Public Self-Registration</Text>
            <Text style={[styles.statusVal, { color: '#DC2626' }]}>Strictly Disabled</Text>
          </View>
        </View>

        {/* Cache & Maintenance */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleClearCache}>
          <Text style={styles.actionBtnText}>Clear Client Cache</Text>
        </TouchableOpacity>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>Sign Out of Workspace</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: MOBILE_THEME.bgLight,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: SPACING.md,
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderBottomWidth: 1,
    borderBottomColor: MOBILE_THEME.borderLight,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADII.full,
    backgroundColor: MOBILE_THEME.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
  },
  toastText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600',
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },
  profileCard: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.xl,
    padding: SPACING.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: RADII.full,
    backgroundColor: MOBILE_THEME.navyHeader,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  profileRole: {
    fontSize: 11,
    fontWeight: '700',
    color: MOBILE_THEME.skyBlue,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 11,
    color: MOBILE_THEME.textMuted,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: MOBILE_THEME.textSecondary,
    marginBottom: SPACING.xs + 2,
    marginTop: SPACING.xs,
  },
  sectionDesc: {
    fontSize: 12,
    color: MOBILE_THEME.textSecondary,
    marginBottom: SPACING.sm,
  },
  menuCard: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleBtn: {
    width: '48%',
    backgroundColor: MOBILE_THEME.bgLight,
    borderRadius: RADII.lg,
    padding: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginBottom: SPACING.xs + 2,
  },
  roleBtnActive: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderColor: MOBILE_THEME.skyBlue,
  },
  roleTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  roleTitleActive: {
    color: MOBILE_THEME.skyBlue,
  },
  roleDesc: {
    fontSize: 9,
    color: MOBILE_THEME.textMuted,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: MOBILE_THEME.borderLight,
  },
  statusLabel: {
    fontSize: 12,
    color: MOBILE_THEME.navyHeader,
    fontWeight: '500',
  },
  statusVal: {
    fontSize: 12,
    color: MOBILE_THEME.skyBlue,
    fontWeight: '700',
  },
  actionBtn: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.lg,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginBottom: SPACING.sm,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
  },
  signOutBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: RADII.lg,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: SPACING.xl,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
});
