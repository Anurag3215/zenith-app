import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { GalleryCard } from '../../../src/components/gallery/GalleryCard';
import { Button } from '../../../src/components/common/Button';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { DEMO_GALLERY } from '@zenith/shared';

export default function GalleryScreen() {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [feedback, setFeedback] = useState<string | null>(null);

  const tags = ['All', 'Aptitude', 'Technical', 'Team5', 'Architecture'];

  const filtered =
    selectedTag === 'All'
      ? DEMO_GALLERY
      : DEMO_GALLERY.filter((item) => item.tags.includes(selectedTag));

  const handleInspect = (caption: string) => {
    setFeedback(`Selected milestone image: "${caption}"`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUploadSim = () => {
    setFeedback('Simulated Camera / Photo picker opened.');
    setTimeout(() => setFeedback(null), 3000);
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
            Images capturing whiteboard architecture, group debates, and presentations. Items marked with 'Showcase Featured' are visible on the Evaluator Web Portal.
          </Text>
          <Button
            title="ADD TRAINING PHOTO 📷"
            onPress={handleUploadSim}
            variant="secondary"
            size="sm"
            style={styles.addBtn}
          />
        </View>

        {/* Tag Filters */}
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
          MILESTONE ASSETS ({filtered.length})
        </Text>

        {filtered.map((item) => (
          <GalleryCard
            key={item.id}
            item={item}
            onPress={() => handleInspect(item.caption)}
          />
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
  tagFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
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
});
