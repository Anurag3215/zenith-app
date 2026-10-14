import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ZenithLogo } from '../src/components/common/ZenithLogo';
import { MountainSummitView } from '../src/components/common/MountainSummitView';
import { MOBILE_THEME, SPACING, RADII, SHADOWS } from '../src/theme';
import { DEMO_PROFILES } from '@zenith/shared';

export default function EvaluatorPresentationScreen() {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState<0 | 1 | 2>(0);
  const [memberIndex, setMemberIndex] = useState<number>(0);

  const currentMember = DEMO_PROFILES[memberIndex] || DEMO_PROFILES[0];

  const handleNextMember = () => {
    setMemberIndex((prev) => (prev + 1) % DEMO_PROFILES.length);
  };

  const handlePrevMember = () => {
    setMemberIndex((prev) => (prev - 1 + DEMO_PROFILES.length) % DEMO_PROFILES.length);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Exit Presentation"
        >
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Slide Indicators */}
        <View style={styles.indicatorsRow}>
          {([0, 1, 2] as const).map((idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSlideIndex(idx)}
              style={[
                styles.indicatorDot,
                slideIndex === idx && styles.indicatorDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.slidePill}>
          <Text style={styles.slidePillText}>
            {slideIndex === 0
              ? '1/3 JOURNEY'
              : slideIndex === 1
              ? '2/3 TEAM'
              : '3/3 SUMMIT'}
          </Text>
        </View>
      </View>

      {/* Slide 1: Journey & Growth (Blueprint Screen 12) */}
      {slideIndex === 0 && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.slideHeader}>
            <View style={{ marginBottom: 6 }}>
              <ZenithLogo size={36} color="#E5A93C" />
            </View>
            <Text style={styles.mainTitle}>Our Journey. Our Growth.</Text>
            <Text style={styles.subtitle}>
              mPOWER Placement Training Program • ZENITH Team No. 5
            </Text>
          </View>

          {/* Metric Highlights */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>04</Text>
              <Text style={styles.metricLabel}>CURRICULUM DAYS</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>08</Text>
              <Text style={styles.metricLabel}>CORE CANDIDATES</Text>
            </View>
            <View style={[styles.metricCard, styles.metricCardHighlight]}>
              <Text style={[styles.metricNumber, { color: '#E5A93C' }]}>14,080</Text>
              <Text style={styles.metricLabel}>LIVE POINTS (RANK 1)</Text>
            </View>
          </View>

          {/* 4-Day Timeline */}
          <View style={styles.timelineList}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineIconBox, { backgroundColor: '#10B981' }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineTopRow}>
                  <Text style={styles.timelineDay}>DAY 1 • COMPLETED</Text>
                  <Text style={styles.timelineScore}>3,520 PTS</Text>
                </View>
                <Text style={styles.timelineTitle}>Ideation, Aptitude & Architecture</Text>
                <Text style={styles.timelineDesc}>
                  Quantitative shortcuts, speed mathematics, and production system blueprinting.
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineIconBox, { backgroundColor: '#38BDF8' }]}>
                <Text style={styles.timelineIconText}>02</Text>
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineTopRow}>
                  <Text style={styles.timelineDay}>DAY 2 • IN PROGRESS</Text>
                  <Text style={styles.timelineScore}>3,520 PTS</Text>
                </View>
                <Text style={styles.timelineTitle}>Technical Sprints & DSA Algorithms</Text>
                <Text style={styles.timelineDesc}>
                  Sliding window, dynamic programming paradigms, and algorithmic problem drills.
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineIconBox, { backgroundColor: '#64748B' }]}>
                <Text style={styles.timelineIconText}>03</Text>
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineTopRow}>
                  <Text style={styles.timelineDay}>DAY 3 • UPCOMING</Text>
                  <Text style={styles.timelineScore}>3,520 PTS</Text>
                </View>
                <Text style={styles.timelineTitle}>System Design & Mock Tech Rounds</Text>
                <Text style={styles.timelineDesc}>
                  Database sharding, cache invalidation, and full-stack technical panels.
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineIconBox, { backgroundColor: '#64748B' }]}>
                <Text style={styles.timelineIconText}>04</Text>
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineTopRow}>
                  <Text style={styles.timelineDay}>DAY 4 • UPCOMING</Text>
                  <Text style={styles.timelineScore}>3,520 PTS</Text>
                </View>
                <Text style={styles.timelineTitle}>HR Behavioral & Final Evaluation</Text>
                <Text style={styles.timelineDesc}>
                  STAR behavioral interviews, presentation showcase, and cohort summit.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Next Slide Button */}
          <TouchableOpacity
            style={styles.nextSlideBtn}
            onPress={() => setSlideIndex(1)}
            activeOpacity={0.8}
          >
            <Text style={styles.nextSlideText}>Meet Team ZENITH (2/3)</Text>
            <Ionicons name="arrow-forward" size={18} color="#070D1E" />
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Slide 2: Team Profiles Carousel (Blueprint Screen 13) */}
      {slideIndex === 1 && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.slideHeader}>
            <Text style={styles.mainTitle}>Eight Minds. One Vision.</Text>
            <Text style={styles.subtitle}>
              Candidate Profiles • Member {memberIndex + 1} of {DEMO_PROFILES.length}
            </Text>
          </View>

          {/* Member Card Carousel */}
          <View style={styles.carouselContainer}>
            <View style={styles.memberLargeCard}>
              <View style={styles.memberAvatarBorder}>
                <View style={styles.memberAvatarLarge}>
                  <Text style={styles.memberInitialsLarge}>
                    {currentMember.full_name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.memberNameLarge}>{currentMember.full_name}</Text>
              <View style={styles.memberRolePill}>
                <Ionicons name="sparkles" size={12} color="#E5A93C" style={{ marginRight: 4 }} />
                <Text style={styles.memberRoleText}>
                  {currentMember.role.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.memberEmailText}>{currentMember.email}</Text>

              {/* Skills Tags */}
              <View style={styles.skillsTagRow}>
                {currentMember.skills.map((skill: string, sIdx: number) => (
                  <View key={sIdx} style={styles.skillPill}>
                    <Text style={styles.skillPillText}>{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Bio & Contribution Card */}
              <View style={styles.bioBox}>
                <Text style={styles.bioPre}>ABOUT & CONTRIBUTIONS</Text>
                <Text style={styles.bioText}>
                  {currentMember.bio || 'Core engineering and placement cohort preparation lead.'}
                </Text>
              </View>
            </View>

            {/* Carousel Navigation Buttons */}
            <View style={styles.carouselControls}>
              <TouchableOpacity
                style={styles.carouselArrowBtn}
                onPress={handlePrevMember}
                accessibilityRole="button"
                accessibilityLabel="Previous Member"
              >
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.carouselCounter}>
                {memberIndex + 1} / {DEMO_PROFILES.length}
              </Text>

              <TouchableOpacity
                style={styles.carouselArrowBtn}
                onPress={handleNextMember}
                accessibilityRole="button"
                accessibilityLabel="Next Member"
              >
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Next Slide Button */}
          <TouchableOpacity
            style={styles.nextSlideBtn}
            onPress={() => setSlideIndex(2)}
            activeOpacity={0.8}
          >
            <Text style={styles.nextSlideText}>Our Next Summit (3/3)</Text>
            <Ionicons name="arrow-forward" size={18} color="#070D1E" />
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Slide 3: Our Next Summit (Blueprint Screen 14) */}
      {slideIndex === 2 && (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.slideHeader}>
            <View style={{ marginBottom: 6 }}>
              <ZenithLogo size={36} color="#E5A93C" />
            </View>
            <Text style={styles.mainTitle}>Our Next Summit</Text>
            <Text style={styles.subtitle}>
              Beyond mPOWER: Architectural Commitments & Milestones
            </Text>
          </View>

          {/* 2x2 Grid matching Screen 14 */}
          <View style={styles.summitGrid}>
            <View style={styles.summitTile}>
              <View style={[styles.summitIconBox, { backgroundColor: 'rgba(229, 169, 60, 0.15)' }]}>
                <Ionicons name="rocket-outline" size={24} color="#E5A93C" />
              </View>
              <Text style={styles.summitTileTitle}>Production Release</Text>
              <Text style={styles.summitTileDesc}>
                44/44 verified tests, zero mock leakage in official scoreboards, and hardware keystore persistence.
              </Text>
            </View>

            <View style={styles.summitTile}>
              <View style={[styles.summitIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Ionicons name="trophy-outline" size={24} color="#38BDF8" />
              </View>
              <Text style={styles.summitTileTitle}>Live Scoreboard</Text>
              <Text style={styles.summitTileDesc}>
                Realtime Supabase audit history, immutable score edit events, and deterministic tie policies.
              </Text>
            </View>

            <View style={styles.summitTile}>
              <View style={[styles.summitIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.summitTileTitle}>Scalable Security</Text>
              <Text style={styles.summitTileDesc}>
                PostgreSQL RLS on 100% tables, signed S3 asset URLs, and role-gated Captain authorization.
              </Text>
            </View>

            <View style={styles.summitTile}>
              <View style={[styles.summitIconBox, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Ionicons name="compass-outline" size={24} color="#C084FC" />
              </View>
              <Text style={styles.summitTileTitle}>Technical Roadmap</Text>
              <Text style={styles.summitTileDesc}>
                AI mock interview analysis, multi-cohort placement scaling, and offline replication sync.
              </Text>
            </View>
          </View>

          {/* Mountain Silhouette with Tagline */}
          <View style={{ marginTop: SPACING.md, marginBottom: SPACING.lg }}>
            <MountainSummitView />
          </View>

          {/* Return to Workspace Action */}
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={20} color="#070D1E" style={{ marginRight: 8 }} />
            <Text style={styles.finishBtnText}>Return to Mobile Workspace</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#070D1E',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: SPACING.sm,
    backgroundColor: '#0B152E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.15)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: RADII.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 4,
  },
  indicatorDotActive: {
    width: 24,
    backgroundColor: '#E5A93C',
  },
  slidePill: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    borderRadius: RADII.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  slidePillText: {
    color: '#E5A93C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },
  slideHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#0E1E40',
    borderRadius: RADII.lg,
    padding: SPACING.sm + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    marginRight: 6,
  },
  metricCardHighlight: {
    borderColor: 'rgba(229, 169, 60, 0.4)',
    marginRight: 0,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 2,
    textAlign: 'center',
  },
  timelineList: {
    marginBottom: SPACING.xl,
  },
  timelineItem: {
    flexDirection: 'row',
    backgroundColor: '#0E1E40',
    borderRadius: RADII.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    marginBottom: SPACING.sm + 2,
  },
  timelineIconBox: {
    width: 32,
    height: 32,
    borderRadius: RADII.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  timelineIconText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  timelineDay: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timelineScore: {
    color: '#E5A93C',
    fontSize: 11,
    fontWeight: '800',
  },
  timelineTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  timelineDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
  },
  nextSlideBtn: {
    backgroundColor: '#E5A93C',
    borderRadius: RADII.xl,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glowGold,
  },
  nextSlideText: {
    color: '#070D1E',
    fontSize: 14,
    fontWeight: '800',
    marginRight: 8,
  },
  carouselContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  memberLargeCard: {
    width: '100%',
    backgroundColor: '#0E1E40',
    borderRadius: RADII['2xl'],
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    ...SHADOWS.cardDark,
  },
  memberAvatarBorder: {
    width: 84,
    height: 84,
    borderRadius: RADII.full,
    borderWidth: 2,
    borderColor: '#E5A93C',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  memberAvatarLarge: {
    width: '100%',
    height: '100%',
    borderRadius: RADII.full,
    backgroundColor: '#070D1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitialsLarge: {
    color: '#E5A93C',
    fontSize: 26,
    fontWeight: '900',
  },
  memberNameLarge: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  memberRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderRadius: RADII.full,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
  },
  memberRoleText: {
    color: '#E5A93C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  memberEmailText: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: SPACING.md,
  },
  skillsTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  skillPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: RADII.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    margin: 3,
  },
  skillPillText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '600',
  },
  bioBox: {
    width: '100%',
    backgroundColor: '#070D1E',
    borderRadius: RADII.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    marginBottom: SPACING.sm,
  },
  bioPre: {
    color: '#E5A93C',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  bioText: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  carouselControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  carouselArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: RADII.full,
    backgroundColor: '#0E1E40',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselCounter: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginHorizontal: SPACING.xl,
  },
  summitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  summitTile: {
    width: '48%',
    backgroundColor: '#0E1E40',
    borderRadius: RADII.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    marginBottom: SPACING.md,
  },
  summitIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  summitTileTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  summitTileDesc: {
    color: '#94A3B8',
    fontSize: 10,
    lineHeight: 15,
  },
  finishBtn: {
    backgroundColor: '#E5A93C',
    borderRadius: RADII.xl,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glowGold,
  },
  finishBtnText: {
    color: '#070D1E',
    fontSize: 14,
    fontWeight: '800',
  },
});
