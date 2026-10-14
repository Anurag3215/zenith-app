import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOBILE_THEME } from '../../../src/theme';
import { DEMO_TRAINING_DAYS } from '@zenith/shared';

export default function TrainingJourneyScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  const activeDay =
    DEMO_TRAINING_DAYS.find((d) => d.day_number === selectedDayNumber) ||
    DEMO_TRAINING_DAYS[0];

  const isCompleted = activeDay.status === 'completed';

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header Row */}
      <View style={styles.header}>
        <Text style={styles.title}>Training Journey</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter-outline" size={20} color={MOBILE_THEME.navyHeader} />
        </TouchableOpacity>
      </View>

      {/* Day Selector Tabs (Day 1, Day 2, Day 3, Day 4) */}
      <View style={styles.tabRow}>
        {[1, 2, 3, 4].map((dNum) => {
          const isSelected = selectedDayNumber === dNum;
          return (
            <TouchableOpacity
              key={dNum}
              style={[styles.dayTab, isSelected && styles.dayTabActive]}
              onPress={() => setSelectedDayNumber(dNum)}
            >
              <Text style={[styles.dayTabText, isSelected && styles.dayTabTextActive]}>
                Day {dNum}
              </Text>
              {isSelected ? <View style={styles.activeTabIndicator} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Day Card (Matching Screen 6 Reference) */}
        <View style={styles.dayCard}>
          {/* Card Top Row */}
          <View style={styles.cardTopRow}>
            {/* Blue Day Box */}
            <View style={styles.blueDayBox}>
              <Text style={styles.blueDayNum}>0{activeDay.day_number}</Text>
              <Text style={styles.blueDayLabel}>Day {activeDay.day_number}</Text>
            </View>

            {/* Title & Date */}
            <View style={styles.titleCol}>
              <Text style={styles.dayTitle}>{activeDay.title}</Text>
              <Text style={styles.dayDate}>{activeDay.schedule_date}</Text>
            </View>

            {/* Status Pill Badge */}
            <View style={[styles.statusBadge, isCompleted ? styles.statusBadgeDone : styles.statusBadgePending]}>
              <Text style={[styles.statusBadgeText, isCompleted ? styles.statusTextDone : styles.statusTextPending]}>
                {isCompleted ? 'Completed' : 'Upcoming'}
              </Text>
            </View>
          </View>

          {/* Topics Covered */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Topics Covered</Text>
            {(activeDay.topics_covered || activeDay.focus_areas || []).map((topic, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{topic}</Text>
              </View>
            ))}
          </View>

          {/* Key Learnings */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Key Learnings</Text>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                {activeDay.learning_outcomes?.[0] ||
                  activeDay.description ||
                  'Understanding the program structure, time management, and evaluator expectations.'}
              </Text>
            </View>
          </View>

          {/* Reflections */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Reflections</Text>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>💬</Text>
              <Text style={[styles.bulletText, styles.quoteText]}>
                {isCompleted
                  ? '"Great start to the journey! Excited for what\'s ahead."'
                  : 'Pending faculty delivery and live session execution.'}
              </Text>
            </View>
          </View>

          {/* Photo Thumbnails Row with +3 overlay */}
          <View style={styles.photoRow}>
            <View style={styles.thumbnailBox}>
              <Ionicons name="image-outline" size={24} color="#94A3B8" />
            </View>
            <View style={styles.thumbnailBox}>
              <Ionicons name="people-outline" size={24} color="#94A3B8" />
            </View>
            <View style={[styles.thumbnailBox, styles.overlayBox]}>
              <Text style={styles.overlayText}>+3</Text>
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
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dayTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  dayTabActive: {},
  dayTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  dayTabTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    height: 2,
    width: '80%',
    backgroundColor: '#0284C7',
    borderRadius: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 14,
  },
  blueDayBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueDayNum: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  blueDayLabel: {
    color: '#BAE6FD',
    fontSize: 9,
    fontWeight: '700',
  },
  titleCol: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  dayDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeDone: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextDone: {
    color: '#15803D',
  },
  statusTextPending: {
    color: '#B45309',
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  bulletDot: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '800',
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  quoteText: {
    fontStyle: 'italic',
    color: '#334155',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  thumbnailBox: {
    flex: 1,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  overlayBox: {
    backgroundColor: '#0F172A',
  },
  overlayText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
