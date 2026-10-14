import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { ReflectionCard } from '../../../src/components/reflections/ReflectionCard';
import { Button } from '../../../src/components/common/Button';
import { InputField } from '../../../src/components/common/InputField';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { DEMO_REFLECTIONS, Reflection } from '@zenith/shared';

export default function ReflectionsScreen() {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>(DEMO_REFLECTIONS);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [dayNumber, setDayNumber] = useState<1 | 2 | 3 | 4>(2);
  const [keyTakeaways, setKeyTakeaways] = useState('');
  const [challenges, setChallenges] = useState('');
  const [actions, setActions] = useState('');
  const [moodRating, setMoodRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [error, setError] = useState<string | null>(null);

  const canApprove =
    user?.role === 'captain' || user?.role === 'vice_captain' || user?.role === 'team_admin';

  const handleToggleApproval = (id: string) => {
    setReflections(
      reflections.map((r) =>
        r.id === id ? { ...r, is_approved_for_showcase: !r.is_approved_for_showcase } : r
      )
    );
  };

  const handleSubmit = () => {
    if (keyTakeaways.trim().length < 10) {
      setError('Key takeaways must be at least 10 characters long.');
      return;
    }
    setError(null);

    const newEntry: Reflection = {
      id: `refl-${Date.now()}`,
      day_id: `day-0${dayNumber}`,
      day_number: dayNumber,
      member_id: user?.id || 'user-curr',
      member_name: user?.full_name || 'Current Candidate',
      member_role: user?.role || 'member',
      key_takeaways: keyTakeaways,
      challenges_faced: challenges,
      action_items: actions,
      mood_rating: moodRating,
      is_approved_for_showcase: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setReflections([newEntry, ...reflections]);
    setKeyTakeaways('');
    setChallenges('');
    setActions('');
    setModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <Header title="REFLECTIONS" subtitle="Daily Experiential Logs" showBack />
      <DemoBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Action Header Card */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>LOG DAILY LEARNINGS</Text>
          <Text style={styles.actionDesc}>
            Document core insights, algorithmic patterns, or interview feedback. Captains can endorse high-quality entries for the Evaluator Web Showcase.
          </Text>
          <Button
            title="SUBMIT NEW REFLECTION +"
            onPress={() => setModalVisible(true)}
            variant="primary"
            size="md"
            style={styles.newBtn}
          />
        </View>

        {/* Reflection Feed */}
        <Text style={styles.sectionTitle}>
          TEAM REFLECTION HISTORY ({reflections.length})
        </Text>

        {reflections.map((refl) => (
          <ReflectionCard
            key={refl.id}
            reflection={refl}
            canApprove={canApprove}
            onToggleApproval={() => handleToggleApproval(refl.id)}
          />
        ))}
      </ScrollView>

      {/* Submission Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SUBMIT DAILY REFLECTION</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Day Selector */}
              <Text style={styles.formLabel}>CURRICULUM DAY</Text>
              <View style={styles.dayPickerRow}>
                {([1, 2, 3, 4] as const).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayChoice, dayNumber === d && styles.dayChoiceActive]}
                    onPress={() => setDayNumber(d)}
                  >
                    <Text style={[styles.dayChoiceText, dayNumber === d && styles.dayChoiceTextActive]}>
                      DAY 0{d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mood Rating */}
              <Text style={styles.formLabel}>MASTERY / CONFIDENCE RATING (1-5)</Text>
              <View style={styles.moodRow}>
                {([1, 2, 3, 4, 5] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.moodBtn, moodRating === r && styles.moodBtnActive]}
                    onPress={() => setMoodRating(r)}
                  >
                    <Text style={[styles.moodBtnText, moodRating === r && styles.moodBtnTextActive]}>
                      {r} ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <InputField
                label="KEY TAKEAWAYS & TECHNICAL PATTERNS"
                placeholder="What critical principles did you master today?"
                value={keyTakeaways}
                onChangeText={setKeyTakeaways}
                multiline
                numberOfLines={3}
                error={error}
              />

              <InputField
                label="CHALLENGES FACED"
                placeholder="Where did you get stuck or encounter difficulty?"
                value={challenges}
                onChangeText={setChallenges}
                multiline
                numberOfLines={2}
              />

              <InputField
                label="CORRECTIVE ACTION ITEMS"
                placeholder="What will you practice before tomorrow's rounds?"
                value={actions}
                onChangeText={setActions}
                multiline
                numberOfLines={2}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="CANCEL"
                onPress={() => setModalVisible(false)}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: SPACING.sm }}
              />
              <Button
                title="SUBMIT ENTRY"
                onPress={handleSubmit}
                variant="gold"
                size="md"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  actionCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  actionTitle: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  actionDesc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  newBtn: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 20, 0.85)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surfaceElevated,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    maxHeight: '90%',
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalCloseText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    padding: SPACING.lg,
  },
  formLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs + 2,
  },
  dayPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  dayChoice: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  dayChoiceActive: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  dayChoiceText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  dayChoiceTextActive: {
    color: COLORS.brandCyanLight,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  moodBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  moodBtnActive: {
    backgroundColor: COLORS.accentGoldSoft,
    borderColor: COLORS.accentGold,
  },
  moodBtnText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  moodBtnTextActive: {
    color: COLORS.accentGoldBright,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
});
