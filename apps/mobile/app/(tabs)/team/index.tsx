import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../src/theme';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { MemberCard } from '../../../src/components/team/MemberCard';
import { InputField } from '../../../src/components/common/InputField';
import { DEMO_PROFILES, Profile } from '@zenith/shared';

export default function TeamDirectoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = DEMO_PROFILES.filter((member) => {
    const q = searchQuery.toLowerCase();
    const matchesName = member.full_name.toLowerCase().includes(q);
    const matchesEmail = member.email.toLowerCase().includes(q);
    const matchesRole = member.role.toLowerCase().includes(q);
    const matchesSkill = member.skills.some((s) => s.toLowerCase().includes(q));
    return matchesName || matchesEmail || matchesRole || matchesSkill;
  });

  return (
    <View style={styles.screen}>
      <Header title="TEAM DIRECTORY" subtitle="Team No. 5 (8 Verified Accounts)" />
      <DemoBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Roster Summary Card */}
        <View style={styles.rosterCard}>
          <Text style={styles.rosterPre}>MEMBER PROVISIONING</Text>
          <Text style={styles.rosterTitle}>8 Authorized Candidates</Text>
          <Text style={styles.rosterDesc}>
            Access is bounded strictly to Team 5. Roles are assigned to distinct members to ensure operational separation of leadership, scoring, and governance.
          </Text>

          <View style={styles.roleTiersRow}>
            <View style={styles.tierPill}>
              <Text style={styles.tierPillText}>1 ADMIN</Text>
            </View>
            <View style={[styles.tierPill, styles.tierGold]}>
              <Text style={[styles.tierPillText, styles.tierGoldText]}>1 CAPTAIN</Text>
            </View>
            <View style={[styles.tierPill, styles.tierCyan]}>
              <Text style={[styles.tierPillText, styles.tierCyanText]}>1 VICE-CAPTAIN</Text>
            </View>
            <View style={styles.tierPill}>
              <Text style={styles.tierPillText}>5 MEMBERS</Text>
            </View>
          </View>
        </View>

        {/* Search Field */}
        <InputField
          label="SEARCH ROSTER OR SKILLS"
          placeholder="Filter by name, skill, or role..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchField}
        />

        {/* List of 8 Members */}
        <Text style={styles.sectionTitle}>
          TEAM ROSTER ({filteredMembers.length} MEMBERS)
        </Text>

        {filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onPress={() => router.push(`/(tabs)/team/${member.id}`)}
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
  rosterCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.lg,
  },
  rosterPre: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  rosterTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  rosterDesc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  roleTiersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tierPill: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tierPillText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  tierGold: {
    backgroundColor: COLORS.accentGoldSoft,
    borderColor: COLORS.accentGold,
  },
  tierGoldText: {
    color: COLORS.accentGoldBright,
  },
  tierCyan: {
    backgroundColor: COLORS.brandCyanSoft,
    borderColor: COLORS.brandCyan,
  },
  tierCyanText: {
    color: COLORS.brandCyanLight,
  },
  searchField: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
});
