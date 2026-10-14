import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { Card } from '../../../src/components/common/Card';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { DEMO_AUDIT_LOGS } from '@zenith/shared';

export default function ScoreboardAuditScreen() {
  return (
    <View style={styles.screen}>
      <Header title="AUDIT TRAIL" subtitle="Immutable Score Ledger" showBack />
      <DemoBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>COMPLIANCE & NON-REPUDIATION</Text>
          <Text style={styles.introText}>
            Every point modification is cryptographically recorded by PostgreSQL database triggers with the authenticated member's UUID.
          </Text>
        </View>

        <Text style={styles.listHeader}>TRANSACTION HISTORY</Text>
        {DEMO_AUDIT_LOGS.map((log) => (
          <Card key={log.id} variant="default" style={styles.logCard}>
            <View style={styles.logTop}>
              <View style={styles.actionPill}>
                <Text style={styles.actionText}>{log.action}</Text>
              </View>
              <Text style={styles.timeText}>{log.created_at}</Text>
            </View>

            <Text style={styles.actorName}>Actor: {log.actor_name}</Text>
            <Text style={styles.tableText}>Table: {log.target_table} (ID: {log.target_id})</Text>

            {log.new_values ? (
              <View style={styles.jsonBox}>
                <Text style={styles.jsonTitle}>MODIFIED VALUES:</Text>
                <Text style={styles.jsonCode}>
                  {JSON.stringify(log.new_values, null, 2)}
                </Text>
              </View>
            ) : null}
          </Card>
        ))}
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
    paddingBottom: SPACING['4xl'],
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
  actorName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    marginTop: 4,
  },
  tableText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  jsonBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(30, 51, 104, 0.5)',
  },
  jsonTitle: {
    color: COLORS.brandCyanLight,
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 2,
  },
  jsonCode: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
