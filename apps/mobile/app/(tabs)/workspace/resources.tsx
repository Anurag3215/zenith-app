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
import { ResourceCard } from '../../../src/components/resources/ResourceCard';
import { Button } from '../../../src/components/common/Button';
import { InputField } from '../../../src/components/common/InputField';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import {
  DEMO_RESOURCES,
  ResourceItem,
  AccessTier,
  validateResourceUpload,
} from '@zenith/shared';

type AccessFilter = 'all' | 'showcase_public' | 'internal_only';

export default function ResourcesScreen() {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceItem[]>(DEMO_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [accessFilter, setAccessFilter] = useState<AccessFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Modal State
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Aptitude');
  const [newAccess, setNewAccess] = useState<AccessTier>('showcase_public');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);

  const categories = ['All', 'Aptitude', 'Technical', 'HR & Soft Skills'];

  const filtered = resources.filter((r) => {
    const matchesCategory =
      selectedCategory === 'All' || r.category === selectedCategory;
    const matchesAccess =
      accessFilter === 'all' || r.access_level === accessFilter;
    const matchesQuery =
      searchQuery.trim().length === 0 ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesAccess && matchesQuery;
  });

  const handleOpenDoc = (item: ResourceItem) => {
    setPreviewItem(item);
  };

  const handleSimulateDownload = (item: ResourceItem) => {
    setPreviewItem(null);
    setToastMessage(`Simulated Secure S3 Retrieval: "${item.title}" (${(item.file_size / (1024 * 1024)).toFixed(1)} MB) downloaded.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveUpload = () => {
    const validation = validateResourceUpload({
      title: newTitle,
      size: 2500000, // 2.5 MB simulated
      mimeType: 'application/pdf',
    });

    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file metadata.');
      return;
    }
    setUploadError(null);

    const newResource: ResourceItem = {
      id: `res-${Date.now()}`,
      day_id: 'day-01',
      day_number: 1,
      uploader_id: user?.id || 'user-curr',
      uploader_name: user?.full_name || 'Current Candidate',
      title: newTitle.trim(),
      category: newCategory,
      file_path: `documents/${newTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      file_size: 2500000,
      mime_type: 'application/pdf',
      access_level: newAccess,
      created_at: new Date().toISOString(),
    };

    setResources([newResource, ...resources]);
    setNewTitle('');
    setUploadModalVisible(false);
    setToastMessage(
      `Resource uploaded: "${newResource.title}" [${newResource.access_level === 'showcase_public' ? 'Showcase Public' : 'Internal Only'}]`
    );
    setTimeout(() => setToastMessage(null), 3500);
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
            Internal study sheets are locked within private S3 storage with RLS enforcement. Assets flagged as 'Showcase Public' are authorized for public evaluators.
          </Text>
          <Button
            title="UPLOAD NEW ASSET ⬆"
            onPress={() => setUploadModalVisible(true)}
            variant="primary"
            size="sm"
            style={styles.uploadBtn}
          />
        </View>

        {/* Search Bar */}
        <InputField
          label="SEARCH CURRICULUM ASSETS"
          placeholder="Filter by title, formula sheet, or topic..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Access Tier Filter Tabs */}
        <View style={styles.accessRow}>
          {(
            [
              { key: 'all', label: 'ALL ACCESS' },
              { key: 'showcase_public', label: '★ SHOWCASE PUBLIC' },
              { key: 'internal_only', label: '🔒 INTERNAL ONLY' },
            ] as const
          ).map((tier) => (
            <TouchableOpacity
              key={tier.key}
              style={[
                styles.accessChip,
                accessFilter === tier.key && styles.accessChipActive,
              ]}
              onPress={() => setAccessFilter(tier.key)}
            >
              <Text
                style={[
                  styles.accessText,
                  accessFilter === tier.key && styles.accessTextActive,
                ]}
              >
                {tier.label}
              </Text>
            </TouchableOpacity>
          ))}
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

        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Matching Documents</Text>
            <Text style={styles.emptyDesc}>
              Try adjusting your search query or selecting a different access tier filter.
            </Text>
          </View>
        ) : (
          filtered.map((item) => (
            <ResourceCard
              key={item.id}
              item={item}
              onPress={() => handleOpenDoc(item)}
            />
          ))
        )}
      </ScrollView>

      {/* Document Detail & Safe Preview Modal */}
      {previewItem ? (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.previewSheet}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewIcon}>📄</Text>
                <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                  <Text style={styles.previewTitle}>{previewItem.title}</Text>
                  <Text style={styles.previewSub}>
                    {previewItem.category} • {(previewItem.file_size / (1024 * 1024)).toFixed(1)} MB
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setPreviewItem(null)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.previewMetaBox}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>ACCESS CLASSIFICATION:</Text>
                  <Text style={styles.metaValue}>
                    {previewItem.access_level === 'showcase_public'
                      ? '★ Showcase Public (Evaluator Visible)'
                      : '🔒 Internal Team Only (Private S3 Bucket)'}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>MIME TYPE:</Text>
                  <Text style={styles.metaValue}>{previewItem.mime_type}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>CONTRIBUTOR:</Text>
                  <Text style={styles.metaValue}>{previewItem.uploader_name}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>STORAGE PATH:</Text>
                  <Text style={styles.metaValue}>{previewItem.file_path}</Text>
                </View>
              </View>

              <View style={styles.previewNoticeBox}>
                <Text style={styles.previewNoticeText}>
                  🛡 Security Verification: Storage RLS enforces that this document is served via time-limited signed URLs directly from protected bucket storage.
                </Text>
              </View>

              <View style={styles.previewActions}>
                <Button
                  title="CLOSE"
                  onPress={() => setPreviewItem(null)}
                  variant="outline"
                  size="md"
                  style={{ flex: 1, marginRight: SPACING.sm }}
                />
                <Button
                  title="DOWNLOAD / OPEN FILE 📥"
                  onPress={() => handleSimulateDownload(previewItem)}
                  variant="primary"
                  size="md"
                  style={{ flex: 1.5 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      {/* Upload Asset Modal */}
      <Modal visible={uploadModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.uploadSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>UPLOAD NEW LEARNING ASSET</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <InputField
                label="DOCUMENT TITLE"
                placeholder="e.g. Dynamic Programming Cheat Sheet"
                value={newTitle}
                onChangeText={setNewTitle}
                error={uploadError}
              />

              <Text style={styles.formLabel}>CURRICULUM CATEGORY</Text>
              <View style={styles.categoriesRow}>
                {['Aptitude', 'Technical', 'HR & Soft Skills'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.categoryChip,
                      newCategory === c && styles.categoryChipActive,
                    ]}
                    onPress={() => setNewCategory(c)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        newCategory === c && styles.categoryTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>ACCESS LEVEL / POLICY</Text>
              <View style={styles.accessRow}>
                <TouchableOpacity
                  style={[
                    styles.accessChip,
                    newAccess === 'showcase_public' && styles.accessChipActive,
                  ]}
                  onPress={() => setNewAccess('showcase_public')}
                >
                  <Text
                    style={[
                      styles.accessText,
                      newAccess === 'showcase_public' && styles.accessTextActive,
                    ]}
                  >
                    ★ Showcase Public
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.accessChip,
                    newAccess === 'internal_only' && styles.accessChipActive,
                  ]}
                  onPress={() => setNewAccess('internal_only')}
                >
                  <Text
                    style={[
                      styles.accessText,
                      newAccess === 'internal_only' && styles.accessTextActive,
                    ]}
                  >
                    🔒 Internal Only
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.simulatedFilePick}>
                <Text style={styles.simFileIcon}>📎</Text>
                <Text style={styles.simFileName}>simulated_document_payload.pdf</Text>
                <Text style={styles.simFileSize}>2.5 MB • application/pdf</Text>
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
                title="CONFIRM UPLOAD"
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
    ...SHADOWS.card,
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
  accessRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  accessChip: {
    backgroundColor: COLORS.surfaceCard,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
  },
  accessChipActive: {
    backgroundColor: COLORS.accentGoldSoft,
    borderColor: COLORS.accentGold,
  },
  accessText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  accessTextActive: {
    color: COLORS.accentGoldBright,
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
  previewSheet: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII['2xl'],
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 51, 104, 0.4)',
  },
  previewIcon: {
    fontSize: 24,
  },
  previewTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm + 1,
    fontWeight: '800',
  },
  previewSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  previewMetaBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  metaRow: {
    marginBottom: SPACING.xs,
  },
  metaLabel: {
    color: COLORS.brandCyanLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  metaValue: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  previewNoticeBox: {
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderRadius: RADII.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  previewNoticeText: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    lineHeight: 15,
  },
  previewActions: {
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
  simulatedFilePick: {
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
  simFileIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  simFileName: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
  },
  simFileSize: {
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
