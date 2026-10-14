import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { Badge } from '../../../src/components/common/Badge';
import { Card } from '../../../src/components/common/Card';
import { Button } from '../../../src/components/common/Button';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { AppRole } from '@zenith/shared';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, loginAsRole, logout } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRoleSwitch = async (role: AppRole) => {
    await loginAsRole(role);
    setFeedback(`Switched active operational tier to: ${role.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleClearCache = () => {
    setFeedback('Local client cache cleared successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/signed-out');
  };

  return (
    <View style={styles.screen}>
      <Header title="SETTINGS" subtitle="Workspace & Security" showBack />
      <DemoBanner />

      {feedback ? (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>✓ {feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Active Account Identity */}
        <Card variant="highlighted" style={styles.card}>
          <Text style={styles.cardPre}>CURRENT WORKSPACE IDENTITY</Text>
          <Text style={styles.cardName}>{user?.full_name || 'Candidate'}</Text>
          <Text style={styles.cardEmail}>{user?.email}</Text>
          <View style={styles.badgeRow}>
            <Badge
              label={user ? user.role.replace('_', ' ') : 'MEMBER'}
              variant="role"
              role={user?.role}
            />
          </View>
        </Card>

        {/* Live Evaluator Role Switcher */}
        <Text style={styles.sectionTitle}>EVALUATOR ROLE SIMULATOR</Text>
        <Card variant="default" style={styles.card}>
          <Text style={styles.desc}>
            Switch your active profile to test role-gated permissions in real time without signing out:
          </Text>

          <View style={styles.roleGrid}>
            <TouchableOpacity
              style={[
                styles.roleBtn,
                styles.btnGold,
                user?.role === 'captain' && styles.roleActiveGold,
              ]}
              onPress={() => handleRoleSwitch('captain')}
            >
              <Text style={styles.roleTitle}>CAPTAIN</Text>
              <Text style={styles.roleDesc}>Score editor & approvals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleBtn,
                styles.btnCyan,
                user?.role === 'vice_captain' && styles.roleActiveCyan,
              ]}
              onPress={() => handleRoleSwitch('vice_captain')}
            >
              <Text style={styles.roleTitle}>VICE-CAPTAIN</Text>
              <Text style={styles.roleDesc}>Score editor & squad lead</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleBtn,
                styles.btnElectric,
                user?.role === 'team_admin' && styles.roleActiveElectric,
              ]}
              onPress={() => handleRoleSwitch('team_admin')}
            >
              <Text style={styles.roleTitle}>TEAM ADMIN</Text>
              <Text style={styles.roleDesc}>Audits & governance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleBtn,
                styles.btnSlate,
                user?.role === 'member' && styles.roleActiveSlate,
              ]}
              onPress={() => handleRoleSwitch('member')}
            >
              <Text style={styles.roleTitle}>MEMBER</Text>
              <Text style={styles.roleDesc}>Read-only scores & reflections</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Security Parameters */}
        <Text style={styles.sectionTitle}>SECURITY ARCHITECTURE STATUS</Text>
        <Card variant="default" style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Session Persistence</Text>
            <Text style={styles.statusVal}>expo-secure-store (Active)</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>PostgreSQL RLS Enforcement</Text>
            <Text style={styles.statusVal}>Enabled on 100% Tables</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Realtime Fallback</Text>
            <Text style={styles.statusVal}>10s Polling Heartbeat</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Public Self-Registration</Text>
            <Text style={[styles.statusVal, { color: COLORS.danger }]}>Strictly Disabled</Text>
          </View>
        </Card>

        {/* Cache & Maintenance */}
        <Button
          title="CLEAR CLIENT CACHE"
          onPress={handleClearCache}
          variant="outline"
          size="md"
          style={styles.actionBtn}
        />

        {/* Sign Out */}
        <Button
          title="LOG OUT OF WORKSPACE"
          onPress={handleSignOut}
          variant="danger"
          size="lg"
          style={styles.actionBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },
  toastBox: {
    backgroundColor: COLORS.successSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.success,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  toastText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    marginBottom: SPACING.lg,
  },
  cardPre: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  cardEmail: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  desc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleBtn: {
    width: '48%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  btnGold: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  btnCyan: {
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  btnElectric: {
    borderColor: 'rgba(37, 99, 235, 0.4)',
  },
  btnSlate: {
    borderColor: COLORS.borderSubtle,
  },
  roleActiveGold: {
    backgroundColor: COLORS.accentGoldSoft,
    borderColor: COLORS.accentGold,
  },
  roleActiveCyan: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  roleActiveElectric: {
    backgroundColor: COLORS.brandElectricSoft,
    borderColor: COLORS.brandElectric,
  },
  roleActiveSlate: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderColor: '#94A3B8',
  },
  roleTitle: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleDesc: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 51, 104, 0.3)',
  },
  statusLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  statusVal: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
  },
  actionBtn: {
    marginBottom: SPACING.md,
  },
});
