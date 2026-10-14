import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOBILE_THEME } from '../../../src/theme';
import { DEMO_PROFILES } from '@zenith/shared';

export default function TeamDirectoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredMembers = DEMO_PROFILES.filter((m) => {
    const q = query.toLowerCase();
    return (
      m.full_name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Header Row: "Our Team" + search icon */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Our Team</Text>
          <Text style={styles.subtitle}>Eight minds. One vision.</Text>
        </View>

        <TouchableOpacity
          style={styles.searchIconBtn}
          onPress={() => setSearchOpen(!searchOpen)}
          accessibilityRole="button"
          accessibilityLabel="Search team members"
        >
          <Ionicons
            name={searchOpen ? 'close-outline' : 'search-outline'}
            size={22}
            color={MOBILE_THEME.navyHeader}
          />
        </TouchableOpacity>
      </View>

      {/* Optional Search Bar Input */}
      {searchOpen ? (
        <View style={styles.searchBarBox}>
          <Ionicons name="search" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, role or skill..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 2-Column Grid of 8 Authorized Members (Matching Screen 4 Reference) */}
        <View style={styles.grid}>
          {filteredMembers.map((member, idx) => {
            const roleDisplay =
              member.role === 'team_admin'
                ? 'Team Admin'
                : member.role === 'captain'
                ? 'Captain'
                : member.role === 'vice_captain'
                ? 'Vice-Captain'
                : 'Team Member';

            return (
              <TouchableOpacity
                key={member.id}
                style={styles.card}
                onPress={() => router.push(`/(tabs)/team/${member.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`View ${member.full_name}`}
              >
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={28} color="#93C5FD" />
                </View>
                <Text style={styles.memberName} numberOfLines={1}>
                  {member.full_name || `Member ${idx + 1}`}
                </Text>
                <Text style={styles.memberRole} numberOfLines={1}>
                  {roleDisplay}
                </Text>
              </TouchableOpacity>
            );
          })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: MOBILE_THEME.textSecondary,
    marginTop: 2,
  },
  searchIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
});
