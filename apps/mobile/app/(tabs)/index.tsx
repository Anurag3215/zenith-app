import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOBILE_THEME, SPACING, RADII, SHADOWS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { DEMO_SCOREBOARD_GROUPS, DEMO_TRAINING_DAYS } from '@zenith/shared';

export default function MemberDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const zenithTeam =
    DEMO_SCOREBOARD_GROUPS.find((g) => g.group_number === 5 || g.is_current_team) ||
    DEMO_SCOREBOARD_GROUPS[1];

  const completedDays = DEMO_TRAINING_DAYS.filter((d) => d.status === 'completed').length;
  const totalDays = DEMO_TRAINING_DAYS.length;

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Card: LIVE mPOWER SCOREBOARD (Screen 3 Reference) */}
        <View style={styles.scoreboardBanner}>
          <View style={styles.bannerTopRow}>
            <Text style={styles.bannerTitle}>LIVE mPOWER SCOREBOARD</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.scoreboardContent}>
            {/* Left: Squad Crest */}
            <View style={styles.squadCol}>
              <View style={styles.logoBadgeContainer}>
                <Image
                  source={require('../../assets/zenith-logo.jpg')}
                  style={styles.logoImageSmall}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.squadName}>ZENITH</Text>
              <Text style={styles.squadTeam}>Team No. 5</Text>
            </View>

            {/* Middle: Rank */}
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Rank</Text>
              <Text style={styles.metricValue}>#{zenithTeam.rank}</Text>
            </View>

            {/* Right: Current Score */}
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Current Score</Text>
              <Text style={styles.metricValue}>{zenithTeam.current_points} <Text style={styles.ptsUnit}>pts</Text></Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.scoreboardLinkRow}
            onPress={() => router.push('/(tabs)/scoreboard')}
            accessibilityRole="button"
          >
            <Text style={styles.scoreboardLinkText}>View full scoreboard</Text>
            <Ionicons name="arrow-forward" size={14} color="#38BDF8" />
          </TouchableOpacity>
        </View>

        {/* Section: Team Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Team Progress</Text>
            <Text style={styles.progressCounter}>{completedDays}/{totalDays}</Text>
          </View>
          <Text style={styles.progressSub}>Training Days Completed</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(completedDays / totalDays) * 100}%` },
              ]}
            />
          </View>

          {/* 3 Metric Stat Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statBigNumber}>8</Text>
              <Text style={styles.statBoxLabel}>Team Members</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBigNumber}>12</Text>
              <Text style={styles.statBoxLabel}>Resources</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBigNumber}>5</Text>
              <Text style={styles.statBoxLabel}>Reflections</Text>
            </View>
          </View>
        </View>

        {/* Section: Quick Actions (2x2 Grid) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {/* 1. View Team */}
            <TouchableOpacity
              style={styles.actionTile}
              onPress={() => router.push('/(tabs)/team')}
              accessibilityRole="button"
            >
              <View style={styles.actionIconBox}>
                <Ionicons name="people-outline" size={20} color="#0284C7" />
              </View>
              <Text style={styles.actionTileText}>View Team</Text>
            </TouchableOpacity>

            {/* 2. Training Journey */}
            <TouchableOpacity
              style={styles.actionTile}
              onPress={() => router.push('/(tabs)/journey')}
              accessibilityRole="button"
            >
              <View style={styles.actionIconBox}>
                <Ionicons name="calendar-outline" size={20} color="#0284C7" />
              </View>
              <Text style={styles.actionTileText}>Training Journey</Text>
            </TouchableOpacity>

            {/* 3. Live Scoreboard */}
            <TouchableOpacity
              style={styles.actionTile}
              onPress={() => router.push('/(tabs)/scoreboard')}
              accessibilityRole="button"
            >
              <View style={styles.actionIconBox}>
                <Ionicons name="trophy-outline" size={20} color="#0284C7" />
              </View>
              <Text style={styles.actionTileText}>Live Scoreboard</Text>
            </TouchableOpacity>

            {/* 4. Resources */}
            <TouchableOpacity
              style={styles.actionTile}
              onPress={() => router.push('/(tabs)/workspace/resources')}
              accessibilityRole="button"
            >
              <View style={styles.actionIconBox}>
                <Ionicons name="folder-open-outline" size={20} color="#0284C7" />
              </View>
              <Text style={styles.actionTileText}>Resources</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Recent Updates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          <View style={styles.recentUpdateCard}>
            <View style={styles.recentAvatar}>
              <Ionicons name="person" size={16} color="#0284C7" />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>
                {user?.full_name || 'You'} updated operational profile
              </Text>
              <Text style={styles.recentTime}>Verified Audit Log • 2 hours ago</Text>
            </View>
          </View>
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
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  scoreboardBanner: {
    backgroundColor: MOBILE_THEME.navyCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#070D1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bannerTitle: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  scoreboardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  squadCol: {
    alignItems: 'flex-start',
  },
  logoBadgeContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5A93C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  logoImageSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  squadName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  squadTeam: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  metricCol: {
    alignItems: 'center',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 2,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  ptsUnit: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
  },
  scoreboardLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  scoreboardLinkText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
    marginBottom: 4,
  },
  progressCounter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  progressSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statBigNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  actionTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTileText: {
    fontSize: 13,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
    flex: 1,
  },
  recentUpdateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  recentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
  },
  recentTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
