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
import { GalleryCard } from '../../../src/components/gallery/GalleryCard';
import { Button } from '../../../src/components/common/Button';
import { InputField } from '../../../src/components/common/InputField';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import {
  DEMO_GALLERY,
  GalleryItem,
  GalleryStatus,
  canUserApproveShowcase,
} from '@zenith/shared';

export default function GalleryScreen() {
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

  const tags = ['All', 'Aptitude', 'Technical', 'Team5', 'Strategy', 'Orientation'];
  const dayFilters = ['All', 'Day 01', 'Day 02', 'Day 03', 'Day 04'];

  const filtered = items.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
    const matchesDay =
      selectedDay === 'All' ||
      (selectedDay === 'Day 01' && item.day_number === 1) ||
      (selectedDay === 'Day 02' && item.day_number === 2) ||
      (selectedDay === 'Day 03' && item.day_number === 3) ||
      (selectedDay === 'Day 04' && item.day_number === 4);
    return matchesTag && matchesDay;
  });

  const handleToggleCurate = (id: string) => {
    if (!canCurate) {
      setFeedback('Authority Check: Only Captains, Vice-Captains & Admins can feature photos on the public showcase.');
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
              ? 'Photo endorsed & featured on Evaluator Web Showcase ★'
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
    setFeedback('Photo milestone uploaded successfully (marked Pending Review).');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <View style={styles.screen}>
      <Header title="MEDIA GALLERY" subtitle="Cohort Milestones & Photos" showBack />
      <DemoBanner />

      {feedback ? (
        <View style={styles.feedbackToast}>
          <Text style={styles.feedbackText}>ℹ {feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Gallery Intro Banner */}
        <View style={styles.introCard}>
          <Text style={styles.introPre}>SHOWCASE CURATION</Text>
          <Text style={styles.introTitle}>Team Training Moments</Text>
          <Text style={styles.introDesc}>
            Milestone photographs capturing whiteboard discussions, problem-solving sprints, and presentation rounds. Items marked 'Showcase Featured' populate the Evaluator Web Portal.
          </Text>
          <Button
            title="ADD TRAINING PHOTO 📷"
            onPress={() => setUploadModalVisible(true)}
            variant="secondary"
            size="sm"
            style={styles.addBtn}
          />
        </View>

        {/* Day Filters */}
        <Text style={styles.filterGroupTitle}>FILTER BY TRAINING DAY</Text>
        <View style={styles.tagFiltersRow}>
          {dayFilters.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.dayChip,
                selectedDay === d && styles.dayChipActive,
              ]}
              onPress={() => setSelectedDay(d)}
            >
              <Text
                style={[
                  styles.dayChipText,
                  selectedDay === d && styles.dayChipTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tag Filters */}
        <Text style={styles.filterGroupTitle}>FILTER BY TOPIC TAG</Text>
        <View style={styles.tagFiltersRow}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagChip,
                selectedTag === tag && styles.tagChipActive,
              ]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text
                style={[
                  styles.tagChipText,
                  selectedTag === tag && styles.tagChipTextActive,
                ]}
              >
                #{tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gallery Items */}
        <Text style={styles.sectionTitle}>
          MILESTONE ASSETS ({filtered.length} AVAILABLE)
        </Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Milestone Photos Found</Text>
            <Text style={styles.emptyDesc}>
              No photos match the selected Day or Tag filters. Tap "Add Training Photo 📷" to upload.
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
                <Text style={styles.inspectTitle}>TRAINING MILESTONE DETAIL</Text>
                <TouchableOpacity onPress={() => setInspectedItem(null)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inspectMediaBox}>
                <Text style={{ fontSize: 36, marginBottom: SPACING.xs }}>📷</Text>
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
                        ? 'UNFEATURE FROM SHOWCASE'
                        : 'FEATURE ON SHOWCASE ★'
                    }
                    onPress={() => {
                      handleToggleCurate(inspectedItem.id);
                      setInspectedItem(null);
                    }}
                    variant="gold"
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
              <Text style={styles.modalTitle}>ADD TRAINING MOMENT PHOTO</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>ASSOCIATED TRAINING DAY</Text>
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
                      DAY 0{d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <InputField
                label="PHOTO CAPTION"
                placeholder="e.g. Day 1 Aptitude speed drill debrief session"
                value={newCaption}
                onChangeText={setNewCaption}
                error={uploadError}
              />

              <Text style={styles.formLabel}>CURRICULUM TAG</Text>
              <View style={styles.tagFiltersRow}>
                {['Aptitude', 'Technical', 'Team5', 'Strategy', 'Architecture'].map((t) => (
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
                <Text style={{ fontSize: 26, marginBottom: 4 }}>📸</Text>
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
                variant="gold"
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
  introCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  introPre: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  introTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  introDesc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  addBtn: {
    alignSelf: 'flex-start',
  },
  filterGroupTitle: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  tagFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  dayChip: {
    backgroundColor: COLORS.surfaceCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  dayChipActive: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  dayChipText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  dayChipTextActive: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
  },
  tagChip: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagChipActive: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  tagChipText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  tagChipTextActive: {
    color: COLORS.brandCyanLight,
    fontWeight: '700',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
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
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  inspectSheet: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII['2xl'],
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  inspectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 51, 104, 0.4)',
  },
  inspectTitle: {
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
  inspectMediaBox: {
    height: 140,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  inspectMediaCaption: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xs + 1,
    fontWeight: '600',
    textAlign: 'center',
  },
  inspectMetaBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  inspectRow: {
    marginBottom: SPACING.xs,
  },
  inspectMetaLabel: {
    color: COLORS.brandCyanLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  inspectMetaVal: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  inspectActions: {
    flexDirection: 'row',
  },
  uploadSheet: {
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
  dayPickRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  dayChoiceBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
  },
  dayChoiceBtnActive: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  dayChoiceBtnText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  dayChoiceBtnTextActive: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
  },
  simPhotoPick: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderStyle: 'dashed',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  simPhotoName: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
  },
  simPhotoMeta: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
  },
});
