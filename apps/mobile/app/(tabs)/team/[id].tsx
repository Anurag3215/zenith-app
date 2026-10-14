import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOBILE_THEME } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { DEMO_PROFILES, filterPermittedProfileUpdates } from '@zenith/shared';

export default function MemberProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const member = DEMO_PROFILES.find((p) => p.id === id) || DEMO_PROFILES[0];
  const isSelf = user?.id === member.id;

  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(
    member.bio || 'A short introduction about the team member, their background and goals.'
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const roleDisplay =
    member.role === 'team_admin'
      ? 'Team Admin'
      : member.role === 'captain'
      ? 'Captain'
      : member.role === 'vice_captain'
      ? 'Vice-Captain'
      : 'Team Member';

  const defaultInterests = ['Technology', 'Learning', 'Innovation', 'Cloud Architecture'];

  const handleSave = () => {
    const { strippedFields } = filterPermittedProfileUpdates(
      user?.role || 'member',
      user?.id || '',
      member.id,
      { bio: bioText }
    );

    setIsEditing(false);
    if (strippedFields.length > 0) {
      setFeedback('Restricted fields were protected by RBAC.');
    } else {
      setFeedback('Profile updated successfully.');
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Bar matching Screen 5 Reference */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to team directory"
        >
          <Ionicons name="arrow-back" size={22} color={MOBILE_THEME.navyHeader} />
          <Text style={styles.topBarName}>{member.full_name}</Text>
        </TouchableOpacity>

        {isSelf ? (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            accessibilityRole="button"
          >
            <Ionicons
              name={isEditing ? 'checkmark' : 'create-outline'}
              size={20}
              color={MOBILE_THEME.navyHeader}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.topSubtitle}>Eight minds. One vision.</Text>

      {feedback ? (
        <View style={styles.feedbackBanner}>
          <Text style={styles.feedbackText}>✓ {feedback}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Avatar Placeholder */}
        <View style={styles.avatarSection}>
          <View style={styles.largeAvatarCircle}>
            <Ionicons name="person" size={54} color="#93C5FD" />
          </View>
          <Text style={styles.displayName}>{member.full_name}</Text>
          <Text style={styles.displayRole}>{roleDisplay}</Text>
        </View>

        {/* Section: Skills */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Skills</Text>
          <View style={styles.pillsRow}>
            {member.skills.map((skill, idx) => (
              <View key={idx} style={styles.pillChip}>
                <Text style={styles.pillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section: Interests */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Interests</Text>
          <View style={styles.pillsRow}>
            {defaultInterests.map((interest, idx) => (
              <View key={idx} style={[styles.pillChip, styles.pillChipSky]}>
                <Text style={styles.pillTextSky}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section: About */}
        <View style={styles.cardBlock}>
          <Text style={styles.cardBlockTitle}>About</Text>
          {isEditing ? (
            <TextInput
              style={styles.bioInput}
              value={bioText}
              onChangeText={setBioText}
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.cardBlockText}>{bioText}</Text>
          )}
        </View>

        {/* Section: Role in ZENITH */}
        <View style={styles.cardBlock}>
          <Text style={styles.cardBlockTitle}>Role in ZENITH</Text>
          <Text style={styles.cardBlockText}>
            {member.role === 'captain'
              ? 'Lead coordinator responsible for daily scoreboard updates, agile sprints, and strategic peer coaching.'
              : member.role === 'vice_captain'
              ? 'Operations co-lead responsible for curriculum pacing, peer mentorship, and authorized score adjustments.'
              : member.role === 'team_admin'
              ? 'Institutional administrator overseeing governance, credentials verification, and security allowlists.'
              : 'Active squad member contributing to competitive algorithmic aptitude, technical problem solving, and team reflections.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: MOBILE_THEME.bgLight,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBarName: {
    fontSize: 18,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  topSubtitle: {
    fontSize: 12,
    color: '#64748B',
    paddingHorizontal: 20,
    marginTop: 2,
    marginBottom: 8,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    padding: 8,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  feedbackText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  largeAvatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  displayName: {
    fontSize: 19,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  displayRole: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  pillChipSky: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  pillTextSky: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  cardBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  cardBlockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
    marginBottom: 6,
  },
  cardBlockText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  bioInput: {
    fontSize: 13,
    color: '#0F172A',
    borderColor: '#0284C7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#F8FAFC',
  },
});
