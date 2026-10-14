import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOBILE_THEME } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { useRealtimeScoreboard } from '../../../src/hooks/useRealtimeScoreboard';
import { ScoreAdjustmentModal } from '../../../src/components/scoreboard/ScoreAdjustmentModal';
import { RankedScoreboardGroup } from '@zenith/shared';
import { dataService } from '../../../src/services/dataService';

export default function ScoreboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const {
    groups,
    syncState,
    lastUpdated,
    searchQuery,
    setSearchQuery,
    isRefreshing,
    refresh,
  } = useRealtimeScoreboard();

  const [selectedGroup, setSelectedGroup] = useState<RankedScoreboardGroup | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canEditScores = user?.role === 'captain' || user?.role === 'vice_captain';

  const handleOpenEdit = (group: RankedScoreboardGroup) => {
    if (!canEditScores) return;
    setSelectedGroup(group);
    setModalVisible(true);
  };

  const handleSaveScore = async (
    groupId: string,
    delta: number,
    reason: string,
    category: string,
    expectedCurrentPoints: number
  ) => {
    try {
      await dataService.adjustScore(groupId, delta, reason, category);
      await refresh();
      setToastMessage(`✓ Updated ${delta > 0 ? `+${delta}` : delta} pts for ${selectedGroup?.group_name}`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setToastMessage(`⚠ ${err?.message || 'Failed to update score'}`);
      setTimeout(() => setToastMessage(null), 4000);
      throw err;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return { bg: '#E5A93C', text: '#000000', icon: '🥇' };
      case 2:
        return { bg: '#8B5CF6', text: '#FFFFFF', icon: '🥈' };
      case 3:
        return { bg: '#06B6D4', text: '#FFFFFF', icon: '🥉' };
      case 4:
        return { bg: '#0284C7', text: '#FFFFFF', icon: '' };
      case 5:
        return { bg: '#F59E0B', text: '#FFFFFF', icon: '' };
      default:
        return { bg: '#10B981', text: '#FFFFFF', icon: '' };
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header: mPOWER Scoreboard + • LIVE badge (Matching Screen 7 Reference) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>mPOWER Scoreboard</Text>
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Search Bar Input */}
      <View style={styles.searchBarBox}>
        <Ionicons name="search" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search group..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => router.push('/(tabs)/scoreboard/audit')}>
          <Ionicons name="options-outline" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {toastMessage ? (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#38BDF8"
          />
        }
      >
        {/* Ranked Group Cards (Screen 7 Reference) */}
        <View style={styles.cardsList}>
          {groups.map((group) => {
            const isZenith = group.group_number === 5 || group.is_current_team;
            const badge = getRankBadgeColor(group.rank);

            return (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.card,
                  isZenith && styles.cardZenithHighlight,
                ]}
                onPress={() => handleOpenEdit(group)}
                activeOpacity={canEditScores ? 0.7 : 1}
              >
                {/* Left Colored Rank Badge */}
                <View style={[styles.rankBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.rankBadgeText, { color: badge.text }]}>
                    {group.rank < 10 ? `0${group.rank}` : group.rank}
                  </Text>
                  {badge.icon ? <Text style={styles.medalText}>{badge.icon}</Text> : null}
                </View>

                {/* Group Details */}
                <View style={styles.groupInfo}>
                  <Text style={[styles.groupName, isZenith && styles.zenithName]}>
                    {group.group_name} {isZenith ? '(T-05)' : `(T-0${group.group_number})`}
                  </Text>
                  <Text style={styles.pointsText}>
                    {group.current_points} <Text style={styles.ptsUnit}>PTS</Text>
                  </Text>
                </View>

                {/* Right Arrow / Trend Indicator */}
                <View style={styles.trendBox}>
                  {group.rank <= 3 ? (
                    <Ionicons name="arrow-up" size={18} color="#10B981" />
                  ) : group.rank === 4 ? (
                    <Ionicons name="arrow-down" size={18} color="#EF4444" />
                  ) : (
                    <Text style={styles.neutralDash}>—</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer Timestamp */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            Last updated: {lastUpdated ? lastUpdated.toLocaleDateString() : 'Apr 14, 2025'} - {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:41 AM'}
          </Text>
          <TouchableOpacity onPress={refresh}>
            <Ionicons name="refresh-outline" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Captain Score Adjustment Modal */}
      {selectedGroup ? (
        <ScoreAdjustmentModal
          visible={modalVisible}
          group={selectedGroup}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveScore}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1124', // Deep dark scoreboard background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#131D38',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2D54',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
  },
  toastBox: {
    backgroundColor: '#064E3B',
    padding: 8,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
  },
  toastText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardsList: {
    gap: 10,
  },
  card: {
    backgroundColor: '#131D38',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2D54',
  },
  cardZenithHighlight: {
    borderColor: '#0284C7',
    borderWidth: 1.5,
    backgroundColor: '#10224D',
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rankBadgeText: {
    fontSize: 14,
    fontWeight: '900',
  },
  medalText: {
    fontSize: 10,
    marginTop: -2,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  zenithName: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  pointsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  ptsUnit: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  trendBox: {
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neutralDash: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  footerText: {
    color: '#64748B',
    fontSize: 11,
  },
});
