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
import { ResourceCard } from '../../../src/components/resources/ResourceCard';
import { Button } from '../../../src/components/common/Button';
import { MOBILE_THEME, SPACING, RADII, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import {
  DEMO_RESOURCES,
  ResourceItem,
  AccessTier,
  validateResourceUpload,
} from '@zenith/shared';

type TypeFilter = 'All' | 'Documents' | 'Links' | 'Media';
type AccessFilter = 'all' | 'showcase_public' | 'internal_only';

export default function ResourcesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceItem[]>(DEMO_RESOURCES);
  const [activeType, setActiveType] = useState<TypeFilter>('All');
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

  const typeTabs: TypeFilter[] = ['All', 'Documents', 'Links', 'Media'];

  const filtered = resources.filter((r) => {
    // Type Filter
    let matchesType = true;
    if (activeType === 'Documents') {
      matchesType = r.mime_type.includes('pdf') || r.mime_type.includes('doc');
    } else if (activeType === 'Links') {
      matchesType = !r.mime_type.includes('pdf') && !r.mime_type.includes('zip');
    } else if (activeType === 'Media') {
      matchesType = r.mime_type.includes('zip') || r.mime_type.includes('image');
    }

    // Access Filter
    const matchesAccess =
      accessFilter === 'all' || r.access_level === accessFilter;

    // Search Query
    const matchesQuery =
      searchQuery.trim().length === 0 ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesAccess && matchesQuery;
  });

  const handleOpenDoc = (item: ResourceItem) => {
    setPreviewItem(item);
  };

  const handleSimulateDownload = (item: ResourceItem) => {
    setPreviewItem(null);
    setToastMessage(`Downloaded "${item.title}" (${(item.file_size / (1024 * 1024)).toFixed(1)} MB).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveUpload = () => {
    const validation = validateResourceUpload({
      title: newTitle,
      size: 2500000,
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
        <Text style={styles.headerTitle}>Resources</Text>
        <TouchableOpacity
          style={styles.addIconBtn}
          onPress={() => setUploadModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Add resource"
        >
          <Ionicons name="add" size={24} color={MOBILE_THEME.navyHeader} />
        </TouchableOpacity>
      </View>

      {toastMessage ? (
        <View style={styles.toastBox}>
          <Ionicons name="checkmark-circle" size={16} color="#16A34A" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search Bar matching Blueprint Screen 8 */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips matching Blueprint Screen 8 */}
        <View style={styles.filterChipsRow}>
          {typeTabs.map((tab) => {
            const isActive = activeType === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveType(tab)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Access Tier Secondary Filter */}
        <View style={styles.accessRow}>
          {(
            [
              { key: 'all', label: 'All Access' },
              { key: 'showcase_public', label: '★ Showcase Public' },
              { key: 'internal_only', label: '🔒 Internal Only' },
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

        {/* Section Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>
            {activeType.toUpperCase()} ({filtered.length})
          </Text>
          <Text style={styles.storageNote}>Supabase S3 RLS Protected</Text>
        </View>

        {/* List of Resource Cards */}
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={44} color="#94A3B8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No Resources Found</Text>
            <Text style={styles.emptyDesc}>
              Try adjusting your search query or switching filter tabs.
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
                <View style={styles.previewIconBox}>
                  <Ionicons name="document-text" size={24} color={MOBILE_THEME.navyHeader} />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                  <Text style={styles.previewTitle}>{previewItem.title}</Text>
                  <Text style={styles.previewSub}>
                    {previewItem.category} • {(previewItem.file_size / (1024 * 1024)).toFixed(1)} MB
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setPreviewItem(null)}>
                  <Ionicons name="close" size={22} color="#64748B" />
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
                  title="DOWNLOAD / OPEN 📥"
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
              <Text style={styles.modalTitle}>Upload Resource</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>DOCUMENT TITLE</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Dynamic Programming Cheat Sheet"
                placeholderTextColor="#94A3B8"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

              <Text style={styles.formLabel}>CATEGORY</Text>
              <View style={styles.categoryPickerRow}>
                {['Aptitude', 'Technical', 'HR & Soft Skills'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.categoryOption,
                      newCategory === c && styles.categoryOptionActive,
                    ]}
                    onPress={() => setNewCategory(c)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        newCategory === c && styles.categoryOptionTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>ACCESS LEVEL</Text>
              <View style={styles.categoryPickerRow}>
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    newAccess === 'showcase_public' && styles.categoryOptionActive,
                  ]}
                  onPress={() => setNewAccess('showcase_public')}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      newAccess === 'showcase_public' && styles.categoryOptionTextActive,
                    ]}
                  >
                    ★ Showcase Public
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    newAccess === 'internal_only' && styles.categoryOptionActive,
                  ]}
                  onPress={() => setNewAccess('internal_only')}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      newAccess === 'internal_only' && styles.categoryOptionTextActive,
                    ]}
                  >
                    🔒 Internal Only
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.simulatedFilePick}>
                <Ionicons name="document-attach" size={28} color={MOBILE_THEME.skyBlue} />
                <Text style={styles.simFileName}>simulated_curriculum_payload.pdf</Text>
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
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
  },
  toastText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600',
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: MOBILE_THEME.navyHeader,
  },
  filterChipsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADII.full,
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: MOBILE_THEME.navyHeader,
    borderColor: MOBILE_THEME.navyHeader,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: MOBILE_THEME.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  accessRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  accessChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADII.md,
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 8,
  },
  accessChipActive: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderColor: MOBILE_THEME.skyBlue,
  },
  accessText: {
    fontSize: 11,
    fontWeight: '600',
    color: MOBILE_THEME.textMuted,
  },
  accessTextActive: {
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
  storageNote: {
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
  previewSheet: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII['2xl'],
    padding: SPACING.lg,
    ...SHADOWS.cardHover,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: MOBILE_THEME.borderLight,
  },
  previewIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADII.lg,
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
  },
  previewSub: {
    fontSize: 11,
    color: MOBILE_THEME.textSecondary,
    marginTop: 2,
  },
  previewMetaBox: {
    backgroundColor: MOBILE_THEME.bgLight,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  metaRow: {
    marginBottom: SPACING.xs,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: MOBILE_THEME.textMuted,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: MOBILE_THEME.navyHeader,
    marginTop: 1,
  },
  previewNoticeBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: RADII.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  previewNoticeText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#1E40AF',
  },
  previewActions: {
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
  categoryPickerRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  categoryOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADII.md,
    backgroundColor: MOBILE_THEME.bgLight,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginRight: 6,
  },
  categoryOptionActive: {
    backgroundColor: MOBILE_THEME.bgSoftBlue,
    borderColor: MOBILE_THEME.skyBlue,
  },
  categoryOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: MOBILE_THEME.textSecondary,
  },
  categoryOptionTextActive: {
    color: MOBILE_THEME.skyBlue,
    fontWeight: '700',
  },
  simulatedFilePick: {
    backgroundColor: MOBILE_THEME.bgLight,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOBILE_THEME.skyBlue,
    borderStyle: 'dashed',
    marginTop: SPACING.md,
  },
  simFileName: {
    fontSize: 12,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
    marginTop: 4,
  },
  simFileSize: {
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
