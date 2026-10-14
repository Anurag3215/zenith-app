import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { Header } from '../../../src/components/common/Header';
import { DemoBanner } from '../../../src/components/common/DemoBanner';
import { Badge } from '../../../src/components/common/Badge';
import { Card } from '../../../src/components/common/Card';
import { Button } from '../../../src/components/common/Button';

export default function WorkspaceHubScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'team_admin';

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/signed-out');
  };

  return (
    <View style={styles.screen}>
      <Header title="WORKSPACE" subtitle="Operations & Tools" />
      <DemoBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Snapshot Card */}
        <Card variant="highlighted" style={styles.userCard}>
          <View style={styles.userTop}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitials}>
                {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'Z5'}
              </Text>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{user?.full_name || 'Candidate'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.badgeRow}>
                <Badge
                  label={user ? user.role.replace('_', ' ') : 'MEMBER'}
                  variant="role"
                  role={user?.role}
                />
              </View>
            </View>
          </View>
        </Card>

        {/* Feature Hub List */}
        <Text style={styles.sectionTitle}>WORKSPACE TOOLS & REPOSITORIES</Text>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => router.push('/(tabs)/workspace/reflections')}
          accessibilityRole="button"
          accessibilityLabel="Daily Reflections"
        >
          <View style={[styles.navIconBox, styles.iconCyan]}>
            <Text style={styles.navIcon}>✍</Text>
          </View>
          <View style={styles.navTextCol}>
            <Text style={styles.navTitle}>Daily Reflections</Text>
            <Text style={styles.navSub}>Log takeaways, challenges, and mood scores</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => router.push('/(tabs)/workspace/resources')}
          accessibilityRole="button"
          accessibilityLabel="Study Resources and Documents"
        >
          <View style={[styles.navIconBox, styles.iconElectric]}>
            <Text style={styles.navIcon}>📄</Text>
          </View>
          <View style={styles.navTextCol}>
            <Text style={styles.navTitle}>Training Resources</Text>
            <Text style={styles.navSub}>Aptitude cheat sheets, DSA patterns & resumes</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => router.push('/(tabs)/workspace/gallery')}
          accessibilityRole="button"
          accessibilityLabel="Training Media Gallery"
        >
          <View style={[styles.navIconBox, styles.iconGold]}>
            <Text style={styles.navIcon}>📷</Text>
          </View>
          <View style={styles.navTextCol}>
            <Text style={styles.navTitle}>Media Gallery</Text>
            <Text style={styles.navSub}>Training sessions, milestones & whiteboard sessions</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => router.push('/(tabs)/workspace/settings')}
          accessibilityRole="button"
          accessibilityLabel="Account and Application Settings"
        >
          <View style={[styles.navIconBox, styles.iconSlate]}>
            <Text style={styles.navIcon}>⚙</Text>
          </View>
          <View style={styles.navTextCol}>
            <Text style={styles.navTitle}>Account & Settings</Text>
            <Text style={styles.navSub}>Theme preferences, session keys, and cache</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Admin Console Card */}
        {isAdmin ? (
          <TouchableOpacity
            style={[styles.navRow, styles.adminRow]}
            onPress={() => router.push('/(tabs)/workspace/admin')}
            accessibilityRole="button"
            accessibilityLabel="Team Admin Governance Console"
          >
            <View style={[styles.navIconBox, styles.iconAdmin]}>
              <Text style={styles.navIcon}>⚡</Text>
            </View>
            <View style={styles.navTextCol}>
              <Text style={styles.adminTitle}>ADMIN GOVERNANCE CONSOLE</Text>
              <Text style={styles.navSub}>Role provisioning, audit logs & system controls</Text>
            </View>
            <Text style={styles.adminArrow}>→</Text>
          </TouchableOpacity>
        ) : null}

        {/* Sign Out Action */}
        <View style={styles.signOutBox}>
          <Button
            title="LOG OUT OF WORKSPACE"
            onPress={handleSignOut}
            variant="danger"
            size="lg"
            style={styles.signOutBtn}
          />
          <Text style={styles.signOutDisclaimer}>
            Terminates hardware-backed session tokens and locks workspace.
          </Text>
        </View>
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
  userCard: {
    marginBottom: SPACING.xl,
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 54,
    height: 54,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 2,
    borderColor: COLORS.brandCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  userInitials: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
  },
  userEmail: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  adminRow: {
    borderColor: COLORS.brandElectric,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  navIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconCyan: {
    backgroundColor: COLORS.brandCyanSoft,
    borderWidth: 1,
    borderColor: COLORS.brandCyan,
  },
  iconElectric: {
    backgroundColor: COLORS.brandElectricSoft,
    borderWidth: 1,
    borderColor: COLORS.brandElectric,
  },
  iconGold: {
    backgroundColor: COLORS.accentGoldSoft,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
  },
  iconSlate: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  iconAdmin: {
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    borderWidth: 1,
    borderColor: COLORS.brandElectricGlow,
  },
  navIcon: {
    fontSize: 20,
  },
  navTextCol: {
    flex: 1,
  },
  navTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm + 1,
    fontWeight: '700',
  },
  adminTitle: {
    color: COLORS.brandElectricGlow,
    fontSize: TYPOGRAPHY.sizes.sm + 1,
    fontWeight: '800',
  },
  navSub: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
  },
  arrow: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontWeight: '700',
    paddingLeft: SPACING.sm,
  },
  adminArrow: {
    color: COLORS.brandElectricGlow,
    fontSize: 18,
    fontWeight: '700',
    paddingLeft: SPACING.sm,
  },
  signOutBox: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  signOutBtn: {
    width: '100%',
  },
  signOutDisclaimer: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
