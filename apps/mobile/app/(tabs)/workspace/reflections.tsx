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
  Alert,
} from 'react-native';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { ReflectionCard } from '../../../src/components/reflections/ReflectionCard';
import { Button } from '../../../src/components/common/Button';
import { InputField } from '../../../src/components/common/InputField';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import {
  DEMO_REFLECTIONS,
  Reflection,
  ReflectionVisibility,
  filterWorkspaceReflections,
  validateReflectionSubmission,
  canUserApproveShowcase,
} from '@zenith/shared';

type FilterTab = 'all' | 'my' | 'showcase';

export default function ReflectionsScreen() {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>(DEMO_REFLECTIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dayNumber, setDayNumber] = useState<1 | 2 | 3 | 4>(1);
  const [keyTakeaways, setKeyTakeaways] = useState('');
  const [challenges, setChallenges] = useState('');
  const [actions, setActions] = useState('');
  const [moodRating, setMoodRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [visibility, setVisibility] = useState<ReflectionVisibility>('team');
  const [error, setError] = useState<string | null>(null);

  const canApprove = canUserApproveShowcase(user?.role);

  const resetFormAndClose = () => {
    setEditingId(null);
    setKeyTakeaways('');
    setChallenges('');
    setActions('');
    setMoodRating(5);
    setVisibility('team');
    setError(null);
    setModalVisible(false);
  };

  const handleRequestClose = () => {
    const isDirty =
      keyTakeaways.trim().length > 0 ||
      challenges.trim().length > 0 ||
      actions.trim().length > 0;

    if (isDirty) {
      if (Platform.OS === 'web') {
        const confirmed = window.confirm(
          'Discard unsaved changes? Any unsubmitted content will be lost unless saved as a draft.'
        );
        if (confirmed) resetFormAndClose();
      } else {
        Alert.alert(
          'Unsaved Changes',
          'Discard uncommitted edits? Any unsubmitted content will be lost unless saved as a draft.',
          [
            { text: 'Keep Editing', style: 'cancel' },
            { text: 'Save Draft', onPress: handleSaveDraft },
            { text: 'Discard', style: 'destructive', onPress: resetFormAndClose },
          ]
        );
      }
    } else {
      resetFormAndClose();
    }
  };

  const handleSaveDraft = () => {
    if (keyTakeaways.trim().length === 0) {
      setError('Please provide at least a brief note to save as a draft.');
      return;
    }
    setError(null);

    if (editingId) {
      setReflections((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                day_number: dayNumber,
                key_takeaways: keyTakeaways,
                challenges_faced: challenges,
                action_items: actions,
                mood_rating: moodRating,
                visibility: 'private',
                is_draft: true,
                is_approved_for_showcase: false,
                updated_at: new Date().toISOString(),
              }
            : r
        )
      );
    } else {
      const draftEntry: Reflection = {
        id: `draft-${Date.now()}`,
        day_id: `day-0${dayNumber}`,
        day_number: dayNumber,
        member_id: user?.id || 'user-curr',
        member_name: user?.full_name || 'Current Candidate',
        member_role: user?.role || 'member',
        key_takeaways: keyTakeaways,
        challenges_faced: challenges,
        action_items: actions,
        mood_rating: moodRating,
        visibility: 'private',
        is_draft: true,
        is_approved_for_showcase: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setReflections((prev) => [draftEntry, ...prev]);
    }

    setFeedback('Draft saved locally. Visible exclusively to you in "My Logs & Drafts".');
    setTimeout(() => setFeedback(null), 3500);
    resetFormAndClose();
  };

  const handleSubmit = () => {
    const validation = validateReflectionSubmission({
      key_takeaways: keyTakeaways,
      day_number: dayNumber,
      mood_rating: moodRating,
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid reflection submission.');
      return;
    }
    setError(null);

    if (editingId) {
      setReflections((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                day_number: dayNumber,
                key_takeaways: keyTakeaways,
                challenges_faced: challenges,
                action_items: actions,
                mood_rating: moodRating,
                visibility: visibility,
                is_draft: false,
                updated_at: new Date().toISOString(),
              }
            : r
        )
      );
      setFeedback('Reflection updated and published to workspace.');
    } else {
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
        visibility: visibility,
        is_draft: false,
        is_approved_for_showcase: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setReflections((prev) => [newEntry, ...prev]);
      setFeedback('Reflection recorded and submitted to team timeline.');
    }

    setTimeout(() => setFeedback(null), 3500);
    resetFormAndClose();
  };

  const handleEdit = (refl: Reflection) => {
    if (user?.id !== refl.member_id) {
      setFeedback('Security Policy: You may only edit your own personal reflections.');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setEditingId(refl.id);
    setDayNumber(refl.day_number);
    setKeyTakeaways(refl.key_takeaways);
    setChallenges(refl.challenges_faced || '');
    setActions(refl.action_items || '');
    setMoodRating(refl.mood_rating);
    setVisibility(refl.visibility || 'team');
    setModalVisible(true);
  };

  const handleToggleApproval = (id: string) => {
    if (!canApprove) {
      setFeedback('Authority Check: Showcase endorsement is reserved for Captain, Vice-Captain & Admin.');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setReflections((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.is_approved_for_showcase;
          setFeedback(
            nextState
              ? `Reflection by ${r.member_name} approved for Evaluator Showcase ★`
              : `Reflection by ${r.member_name} unpublished from Showcase`
          );
          setTimeout(() => setFeedback(null), 3000);
          return { ...r, is_approved_for_showcase: nextState };
        }
        return r;
      })
    );
  };

  const visibleReflections = filterWorkspaceReflections(reflections, user?.id, activeTab);

  return (
    <View style={styles.screen}>
      <Header title="REFLECTIONS" subtitle="Daily Experiential Logs" showBack />
      <DemoBanner />

      {feedback ? (
        <View style={styles.feedbackToast}>
          <Text style={styles.feedbackText}>ℹ {feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Action Header Card */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>LOG DAILY LEARNINGS</Text>
          <Text style={styles.actionDesc}>
            Document core insights, algorithmic patterns, or interview feedback. Captains can endorse high-quality entries for the Evaluator Web Showcase.
          </Text>
          <Button
            title="LOG NEW REFLECTION +"
            onPress={() => {
              setEditingId(null);
              setModalVisible(true);
            }}
            variant="primary"
            size="md"
            style={styles.newBtn}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabsRow}>
          {(
            [
              { key: 'all', label: 'ALL REFLECTIONS' },
              { key: 'my', label: 'MY LOGS & DRAFTS' },
              { key: 'showcase', label: 'SHOWCASE APPROVED ★' },
            ] as const
          ).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, activeTab === tab.key && styles.filterTabActive]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === tab.key && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reflection Feed */}
        <Text style={styles.sectionTitle}>
          SHOWING {visibleReflections.length} ENTRIES
        </Text>

        {visibleReflections.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Reflections Found</Text>
            <Text style={styles.emptyDesc}>
              {activeTab === 'my'
                ? 'You have not authored any reflections or drafts yet. Tap "Log New Reflection +" to begin.'
                : activeTab === 'showcase'
                ? 'No reflections have been approved for the Evaluator Web Showcase yet.'
                : 'No reflections match the current filter.'}
            </Text>
          </View>
        ) : (
          visibleReflections.map((refl) => (
            <ReflectionCard
              key={refl.id}
              reflection={refl}
              canApprove={canApprove}
              isAuthor={user?.id === refl.member_id}
              onEdit={() => handleEdit(refl)}
              onToggleApproval={() => handleToggleApproval(refl.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Submission & Editing Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'EDIT DAILY REFLECTION' : 'LOG DAILY REFLECTION'}
              </Text>
              <TouchableOpacity onPress={handleRequestClose}>
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

              {/* Visibility Choice */}
              <Text style={styles.formLabel}>SHARING & VISIBILITY POLICY</Text>
              <View style={styles.visibilityRow}>
                <TouchableOpacity
                  style={[
                    styles.visibilityBtn,
                    visibility === 'team' && styles.visibilityBtnActive,
                  ]}
                  onPress={() => setVisibility('team')}
                >
                  <Text
                    style={[
                      styles.visibilityBtnText,
                      visibility === 'team' && styles.visibilityBtnTextActive,
                    ]}
                  >
                    👥 Share with Team 5
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.visibilityBtn,
                    visibility === 'private' && styles.visibilityBtnActive,
                  ]}
                  onPress={() => setVisibility('private')}
                >
                  <Text
                    style={[
                      styles.visibilityBtnText,
                      visibility === 'private' && styles.visibilityBtnTextActive,
                    ]}
                  >
                    🔒 Private Personal Log
                  </Text>
                </TouchableOpacity>
              </View>

              <InputField
                label="KEY TAKEAWAYS & TECHNICAL PATTERNS"
                placeholder="What critical principles did you master today? (min 10 characters)"
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
                title="SAVE DRAFT 💾"
                onPress={handleSaveDraft}
                variant="secondary"
                size="md"
                style={{ flex: 1, marginRight: SPACING.xs }}
              />
              <Button
                title="CANCEL"
                onPress={handleRequestClose}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: SPACING.xs }}
              />
              <Button
                title={editingId ? 'UPDATE' : 'SUBMIT'}
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
  feedbackToast: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.info,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  feedbackText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
  },
  actionCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.lg,
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
  filterTabsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  filterTab: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
  },
  filterTabActive: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  filterTabText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  filterTabTextActive: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
  emptyCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  emptyDesc: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 11, 24, 0.85)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surfaceCard,
    borderTopLeftRadius: RADII['2xl'],
    borderTopRightRadius: RADII['2xl'],
    padding: SPACING.lg,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 51, 104, 0.4)',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  modalCloseText: {
    color: COLORS.textMuted,
    fontSize: 18,
    padding: SPACING.xs,
  },
  modalBody: {
    marginBottom: SPACING.md,
  },
  formLabel: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
  },
  dayPickerRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  dayChoice: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
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
    fontWeight: '800',
  },
  moodRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  moodBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
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
    fontWeight: '800',
  },
  visibilityRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  visibilityBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.xs + 3,
    alignItems: 'center',
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
  },
  visibilityBtnActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: COLORS.brandCyan,
  },
  visibilityBtnText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  visibilityBtnTextActive: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
  },
});
