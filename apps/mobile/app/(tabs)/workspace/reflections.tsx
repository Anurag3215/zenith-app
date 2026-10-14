import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ReflectionCard } from '../../../src/components/reflections/ReflectionCard';
import { Button } from '../../../src/components/common/Button';
import { MOBILE_THEME, SPACING, RADII, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import {
  DEMO_REFLECTIONS,
  Reflection,
  ReflectionVisibility,
  filterWorkspaceReflections,
  validateReflectionSubmission,
  canUserApproveShowcase,
} from '@zenith/shared';

type SegmentTab = 'my' | 'shared';

export default function ReflectionsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>(DEMO_REFLECTIONS);
  const [activeSegment, setActiveSegment] = useState<SegmentTab>('my');
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

    setFeedback('Draft saved locally. Visible exclusively to you in "My Reflections".');
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
      setFeedback('Reflection updated and shared.');
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
      setFeedback('Authority Check: Showcase endorsement is reserved for Captains & Admins.');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setReflections((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.is_approved_for_showcase;
          setFeedback(
            nextState
              ? `Reflection by ${r.member_name} approved for Showcase ★`
              : `Reflection unfeatured from Showcase`
          );
          setTimeout(() => setFeedback(null), 3000);
          return { ...r, is_approved_for_showcase: nextState };
        }
        return r;
      })
    );
  };

  // Convert SegmentTab to filterWorkspaceReflections parameter
  const filterParam = activeSegment === 'my' ? 'my' : 'all';
  const visibleReflections = filterWorkspaceReflections(reflections, user?.id, filterParam);

  return (
    <View style={styles.screen}>
      {/* Header bar matching blueprint */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={MOBILE_THEME.navyHeader} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reflections</Text>
        <TouchableOpacity
          style={styles.addIconBtn}
          onPress={() => {
            setEditingId(null);
            setModalVisible(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="New reflection"
        >
          <Ionicons name="add" size={24} color={MOBILE_THEME.navyHeader} />
        </TouchableOpacity>
      </View>

      {feedback ? (
        <View style={styles.feedbackToast}>
          <Ionicons name="information-circle" size={16} color={MOBILE_THEME.skyBlue} style={{ marginRight: 6 }} />
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Segmented Control Switcher matching Blueprint Screen 10 */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'my' && styles.segmentBtnActive]}
            onPress={() => setActiveSegment('my')}
          >
            <Text style={[styles.segmentText, activeSegment === 'my' && styles.segmentTextActive]}>
              My Reflections
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, activeSegment === 'shared' && styles.segmentBtnActive]}
            onPress={() => setActiveSegment('shared')}
          >
            <Text style={[styles.segmentText, activeSegment === 'shared' && styles.segmentTextActive]}>
              Shared
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>
            {activeSegment === 'my' ? 'MY ENTRIES & DRAFTS' : 'TEAM REFLECTIONS'} ({visibleReflections.length})
          </Text>
          <Text style={styles.badgeNote}>Daily Experiential Logs</Text>
        </View>

        {/* List of Reflections */}
        {visibleReflections.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="create-outline" size={44} color="#94A3B8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No Reflections Found</Text>
            <Text style={styles.emptyDesc}>
              {activeSegment === 'my'
                ? 'You have not authored any reflections yet. Tap "+" in the top right to log your daily insights.'
                : 'No shared reflections available in the cohort feed yet.'}
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
                {editingId ? 'Edit Daily Reflection' : 'New Reflection'}
              </Text>
              <TouchableOpacity onPress={handleRequestClose}>
                <Ionicons name="close" size={22} color="#64748B" />
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
                      Day 0{d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mood Rating */}
              <Text style={styles.formLabel}>CONFIDENCE / MASTERY (1-5)</Text>
              <View style={styles.moodRow}>
                {([1, 2, 3, 4, 5] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.moodBtn, moodRating === r && styles.moodBtnActive]}
                    onPress={() => setMoodRating(r)}
                  >
                    <Ionicons
                      name={moodRating >= r ? 'star' : 'star-outline'}
                      size={18}
                      color={moodRating >= r ? MOBILE_THEME.brandGoldBright : '#94A3B8'}
                    />
                    <Text style={[styles.moodBtnText, moodRating === r && styles.moodBtnTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Visibility Choice */}
              <Text style={styles.formLabel}>VISIBILITY</Text>
              <View style={styles.visibilityRow}>
                <TouchableOpacity
                  style={[
                    styles.visibilityBtn,
                    visibility === 'team' && styles.visibilityBtnActive,
                  ]}
                  onPress={() => setVisibility('team')}
                >
                  <Ionicons name="people-outline" size={16} color={visibility === 'team' ? MOBILE_THEME.skyBlue : '#64748B'} style={{ marginRight: 6 }} />
                  <Text
                    style={[
                      styles.visibilityBtnText,
                      visibility === 'team' && styles.visibilityBtnTextActive,
                    ]}
                  >
                    Share with Team 5
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.visibilityBtn,
                    visibility === 'private' && styles.visibilityBtnActive,
                  ]}
                  onPress={() => setVisibility('private')}
                >
                  <Ionicons name="lock-closed-outline" size={16} color={visibility === 'private' ? MOBILE_THEME.skyBlue : '#64748B'} style={{ marginRight: 6 }} />
                  <Text
                    style={[
                      styles.visibilityBtnText,
                      visibility === 'private' && styles.visibilityBtnTextActive,
                    ]}
                  >
                    Private Log
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.formLabel}>KEY TAKEAWAYS & PATTERNS</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="What critical principles did you master today? (min 10 characters)"
                placeholderTextColor="#94A3B8"
                value={keyTakeaways}
                onChangeText={setKeyTakeaways}
                multiline
                numberOfLines={3}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}

              <Text style={styles.formLabel}>CHALLENGES ENCOUNTERED</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Where did you get stuck or encounter difficulty?"
                placeholderTextColor="#94A3B8"
                value={challenges}
                onChangeText={setChallenges}
                multiline
                numberOfLines={2}
              />

              <Text style={styles.formLabel}>CORRECTIVE ACTION ITEMS</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="What will you practice before tomorrow's rounds?"
                placeholderTextColor="#94A3B8"
                value={actions}
                onChangeText={setActions}
                multiline
                numberOfLines={2}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="SAVE DRAFT"
                onPress={handleSaveDraft}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: SPACING.xs }}
              />
              <Button
                title={editingId ? 'UPDATE' : 'SUBMIT'}
                onPress={handleSubmit}
                variant="primary"
                size="md"
                style={{ flex: 1.5 }}
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
  addIconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADII.full,
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
  },
  feedbackText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '600',
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: RADII.full,
    padding: 3,
    marginBottom: SPACING.md,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADII.full,
  },
  segmentBtnActive: {
    backgroundColor: MOBILE_THEME.navyHeader,
    ...SHADOWS.card,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: MOBILE_THEME.textSecondary,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm + 2,
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: MOBILE_THEME.textSecondary,
  },
  badgeNote: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginTop: SPACING.md,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
  },
  emptyDesc: {
    fontSize: 12,
    color: MOBILE_THEME.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderTopLeftRadius: RADII['2xl'],
    borderTopRightRadius: RADII['2xl'],
    padding: SPACING.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: MOBILE_THEME.borderLight,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  modalBody: {
    marginBottom: SPACING.md,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
    marginTop: SPACING.sm,
    marginBottom: 6,
  },
  dayPickerRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  dayChoice: {
    flex: 1,
    backgroundColor: MOBILE_THEME.bgLight,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 6,
  },
  dayChoiceActive: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderColor: MOBILE_THEME.skyBlue,
  },
  dayChoiceText: {
    fontSize: 11,
    fontWeight: '600',
    color: MOBILE_THEME.textSecondary,
  },
  dayChoiceTextActive: {
    color: MOBILE_THEME.skyBlue,
    fontWeight: '800',
  },
  moodRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  moodBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: MOBILE_THEME.bgLight,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 6,
  },
  moodBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  moodBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: MOBILE_THEME.textSecondary,
    marginLeft: 4,
  },
  moodBtnTextActive: {
    color: '#92400E',
  },
  visibilityRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  visibilityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MOBILE_THEME.bgLight,
    paddingVertical: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 6,
  },
  visibilityBtnActive: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderColor: MOBILE_THEME.skyBlue,
  },
  visibilityBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: MOBILE_THEME.textSecondary,
  },
  visibilityBtnTextActive: {
    color: MOBILE_THEME.skyBlue,
    fontWeight: '700',
  },
  formInput: {
    backgroundColor: MOBILE_THEME.bgLight,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    fontSize: 13,
    color: MOBILE_THEME.navyHeader,
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: MOBILE_THEME.borderLight,
  },
});
