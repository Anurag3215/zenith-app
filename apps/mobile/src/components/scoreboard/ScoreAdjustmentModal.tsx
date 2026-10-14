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
  onSave: (
    groupId: string,
    delta: number,
    reason: string,
    category: string,
    expectedCurrentPoints: number
  ) => Promise<void>;
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
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!group) return null;

  const currentTotal = group.current_points;
  const newTotal = currentTotal + delta;

  const categories = [
    'Technical Challenge',
    'Aptitude Sprint',
    'GD / Soft Skills',
    'Speed Bonus',
    'Disciplinary Penalty',
  ];

  const quickDeltas = [50, 25, 10, -10, -25, -50];

  const handleValidateAndProceed = () => {
    setError(null);

    // Validation: Delta cannot be 0
    if (delta === 0) {
      setError('Score delta cannot be zero. Adjust the points up or down.');
      return;
    }

    // Validation: Total points cannot be negative
    if (newTotal < 0) {
      setError(`Cumulative score cannot be negative. Resulting score would be ${newTotal} points.`);
      return;
    }

    // Validation: Mandatory justification
    if (!reason || reason.trim().length < 3) {
      setError('A mandatory audit reason (minimum 3 characters) is required.');
      return;
    }

    // Proceed to confirmation summary step
    setIsConfirming(true);
  };

  const handleConfirmCommit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(group.id, delta, reason.trim(), category, group.current_points);
      setIsConfirming(false);
      setReason('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error committing score to database.');
      setIsConfirming(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsConfirming(false);
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleReset}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {isConfirming ? 'CONFIRM SCORE ADJUSTMENT' : 'ADJUST COMPETITION SCORE'}
              </Text>
              <Text style={styles.subtitle}>
                {group.group_name} (Current: {group.current_points} pts)
              </Text>
            </View>
            <TouchableOpacity onPress={handleReset} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close modal">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {error ? (
              <View style={styles.errorAlertBox}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorAlertText}>{error}</Text>
              </View>
            ) : null}

            {isConfirming ? (
              /* Confirmation Summary Step (Requirement 5) */
              <View style={styles.confirmBox}>
                <Text style={styles.confirmHeading}>AUDIT TRANSACTION PREVIEW</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Competing Group:</Text>
                  <Text style={styles.summaryVal}>{group.group_name} (Group {group.group_number})</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Current Baseline:</Text>
                  <Text style={styles.summaryVal}>{currentTotal} points</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Applied Point Delta:</Text>
                  <Text style={[styles.summaryVal, delta > 0 ? styles.posDelta : styles.negDelta]}>
                    {delta > 0 ? `+${delta}` : delta} points
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Resulting Total:</Text>
                  <Text style={[styles.summaryVal, styles.highlightVal]}>{newTotal} points</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Category:</Text>
                  <Text style={styles.summaryVal}>{category}</Text>
                </View>
                <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.summaryLabel}>Audit Justification:</Text>
                  <Text style={[styles.summaryVal, { fontStyle: 'italic' }]}>"{reason}"</Text>
                </View>

                <View style={styles.auditStampNotice}>
                  <Text style={styles.stampIcon}>🔒</Text>
                  <Text style={styles.stampText}>
                    Optimistic concurrency check active. This action writes directly to the immutable PostgreSQL ledger.
                  </Text>
                </View>
              </View>
            ) : (
              /* Input & Selection Step */
              <>
                {/* Resulting Score Card */}
                <View style={styles.deltaDisplayCard}>
                  <Text style={styles.deltaLabel}>PROPOSED RESULTING SCORE</Text>
                  <Text style={[styles.deltaBigText, delta >= 0 ? styles.posDelta : styles.negDelta]}>
                    {newTotal} <Text style={styles.ptsUnit}>pts</Text>
                  </Text>
                  <Text style={styles.newTotalSubtext}>
                    Change: {delta > 0 ? `+${delta}` : delta} from current {currentTotal} pts
                  </Text>
                </View>

                {/* Quick Delta Chips */}
                <Text style={styles.sectionTitle}>INCREMENT / DECREMENT STEPPER</Text>
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
                <Text style={styles.sectionTitle}>EVENT CATEGORY</Text>
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

                {/* Reason Input */}
                <InputField
                  label="MANDATORY AUDIT REASON"
                  placeholder="e.g. Day 2 Coding Sprint Round 1 Winner"
                  value={reason}
                  onChangeText={(txt) => {
                    setReason(txt);
                    if (error) setError(null);
                  }}
                  helperText="Required for competition transparency and tamper verification."
                />
              </>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            {isConfirming ? (
              <>
                <Button
                  title="← EDIT VALUES"
                  onPress={() => setIsConfirming(false)}
                  variant="outline"
                  size="md"
                  disabled={isSubmitting}
                  style={styles.actionBtn}
                />
                <Button
                  title="COMMIT TO DATABASE"
                  onPress={handleConfirmCommit}
                  variant="gold"
                  size="md"
                  loading={isSubmitting}
                  style={styles.actionBtn}
                />
              </>
            ) : (
              <>
                <Button
                  title="CANCEL"
                  onPress={handleReset}
                  variant="outline"
                  size="md"
                  style={styles.actionBtn}
                />
                <Button
                  title="REVIEW & CONFIRM →"
                  onPress={handleValidateAndProceed}
                  variant="gold"
                  size="md"
                  style={styles.actionBtn}
                />
              </>
            )}
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
    maxHeight: '92%',
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
  errorAlertBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorIcon: {
    color: COLORS.danger,
    marginRight: SPACING.sm,
  },
  errorAlertText: {
    color: '#FCA5A5',
    fontSize: TYPOGRAPHY.sizes.xs,
    flex: 1,
    lineHeight: 18,
    fontWeight: '600',
  },
  confirmBox: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
    marginBottom: SPACING.md,
  },
  confirmHeading: {
    color: COLORS.accentGoldBright,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 51, 104, 0.4)',
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
  },
  summaryVal: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },
  highlightVal: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '800',
  },
  auditStampNotice: {
    flexDirection: 'row',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: RADII.md,
    padding: SPACING.sm + 2,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  stampIcon: {
    marginRight: SPACING.xs + 2,
    fontSize: 14,
  },
  stampText: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
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
  ptsUnit: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    color: COLORS.textMuted,
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
