import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { Card } from '../../../src/components/common/Card';
import { ErrorState } from '../../../src/components/common/ErrorState';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { dataService } from '../../../src/services/dataService';
import { AuditLog } from '@zenith/shared';

export default function ScoreboardAuditScreen() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // STRICT RBAC RULE (Requirement 7):
  // Ordinary members do not receive access to internal audit information!
  const isAuthorizedToAudit =
    user?.role === 'captain' || user?.role === 'vice_captain' || user?.role === 'team_admin';

  useEffect(() => {
    if (isAuthorizedToAudit) {
      dataService.fetchAuditLogs().then((res) => setLogs(res));
    }
  }, [isAuthorizedToAudit]);

  if (!isAuthorizedToAudit) {
    return (
      <View style={styles.screen}>
        <Header title="AUDIT TRAIL" subtitle="Restricted Access" showBack />
        <DemoBanner />
        <View style={styles.deniedContainer}>
          <ErrorState
            title="ACCESS RESTRICTED (HTTP 403)"
            message="Internal audit logs are restricted to Captain, Vice-Captain, and Team Admin roles. Ordinary members may inspect live scores on the primary leaderboard."
          />
        </View>
      </View>
    );
  }

  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="AUDIT TRAIL" subtitle="Immutable Score History" showBack />
      <DemoBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>COMPLIANCE & NON-REPUDIATION</Text>
          <Text style={styles.introText}>
            Every point modification is cryptographically recorded by PostgreSQL database triggers with the editor's authenticated credentials and justification.
          </Text>
        </View>

        <Text style={styles.listHeader}>TRANSACTION HISTORY ({logs.length} RECORDS)</Text>
        {logs.map((log) => {
          const newVals: any = log.new_values || {};
          const oldVals: any = log.old_values || {};
          const delta = newVals.delta;
          const reason = newVals.reason || 'Competition Adjustment';

          return (
            <Card key={log.id} variant="default" style={styles.logCard}>
              <View style={styles.logTop}>
                <View style={styles.actionPill}>
                  <Text style={styles.actionText}>{log.action}</Text>
                </View>
                <Text style={styles.timeText}>{formatTimestamp(log.created_at)}</Text>
              </View>

              <Text style={styles.targetName}>Target: {log.target_table} ({log.target_id})</Text>
              <Text style={styles.actorName}>Authorized Editor: {log.actor_name}</Text>

              {/* Score Transition Metrics */}
              {newVals.current_points !== undefined ? (
                <View style={styles.transitionBox}>
                  <View style={styles.transitionCol}>
                    <Text style={styles.transitionLabel}>PREVIOUS</Text>
                    <Text style={styles.transitionVal}>{oldVals.current_points ?? '0'} pts</Text>
                  </View>
                  <Text style={styles.transitionArrow}>→</Text>
                  <View style={styles.transitionCol}>
                    <Text style={styles.transitionLabel}>NEW SCORE</Text>
                    <Text style={[styles.transitionVal, styles.highlightVal]}>
                      {newVals.current_points} pts
                    </Text>
                  </View>
                  {delta !== undefined ? (
                    <View style={styles.deltaBox}>
                      <Text style={[styles.deltaText, delta > 0 ? styles.posDelta : styles.negDelta]}>
                        {delta > 0 ? `+${delta}` : delta}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* Justification */}
              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>JUSTIFICATION / REFERENCE:</Text>
                <Text style={styles.reasonText}>"{reason}"</Text>
              </View>

              <View style={styles.readOnlyNotice}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.lockText}>Append-only immutable record. Client updates forbidden.</Text>
              </View>
            </Card>
          );
        })}
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
  introBox: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.brandElectric,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  introTitle: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  introText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
  },
  listHeader: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  logCard: {
    marginBottom: SPACING.md,
  },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  actionPill: {
    backgroundColor: COLORS.accentGoldSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
  },
  actionText: {
    color: COLORS.accentGoldBright,
    fontSize: 10,
    fontWeight: '800',
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  targetName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    marginTop: 4,
  },
  actorName: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  transitionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm,
  },
  transitionCol: {
    alignItems: 'center',
  },
  transitionLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  transitionVal: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '800',
  },
  highlightVal: {
    color: COLORS.accentGoldBright,
  },
  transitionArrow: {
    color: COLORS.textMuted,
    marginHorizontal: SPACING.md,
    fontSize: 16,
    fontWeight: '700',
  },
  deltaBox: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(5, 8, 20, 0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADII.md,
  },
  deltaText: {
    fontSize: 12,
    fontWeight: '800',
  },
  posDelta: {
    color: COLORS.success,
  },
  negDelta: {
    color: COLORS.danger,
  },
  reasonBox: {
    backgroundColor: 'rgba(5, 8, 20, 0.4)',
    borderRadius: RADII.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.xs + 2,
  },
  reasonLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 2,
  },
  reasonText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
  },
  readOnlyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  lockIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  lockText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontStyle: 'italic',
  },
});
