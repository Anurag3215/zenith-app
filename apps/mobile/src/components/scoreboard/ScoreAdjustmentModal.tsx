import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ScoreboardGroup } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';
import { Button } from '../common/Button';
import { InputField } from '../common/InputField';

interface ScoreAdjustmentModalProps {
  visible: boolean;
  group: ScoreboardGroup | null;
  onClose: () => void;
  onSave: (groupId: string, delta: number, reason: string, category: string) => void;
}

export const ScoreAdjustmentModal: React.FC<ScoreAdjustmentModalProps> = ({
  visible,
  group,
  onClose,
  onSave,
}) => {
  const [delta, setDelta] = useState<number>(25);
  const [reason, setReason] = useState<string>('');
  const [category, setCategory] = useState<string>('Technical Challenge');
  const [error, setError] = useState<string | null>(null);

  if (!group) return null;

  const categories = [
    'Technical Challenge',
    'Aptitude Sprint',
    'GD / Soft Skills',
    'Speed Bonus',
    'Disciplinary Penalty',
  ];

  const quickDeltas = [50, 25, 10, -10, -25, -50];

  const handleSave = () => {
    if (reason.trim().length < 3) {
      setError('A valid justification is required for score audit logging.');
      return;
    }
    setError(null);
    onSave(group.id, delta, reason, category);
    setReason('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>ADJUST COMPETITION SCORE</Text>
              <Text style={styles.subtitle}>{group.group_name} (Current: {group.current_points} pts)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close modal">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Delta Preview */}
            <View style={styles.deltaDisplayCard}>
              <Text style={styles.deltaLabel}>PROPOSED POINT ADJUSTMENT</Text>
              <Text style={[styles.deltaBigText, delta >= 0 ? styles.posDelta : styles.negDelta]}>
                {delta > 0 ? `+${delta}` : delta}
              </Text>
              <Text style={styles.newTotalSubtext}>
                Resulting Score: {group.current_points + delta} points
              </Text>
            </View>

            {/* Quick Delta Chips */}
            <Text style={styles.sectionTitle}>QUICK INCREMENT / DECREMENT</Text>
            <View style={styles.chipsRow}>
              {quickDeltas.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.chip,
                    delta === val && styles.chipActive,
                    val < 0 && styles.chipNeg,
                    val < 0 && delta === val && styles.chipNegActive,
                  ]}
                  onPress={() => setDelta(val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      delta === val && styles.chipTextActive,
                      val < 0 && styles.chipNegText,
                    ]}
                  >
                    {val > 0 ? `+${val}` : val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Selector */}
            <Text style={styles.sectionTitle}>EVALUATION CATEGORY</Text>
            <View style={styles.chipsRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Reason Field */}
            <InputField
              label="MANDATORY AUDIT REASON"
              placeholder="e.g. Day 2 Coding Sprint Round 1 Winner"
              value={reason}
              onChangeText={(text) => {
                setReason(text);
                if (error) setError(null);
              }}
              error={error}
              helperText="Every modification is logged with your member credentials in the audit ledger."
            />

            {/* Audit Warning */}
            <View style={styles.auditWarningBox}>
              <Text style={styles.auditWarningIcon}>🔒</Text>
              <Text style={styles.auditWarningText}>
                STRICT RBAC NOTICE: Score adjustments are restricted to Captain and Vice-Captain roles. This operation creates an immutable transaction entry.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Button
              title="CANCEL"
              onPress={onClose}
              variant="outline"
              size="md"
              style={styles.actionBtn}
            />
            <Button
              title="COMMIT SCORE"
              onPress={handleSave}
              variant="gold"
              size="md"
              style={styles.actionBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 20, 0.85)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    maxHeight: '90%',
    paddingBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  title: {
    color: COLORS.accentGoldBright,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    padding: SPACING.lg,
  },
  deltaDisplayCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  deltaLabel: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  deltaBigText: {
    fontSize: 44,
    fontWeight: '800',
    marginVertical: SPACING.xs,
  },
  posDelta: {
    color: COLORS.accentGoldBright,
  },
  negDelta: {
    color: COLORS.danger,
  },
  newTotalSubtext: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  chip: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  chipActive: {
    backgroundColor: COLORS.accentGoldSoft,
    borderColor: COLORS.accentGold,
  },
  chipNeg: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  chipNegActive: {
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.danger,
  },
  chipText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  chipTextActive: {
    color: COLORS.accentGoldBright,
  },
  chipNegText: {
    color: '#FCA5A5',
  },
  categoryChip: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  categoryChipText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: COLORS.brandCyanLight,
    fontWeight: '700',
  },
  auditWarningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  auditWarningIcon: {
    marginRight: SPACING.sm,
    fontSize: 16,
  },
  auditWarningText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
});
