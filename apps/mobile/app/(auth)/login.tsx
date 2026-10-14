import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/common/Button';
import { InputField } from '../../src/components/common/InputField';
import { DemoBanner } from '../../src/components/common/DemoBanner';
import { AppRole } from '@zenith/shared';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginAsRole, error, clearError } = useAuth();

  const [email, setEmail] = useState('captain@zenith5.edu');
  const [password, setPassword] = useState('zenith2026');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  const handleQuickRole = async (role: AppRole) => {
    setLoading(true);
    await loginAsRole(role);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <DemoBanner />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Crest & Title */}
        <View style={styles.brandContainer}>
          <View style={styles.crest}>
            <Text style={styles.crestZ}>ZENITH</Text>
            <Text style={styles.crestTeam}>TEAM 05</Text>
          </View>
          <Text style={styles.appName}>ZENITH</Text>
          <Text style={styles.appSub}>mPOWER Placement Training Program</Text>
          <View style={styles.badgeClosed}>
            <Text style={styles.badgeClosedText}>CLOSED MEMBER WORKSPACE</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MEMBER AUTHENTICATION</Text>
          <Text style={styles.cardSubtitle}>
            Enter your authorized institutional credentials to access Team 5 internal operations.
          </Text>

          <InputField
            label="INSTITUTIONAL EMAIL"
            placeholder="member@zenith5.edu"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (error) clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="MEMBER SECURITY KEY / PASSWORD"
            placeholder="••••••••"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (error) clearError();
            }}
            isPassword
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            title="AUTHENTICATE & ENTER"
            onPress={handleSignIn}
            loading={loading}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />

          <Text style={styles.securityNotice}>
            🔒 Protected by PostgreSQL Row Level Security. Public registration is disabled.
          </Text>
        </View>

        {/* Evaluator Quick Role Selection Box */}
        <View style={styles.evaluatorBox}>
          <Text style={styles.evaluatorTitle}>EVALUATOR DEMONSTRATION SWITCHER</Text>
          <Text style={styles.evaluatorSubtitle}>
            Quickly test role-based permissions across Team 5's four operational tiers:
          </Text>

          <View style={styles.rolesGrid}>
            <TouchableOpacity
              style={[styles.roleBtn, styles.roleBtnGold]}
              onPress={() => handleQuickRole('captain')}
              disabled={loading}
            >
              <Text style={styles.roleBtnTitle}>CAPTAIN</Text>
              <Text style={styles.roleBtnDesc}>Score editing & lead permissions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, styles.roleBtnCyan]}
              onPress={() => handleQuickRole('vice_captain')}
              disabled={loading}
            >
              <Text style={styles.roleBtnTitle}>VICE-CAPTAIN</Text>
              <Text style={styles.roleBtnDesc}>Score editing & team co-lead</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, styles.roleBtnElectric]}
              onPress={() => handleQuickRole('team_admin')}
              disabled={loading}
            >
              <Text style={styles.roleBtnTitle}>TEAM ADMIN</Text>
              <Text style={styles.roleBtnDesc}>Governance, audit & controls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, styles.roleBtnSlate]}
              onPress={() => handleQuickRole('member')}
              disabled={loading}
            >
              <Text style={styles.roleBtnTitle}>ORDINARY MEMBER</Text>
              <Text style={styles.roleBtnDesc}>Read-only scores & reflections</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  crest: {
    width: 76,
    height: 76,
    borderRadius: RADII.xl,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 2,
    borderColor: COLORS.brandCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  crestZ: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  crestTeam: {
    color: COLORS.accentGoldBright,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  appSub: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  badgeClosed: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.brandElectric,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
    borderRadius: RADII.full,
    marginTop: SPACING.sm,
  },
  badgeClosedText: {
    color: COLORS.brandElectricGlow,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },
  submitBtn: {
    marginTop: SPACING.sm,
  },
  errorBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorIcon: {
    color: COLORS.danger,
    marginRight: SPACING.sm,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: TYPOGRAPHY.sizes.xs,
    flex: 1,
    lineHeight: 16,
  },
  securityNotice: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 14,
  },
  evaluatorBox: {
    width: '100%',
    backgroundColor: 'rgba(16, 28, 61, 0.6)',
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(30, 51, 104, 0.6)',
    marginBottom: SPACING.xl,
  },
  evaluatorTitle: {
    color: COLORS.accentGoldBright,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  evaluatorSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleBtn: {
    width: '48%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  roleBtnGold: {
    borderColor: COLORS.accentGold,
  },
  roleBtnCyan: {
    borderColor: COLORS.brandCyan,
  },
  roleBtnElectric: {
    borderColor: COLORS.brandElectric,
  },
  roleBtnSlate: {
    borderColor: COLORS.borderSubtle,
  },
  roleBtnTitle: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleBtnDesc: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
});
