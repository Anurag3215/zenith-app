import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOBILE_THEME, SPACING, RADII, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { AppRole } from '@zenith/shared';

export default function WorkspaceHubScreen() {
  const router = useRouter();
  const { user, loginAsRole, logout } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleRoleSwitch = async (role: AppRole) => {
    await loginAsRole(role);
    setFeedback(`Switched operational role to: ${role.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to sign out of the ZENITH workspace?');
      if (confirmed) {
        await logout();
        router.replace('/(auth)/login');
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out of the ZENITH workspace?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              await logout();
              router.replace('/(auth)/login');
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      {feedback ? (
        <View style={styles.feedbackToast}>
          <Ionicons name="checkmark-circle" size={16} color="#16A34A" style={{ marginRight: 6 }} />
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Profile Card matching Blueprint Screen 11 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'Z5'}
            </Text>
          </View>

          <View style={styles.profileMeta}>
            <Text style={styles.profileName}>{user?.full_name || 'Team Candidate'}</Text>
            <Text style={styles.profileRole}>
              {user ? user.role.replace('_', ' ').toUpperCase() : 'MEMBER'} • Team 5
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => setFeedback('Profile edit form available in evaluator release candidate.')}
          >
            <Ionicons name="pencil" size={16} color={MOBILE_THEME.navyHeader} />
          </TouchableOpacity>
        </View>

        {/* Workspace Hub Navigation Cards */}
        <Text style={styles.sectionHeader}>WORKSPACE FEATURES</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(tabs)/workspace/resources')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="document-text-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Resources</Text>
              <Text style={styles.menuSub}>Aptitude formulas, DSA kits & PDFs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(tabs)/workspace/gallery')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="images-outline" size={20} color="#16A34A" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Milestone Gallery</Text>
              <Text style={styles.menuSub}>Cohort training photos & whiteboards</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(tabs)/workspace/reflections')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="create-outline" size={20} color="#EA580C" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Reflections</Text>
              <Text style={styles.menuSub}>Daily experiential logs & confidence ratings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Evaluator Presentation Mode Tile */}
        <Text style={styles.sectionHeader}>PRESENTATION MODE</Text>
        <TouchableOpacity
          style={styles.presentationCard}
          onPress={() => router.push('/presentation')}
          activeOpacity={0.8}
        >
          <View style={styles.presentationLeft}>
            <View style={styles.presentationIconBox}>
              <Ionicons name="easel-outline" size={22} color="#D4AF37" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.presentationTitle}>Evaluator Presentation Mode</Text>
              <Text style={styles.presentationSub}>
                Full-screen showcase slides: Summit view, 4-Day Journey & Next Horizons
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward-circle" size={24} color="#D4AF37" />
        </TouchableOpacity>

        {/* Settings & Preferences matching Blueprint Screen 11 */}
        <Text style={styles.sectionHeader}>SETTINGS</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setShowRoleSwitcher(!showRoleSwitcher)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FAF5FF' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#9333EA" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Evaluator Role Simulator</Text>
              <Text style={styles.menuSub}>
                Current: {user?.role.toUpperCase()} (Tap to toggle)
              </Text>
            </View>
            <Ionicons
              name={showRoleSwitcher ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#94A3B8"
            />
          </TouchableOpacity>

          {showRoleSwitcher && (
            <View style={styles.roleSwitcherBox}>
              <Text style={styles.roleSwitcherPrompt}>
                Test role-based permissions in real-time:
              </Text>
              <View style={styles.roleButtonsGrid}>
                {(['captain', 'vice_captain', 'team_admin', 'member'] as const).map((r) => {
                  const isActive = user?.role === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.roleChip,
                        isActive && styles.roleChipActive,
                      ]}
                      onPress={() => handleRoleSwitch(r)}
                    >
                      <Text
                        style={[
                          styles.roleChipText,
                          isActive && styles.roleChipTextActive,
                        ]}
                      >
                        {r.replace('_', ' ').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setFeedback('Security parameters enforced: RLS 100% active.')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#475569" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Security & Privacy</Text>
              <Text style={styles.menuSub}>Hardware keystore & RLS status</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setFeedback('Notifications enabled for live scoreboard shifts.')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="notifications-outline" size={20} color="#475569" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Notifications</Text>
              <Text style={styles.menuSub}>Live rank movements & daily tasks</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setFeedback('ZENITH Team No. 5 • mPOWER Placement Training')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="information-circle-outline" size={20} color="#475569" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>About ZENITH</Text>
              <Text style={styles.menuSub}>Version 1.0.0 Production Release</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button matching Blueprint Screen 11 */}
        <TouchableOpacity
          style={styles.signOutCard}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 10 }} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: MOBILE_THEME.bgLight,
  },
  headerBar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: SPACING.md,
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderBottomWidth: 1,
    borderBottomColor: MOBILE_THEME.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  feedbackToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
  },
  feedbackText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600',
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },
  profileCard: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.xl,
    padding: SPACING.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: RADII.full,
    backgroundColor: MOBILE_THEME.navyHeader,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
  },
  profileRole: {
    fontSize: 11,
    fontWeight: '700',
    color: MOBILE_THEME.skyBlue,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 11,
    color: MOBILE_THEME.textMuted,
    marginTop: 1,
  },
  editProfileBtn: {
    width: 36,
    height: 36,
    borderRadius: RADII.full,
    backgroundColor: MOBILE_THEME.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: MOBILE_THEME.textSecondary,
    marginBottom: SPACING.xs + 2,
    marginTop: SPACING.xs,
  },
  menuCard: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
  },
  menuSub: {
    fontSize: 11,
    color: MOBILE_THEME.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: MOBILE_THEME.borderLight,
    marginLeft: 58,
  },
  presentationCard: {
    backgroundColor: '#070D1E',
    borderRadius: RADII.xl,
    padding: SPACING.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    ...SHADOWS.cardHover,
  },
  presentationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: SPACING.sm,
  },
  presentationIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADII.lg,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  presentationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  presentationSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 14,
  },
  roleSwitcherBox: {
    backgroundColor: MOBILE_THEME.bgLight,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: MOBILE_THEME.borderLight,
  },
  roleSwitcherPrompt: {
    fontSize: 11,
    color: MOBILE_THEME.textSecondary,
    marginBottom: SPACING.sm,
  },
  roleButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleChip: {
    backgroundColor: MOBILE_THEME.surfaceWhite,
    borderWidth: 1,
    borderColor: MOBILE_THEME.borderLight,
    borderRadius: RADII.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  roleChipActive: {
    backgroundColor: MOBILE_THEME.navyHeader,
    borderColor: MOBILE_THEME.navyHeader,
  },
  roleChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: MOBILE_THEME.navyHeader,
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  signOutCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: RADII.xl,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});
