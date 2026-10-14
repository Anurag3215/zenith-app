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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GalleryCard } from '../../../src/components/gallery/GalleryCard';
import { Button } from '../../../src/components/common/Button';
import { MOBILE_THEME, SPACING, RADII, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import {
  DEMO_GALLERY,
  GalleryItem,
  GalleryStatus,
  canUserApproveShowcase,
} from '@zenith/shared';

export default function GalleryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>(DEMO_GALLERY);
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Upload Modal State
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [newDay, setNewDay] = useState<1 | 2 | 3 | 4>(1);
  const [newCaption, setNewCaption] = useState('');
  const [newTag, setNewTag] = useState('Team5');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Inspect Modal State
  const [inspectedItem, setInspectedItem] = useState<GalleryItem | null>(null);

  const canCurate = canUserApproveShowcase(user?.role);

  const dayTabs = ['All', 'Day 1', 'Day 2', 'Day 3', 'Day 4'];
  const tags = ['All', 'Aptitude', 'Technical', 'Team5', 'Strategy'];

  const filtered = items.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
    const matchesDay =
      selectedDay === 'All' ||
      (selectedDay === 'Day 1' && item.day_number === 1) ||
      (selectedDay === 'Day 2' && item.day_number === 2) ||
      (selectedDay === 'Day 3' && item.day_number === 3) ||
      (selectedDay === 'Day 4' && item.day_number === 4);
    return matchesTag && matchesDay;
  });

  const handleToggleCurate = (id: string) => {
    if (!canCurate) {
      setFeedback('Authority Check: Only Captains, Vice-Captains & Admins can feature photos.');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextFeatured = !item.is_featured_showcase;
          const nextStatus: GalleryStatus = nextFeatured ? 'approved_showcase' : 'internal';
          setFeedback(
            nextFeatured
              ? 'Photo featured on Evaluator Showcase ★'
              : 'Photo unfeatured from Evaluator Showcase'
          );
          setTimeout(() => setFeedback(null), 3000);
          return {
            ...item,
            is_featured_showcase: nextFeatured,
            status: nextStatus,
          };
        }
        return item;
      })
    );
  };

  const handleSaveUpload = () => {
    if (newCaption.trim().length < 5) {
      setUploadError('Please provide a caption describing the milestone (at least 5 characters).');
      return;
    }
    setUploadError(null);

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      day_id: `day-0${newDay}`,
      day_number: newDay,
      uploader_id: user?.id || 'user-curr',
      uploader_name: user?.full_name || 'Current Candidate',
      media_url: `simulated_milestone_day${newDay}_${Date.now()}`,
      caption: newCaption.trim(),
      tags: [newTag, 'Team5'],
      status: 'pending_review',
      is_featured_showcase: false,
      created_at: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    setNewCaption('');
    setUploadModalVisible(false);
    setFeedback('Photo uploaded successfully (marked Pending Review).');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <View style={styles.screen}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={MOBILE_THEME.navyHeader} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery</Text>
        <TouchableOpacity
          style={styles.addIconBtn}
          onPress={() => setUploadModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Add photo"
        >
          <Ionicons name="camera-outline" size={22} color={MOBILE_THEME.navyHeader} />
        </TouchableOpacity>
      </View>

      {feedback ? (
        <View style={styles.feedbackToast}>
          <Ionicons name="information-circle" size={16} color={MOBILE_THEME.skyBlue} style={{ marginRight: 6 }} />
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Day Tabs matching Blueprint Screen 9 */}
        <View style={styles.dayTabsRow}>
          {dayTabs.map((d) => {
            const isActive = selectedDay === d;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.dayTab, isActive && styles.dayTabActive]}
                onPress={() => setSelectedDay(d)}
              >
                <Text style={[styles.dayTabText, isActive && styles.dayTabTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tag Filters */}
        <View style={styles.tagFiltersRow}>
          {tags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, isActive && styles.tagChipActive]}
                onPress={() => setSelectedTag(tag)}
              >
                <Text style={[styles.tagChipText, isActive && styles.tagChipTextActive]}>
                  {tag === 'All' ? 'All Tags' : `#${tag}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>
            MOMENTS ({filtered.length})
          </Text>
          <Text style={styles.badgeNote}>Four-Day Training Journey</Text>
        </View>

        {/* Gallery Items */}
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="images-outline" size={44} color="#94A3B8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No Milestone Photos Found</Text>
            <Text style={styles.emptyDesc}>
              No photos match the selected Day or Tag filters. Tap the camera icon above to upload.
            </Text>
          </View>
        ) : (
          filtered.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              canCurate={canCurate}
              onPress={() => setInspectedItem(item)}
              onToggleCurate={() => handleToggleCurate(item.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Inspect Photo Detail Modal */}
      {inspectedItem ? (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.inspectSheet}>
              <View style={styles.inspectHeader}>
                <Text style={styles.inspectTitle}>Milestone Detail</Text>
                <TouchableOpacity onPress={() => setInspectedItem(null)}>
                  <Ionicons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.inspectMediaBox}>
                <Ionicons name="image-outline" size={44} color={MOBILE_THEME.skyBlue} style={{ marginBottom: 8 }} />
                <Text style={styles.inspectMediaCaption}>
                  {inspectedItem.caption}
                </Text>
              </View>

              <View style={styles.inspectMetaBox}>
                <View style={styles.inspectRow}>
                  <Text style={styles.inspectMetaLabel}>CURRICULUM DAY:</Text>
                  <Text style={styles.inspectMetaVal}>
                    {inspectedItem.day_number ? `Day 0${inspectedItem.day_number}` : 'Cohort Orientation'}
                  </Text>
                </View>
                <View style={styles.inspectRow}>
                  <Text style={styles.inspectMetaLabel}>CONTRIBUTOR:</Text>
                  <Text style={styles.inspectMetaVal}>{inspectedItem.uploader_name}</Text>
                </View>
                <View style={styles.inspectRow}>
                  <Text style={styles.inspectMetaLabel}>SHOWCASE STATUS:</Text>
                  <Text style={styles.inspectMetaVal}>
                    {inspectedItem.is_featured_showcase
                      ? '★ Featured on Evaluator Portal'
                      : '🔒 Internal Workspace Archive'}
                  </Text>
                </View>
              </View>

              <View style={styles.inspectActions}>
                <Button
                  title="CLOSE"
                  onPress={() => setInspectedItem(null)}
                  variant="outline"
                  size="md"
                  style={{ flex: 1, marginRight: SPACING.sm }}
                />
                {canCurate ? (
                  <Button
                    title={
                      inspectedItem.is_featured_showcase
                        ? 'UNFEATURE'
                        : 'FEATURE ON SHOWCASE ★'
                    }
                    onPress={() => {
                      handleToggleCurate(inspectedItem.id);
                      setInspectedItem(null);
                    }}
                    variant="primary"
                    size="md"
                    style={{ flex: 1.5 }}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      {/* Upload Photo Modal */}
      <Modal visible={uploadModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.uploadSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Training Photo</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>TRAINING DAY</Text>
              <View style={styles.dayPickRow}>
                {([1, 2, 3, 4] as const).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayChoiceBtn, newDay === d && styles.dayChoiceBtnActive]}
                    onPress={() => setNewDay(d)}
                  >
                    <Text
                      style={[
                        styles.dayChoiceBtnText,
                        newDay === d && styles.dayChoiceBtnTextActive,
                      ]}
                    >
                      Day 0{d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>PHOTO CAPTION</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Day 1 Aptitude speed drill debrief session"
                placeholderTextColor="#94A3B8"
                value={newCaption}
                onChangeText={setNewCaption}
              />
              {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

              <Text style={styles.formLabel}>CURRICULUM TAG</Text>
              <View style={styles.tagFiltersRow}>
                {['Aptitude', 'Technical', 'Team5', 'Strategy'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.tagChip,
                      newTag === t && styles.tagChipActive,
                    ]}
                    onPress={() => setNewTag(t)}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        newTag === t && styles.tagChipTextActive,
                      ]}
                    >
                      #{t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.simPhotoPick}>
                <Ionicons name="image" size={32} color={MOBILE_THEME.skyBlue} />
                <Text style={styles.simPhotoName}>milestone_capture_preview.jpg</Text>
                <Text style={styles.simPhotoMeta}>Camera / Photo Roll Simulated Asset</Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="CANCEL"
                onPress={() => setUploadModalVisible(false)}
                variant="outline"
                size="md"
                style={{ flex: 1, marginRight: SPACING.sm }}
              />
              <Button
                title="SAVE PHOTO"
                onPress={handleSaveUpload}
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
  dayTabsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADII.full,
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 8,
  },
  dayTabActive: {
    backgroundColor: MOBILE_THEME.navyHeader,
    borderColor: MOBILE_THEME.navyHeader,
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: MOBILE_THEME.textSecondary,
  },
  dayTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tagFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  tagChip: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 8,
    marginBottom: 6,
  },
  tagChipActive: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderColor: MOBILE_THEME.skyBlue,
  },
  tagChipText: {
    color: MOBILE_THEME.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  tagChipTextActive: {
    color: MOBILE_THEME.skyBlue,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  inspectSheet: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII['2xl'],
    padding: SPACING.lg,
    ...SHADOWS.cardHover,
  },
  inspectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: MOBILE_THEME.borderLight,
  },
  inspectTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  inspectMediaBox: {
    height: 150,
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  inspectMediaCaption: {
    fontSize: 12,
    fontWeight: '600',
    color: MOBILE_THEME.navyHeader,
    textAlign: 'center',
  },
  inspectMetaBox: {
    backgroundColor: MOBILE_THEME.bgLight,
    borderRadius: RADII.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  inspectRow: {
    marginBottom: SPACING.xs,
  },
  inspectMetaLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: MOBILE_THEME.textMuted,
  },
  inspectMetaVal: {
    fontSize: 11,
    fontWeight: '600',
    color: MOBILE_THEME.navyHeader,
    marginTop: 1,
  },
  inspectActions: {
    flexDirection: 'row',
  },
  uploadSheet: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderTopLeftRadius: RADII['2xl'],
    borderTopRightRadius: RADII['2xl'],
    padding: SPACING.lg,
    maxHeight: '90%',
    marginTop: 'auto',
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
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    marginTop: 4,
  },
  dayPickRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  dayChoiceBtn: {
    flex: 1,
    backgroundColor: MOBILE_THEME.bgLight,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 6,
  },
  dayChoiceBtnActive: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderColor: MOBILE_THEME.skyBlue,
  },
  dayChoiceBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: MOBILE_THEME.textSecondary,
  },
  dayChoiceBtnTextActive: {
    color: MOBILE_THEME.skyBlue,
    fontWeight: '800',
  },
  simPhotoPick: {
    backgroundColor: MOBILE_THEME.bgLight,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOBILE_THEME.skyBlue,
    borderStyle: 'dashed',
    marginTop: SPACING.md,
  },
  simPhotoName: {
    fontSize: 12,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
    marginTop: 4,
  },
  simPhotoMeta: {
    fontSize: 10,
    color: MOBILE_THEME.textMuted,
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: MOBILE_THEME.borderLight,
  },
});
