import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { Badge } from '../../../src/components/common/Badge';
import { Card } from '../../../src/components/common/Card';
import { Button } from '../../../src/components/common/Button';
import { ErrorState } from '../../../src/components/common/ErrorState';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { DEMO_PROFILES, DEMO_AUDIT_LOGS, AppRole, Profile } from '@zenith/shared';

export default function AdminConsoleScreen() {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>(DEMO_PROFILES);
  const [scoringFrozen, setScoringFrozen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Strict role gate
  if (user?.role !== 'team_admin') {
    return (
      <View style={styles.screen}>
        <Header title="ADMIN CONSOLE" subtitle="Restricted Access" showBack />
        <DemoBanner />
        <View style={styles.deniedContainer}>
          <ErrorState
            title="INSUFFICIENT PRIVILEGES (HTTP 403)"
            message="The Admin Governance Console is strictly restricted to the designated Team Admin role. Captain, Vice-Captain, and Member tiers cannot access administrative controls."
          />
        </View>
      </View>
    );
  }

  const handleToggleFreeze = () => {
    setScoringFrozen(!scoringFrozen);
    setFeedback(`System Emergency State: Scoreboard update pipeline ${!scoringFrozen ? 'FROZEN' : 'ACTIVE'}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReassignRole = (userId: string, newRole: AppRole) => {
    setProfiles(
      profiles.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
    );
    setFeedback(`Member role reassigned to ${newRole.toUpperCase()}. Audit entry generated.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <View style={styles.screen}>
      <Header title="ADMIN CONSOLE" subtitle="Team 5 Governance & Audits" showBack />
      <DemoBanner />

      {feedback ? (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>ℹ {feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Emergency System Controls */}
        <Card variant="highlighted" style={styles.card}>
          <Text style={styles.cardPre}>EMERGENCY SYSTEM CONTROLS</Text>
          <Text style={styles.cardTitle}>Global Competition State</Text>
          <View style={styles.freezeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.freezeLabel}>Freeze Live Scoreboard Modifications</Text>
              <Text style={styles.freezeDesc}>
                Prevents Captain and Vice-Captain from committing score adjustments during judging deliberations.
              </Text>
            </View>
            <Switch
              value={scoringFrozen}
              onValueChange={handleToggleFreeze}
              trackColor={{ false: COLORS.borderSubtle, true: COLORS.danger }}
              thumbColor={scoringFrozen ? '#FFFFFF' : COLORS.textMuted}
            />
          </View>
        </Card>

        {/* 8-Member Provisioning Management */}
        <Text style={styles.sectionTitle}>
          MEMBER PROVISIONING & ROLES ({profiles.length}/8 ACCOUNTS)
        </Text>

        {profiles.map((p) => (
          <Card key={p.id} variant="default" style={styles.memberRow}>
            <View style={styles.memberTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{p.full_name}</Text>
                <Text style={styles.memberEmail}>{p.email}</Text>
              </View>
              <Badge label={p.role.replace('_', ' ')} variant="role" role={p.role} />
            </View>

            <View style={styles.rolePickerRow}>
              <Text style={styles.pickerLabel}>Reassign Tier:</Text>
              {(['captain', 'vice_captain', 'team_admin', 'member'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.smallRoleBtn, p.role === r && styles.smallRoleBtnActive]}
                  onPress={() => handleReassignRole(p.id, r)}
                >
                  <Text style={[styles.smallRoleText, p.role === r && styles.smallRoleTextActive]}>
                    {r === 'team_admin' ? 'Admin' : r === 'vice_captain' ? 'V.Capt' : r === 'captain' ? 'Capt' : 'Mbr'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        ))}

        {/* Audit Trail */}
        <Text style={styles.sectionTitle}>SYSTEM GOVERNANCE AUDIT LEDGER</Text>
        <Card variant="default" style={styles.card}>
          <Text style={styles.desc}>
            Immutable PostgreSQL trigger log tracking privileged mutations:
          </Text>
          {DEMO_AUDIT_LOGS.map((log) => (
            <View key={log.id} style={styles.auditRow}>
              <View style={styles.auditLeft}>
                <Text style={styles.auditAction}>{log.action}</Text>
                <Text style={styles.auditActor}>{log.actor_name}</Text>
              </View>
              <Text style={styles.auditTime}>{log.created_at.slice(11, 16)} UTC</Text>
            </View>
          ))}
        </Card>
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
  deniedContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  toastBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.info,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  toastText: {
    color: COLORS.brandCyanLight,
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
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  freezeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xs,
  },
  freezeLabel: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
  },
  freezeDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
    paddingRight: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  memberRow: {
    marginBottom: SPACING.md,
  },
  memberTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  memberName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
  },
  memberEmail: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  rolePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.xs + 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
  },
  pickerLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginRight: SPACING.xs,
  },
  smallRoleBtn: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: 4,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  smallRoleBtnActive: {
    backgroundColor: COLORS.brandElectricSoft,
    borderColor: COLORS.brandElectric,
  },
  smallRoleText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  smallRoleTextActive: {
    color: COLORS.brandElectricGlow,
    fontWeight: '800',
  },
  desc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  auditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 51, 104, 0.3)',
  },
  auditLeft: {
    flex: 1,
  },
  auditAction: {
    color: COLORS.accentGoldBright,
    fontSize: 11,
    fontWeight: '800',
  },
  auditActor: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  auditTime: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
});
