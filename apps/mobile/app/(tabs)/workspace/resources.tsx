import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { ResourceCard } from '../../../src/components/resources/ResourceCard';
import { Button } from '../../../src/components/common/Button';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { DEMO_RESOURCES } from '@zenith/shared';

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['All', 'Aptitude', 'Technical', 'HR & Soft Skills'];

  const filtered =
    selectedCategory === 'All'
      ? DEMO_RESOURCES
      : DEMO_RESOURCES.filter((r) => r.category === selectedCategory);

  const handleOpenDoc = (title: string) => {
    setToastMessage(`Opening simulated document: "${title}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUploadSim = () => {
    setToastMessage('Upload dialog simulated: File selector and access tier selector.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <View style={styles.screen}>
      <Header title="RESOURCES" subtitle="Curriculum Materials & Guides" showBack />
      <DemoBanner />

      {toastMessage ? (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>ℹ {toastMessage}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Storage Architecture Overview */}
        <View style={styles.storageCard}>
          <Text style={styles.storagePre}>SUPABASE STORAGE ARCHITECTURE</Text>
          <Text style={styles.storageTitle}>Private Documents & Public Showcase</Text>
          <Text style={styles.storageDesc}>
            Sensitive study sheets and mock resumes are locked within private S3 buckets. Assets flagged as 'Showcase Public' are accessible to evaluators.
          </Text>
          <Button
            title="UPLOAD NEW ASSET ⬆"
            onPress={handleUploadSim}
            variant="primary"
            size="sm"
            style={styles.uploadBtn}
          />
        </View>

        {/* Category Filters */}
        <View style={styles.categoriesRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Resources List */}
        <Text style={styles.sectionTitle}>
          DOCUMENTS ({filtered.length} AVAILABLE)
        </Text>

        {filtered.map((item) => (
          <ResourceCard
            key={item.id}
            item={item}
            onPress={() => handleOpenDoc(item.title)}
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
  toastBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.info,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  toastText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
  },
  storageCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.lg,
  },
  storagePre: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  storageTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  storageDesc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  uploadBtn: {
    alignSelf: 'flex-start',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  categoryChip: {
    backgroundColor: COLORS.surfaceCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  categoryText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  categoryTextActive: {
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
