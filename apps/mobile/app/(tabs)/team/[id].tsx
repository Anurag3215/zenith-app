import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../../src/theme';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { Badge } from '../../../src/components/common/Badge';
import { Card } from '../../../src/components/common/Card';
import { Button } from '../../../src/components/common/Button';
import { InputField } from '../../../src/components/common/InputField';
import { useAuth } from '../../../src/context/AuthContext';
import { DEMO_PROFILES } from '@zenith/shared';

export default function MemberProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const member = DEMO_PROFILES.find((p) => p.id === id) || DEMO_PROFILES[0];
  const isSelf = user?.id === member.id;

  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(member.bio || '');
  const [skillsList, setSkillsList] = useState<string[]>(member.skills);
  const [newSkill, setNewSkill] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (newSkill.trim().length > 0 && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    setFeedback('Profile updates saved successfully (simulated preview).');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="MEMBER PROFILE"
        subtitle="Team No. 5 Credentials"
        showBack
      />
      <DemoBanner />

      {feedback ? (
        <View style={styles.feedbackToast}>
          <Text style={styles.feedbackText}>✓ {feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <Card variant="highlighted" style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {member.full_name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.titleCol}>
              <Text style={styles.fullName}>{member.full_name}</Text>
              <Text style={styles.emailText}>{member.email}</Text>
              <View style={styles.roleBadgeRow}>
                <Badge
                  label={member.role.replace('_', ' ')}
                  variant="role"
                  role={member.role}
                />
              </View>
            </View>
          </View>

          {isSelf ? (
            <TouchableOpacity
              style={styles.editToggleBtn}
              onPress={() => setIsEditing(!isEditing)}
              accessibilityRole="button"
            >
              <Text style={styles.editToggleText}>
                {isEditing ? 'CANCEL EDITING ✕' : 'EDIT MY PROFILE ✎'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </Card>

        {/* Biography Section */}
        <Card variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>PROFESSIONAL BIOGRAPHY</Text>
          {isEditing ? (
            <InputField
              label="EDIT BIO"
              value={bioText}
              onChangeText={setBioText}
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.bioBody}>{bioText}</Text>
          )}
        </Card>

        {/* Technical Skills & Competencies */}
        <Card variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>VERIFIED SKILLS & COMPETENCIES</Text>
          <View style={styles.skillsRow}>
            {skillsList.map((skill, idx) => (
              <View key={idx} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          {isEditing ? (
            <View style={styles.addSkillBox}>
              <InputField
                label="ADD NEW SKILL"
                placeholder="e.g. Next.js, System Design"
                value={newSkill}
                onChangeText={setNewSkill}
              />
              <Button
                title="ADD SKILL CHIP +"
                onPress={handleAddSkill}
                variant="secondary"
                size="sm"
              />
            </View>
          ) : null}
        </Card>

        {/* Verification & Social Credentials */}
        <Card variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>CREDENTIAL PLACEHOLDERS & LINKS</Text>
          <View style={styles.linkRow}>
            <Text style={styles.linkLabel}>LINKEDIN:</Text>
            <Text style={styles.linkPlaceholder}>[Official LinkedIn Profile Pending Verification]</Text>
          </View>
          <View style={styles.linkRow}>
            <Text style={styles.linkLabel}>GITHUB:</Text>
            <Text style={styles.linkPlaceholder}>[Official GitHub Profile Pending Verification]</Text>
          </View>
          <View style={styles.linkRow}>
            <Text style={styles.linkLabel}>EMERGENCY PHONE:</Text>
            <Text style={styles.linkPlaceholder}>[Verified Institutional Contact Pending]</Text>
          </View>
        </Card>

        {isEditing ? (
          <Button
            title="SAVE PROFILE EDITS"
            onPress={handleSaveProfile}
            variant="gold"
            size="lg"
            style={styles.saveBtn}
          />
        ) : null}
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
    backgroundColor: COLORS.successSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.success,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  feedbackText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '700',
  },
  profileCard: {
    marginBottom: SPACING.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 2,
    borderColor: COLORS.brandElectric,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  avatarInitials: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '800',
  },
  titleCol: {
    flex: 1,
  },
  fullName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md + 2,
    fontWeight: '800',
  },
  emailText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  roleBadgeRow: {
    flexDirection: 'row',
  },
  editToggleBtn: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
    alignItems: 'flex-end',
  },
  editToggleText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionCard: {
    marginBottom: SPACING.lg,
  },
  sectionHeading: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  bioBody: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  skillText: {
    color: COLORS.brandCyanLight,
    fontSize: 11,
    fontWeight: '600',
  },
  addSkillBox: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
  },
  linkRow: {
    marginBottom: SPACING.sm,
  },
  linkLabel: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  linkPlaceholder: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
  },
  saveBtn: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
});
