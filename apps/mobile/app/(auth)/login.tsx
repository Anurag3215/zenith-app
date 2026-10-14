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
import { MOBILE_THEME, SPACING, RADII } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { InputField } from '../../src/components/common/InputField';
import { ZenithLogo } from '../../src/components/common/ZenithLogo';
import { MountainSummitView } from '../../src/components/common/MountainSummitView';
import { AppRole } from '@zenith/shared';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginAsRole, error, clearError } = useAuth();

  const [email, setEmail] = useState('captain@zenith5.edu');
  const [password, setPassword] = useState('zenith2026');
  const [loading, setLoading] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

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
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 16) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Official ZENITH Brand Crest */}
        <View style={styles.brandContainer}>
          <ZenithLogo size={72} textColor={MOBILE_THEME.navyHeader} showSubtitle={false} />
        </View>

        {/* Heading & Subtitle */}
        <View style={styles.headingBox}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your team workspace</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formCard}>
          <InputField
            placeholder="Email / Username"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (error) clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            variant="light"
          />

          <InputField
            placeholder="Password"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (error) clearError();
            }}
            isPassword
            leftIcon="lock-closed-outline"
            variant="light"
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.signInBtn, loading && styles.btnDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign In"
          >
            <Text style={styles.signInBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => alert('Please contact Team Admin or use Evaluator Quick Switcher to sign in.')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Evaluator Quick Role Switcher (Collapsible for Demo Testing) */}
        <View style={styles.evaluatorContainer}>
          <TouchableOpacity
            style={styles.evaluatorToggle}
            onPress={() => setShowRoleSwitcher(!showRoleSwitcher)}
          >
            <Text style={styles.evaluatorToggleText}>
              {showRoleSwitcher ? '▾ Hide Evaluator Demo Switcher' : '▸ Evaluator Role Switcher (1-Tap Demo)'}
            </Text>
          </TouchableOpacity>

          {showRoleSwitcher ? (
            <View style={styles.rolesRow}>
              <TouchableOpacity
                style={[styles.roleChip, styles.chipGold]}
                onPress={() => handleQuickRole('captain')}
              >
                <Text style={styles.chipTextGold}>Captain</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleChip, styles.chipBlue]}
                onPress={() => handleQuickRole('vice_captain')}
              >
                <Text style={styles.chipTextBlue}>Vice-Capt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleChip, styles.chipSlate]}
                onPress={() => handleQuickRole('team_admin')}
              >
                <Text style={styles.chipTextSlate}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleChip, styles.chipSlate]}
                onPress={() => handleQuickRole('member')}
              >
                <Text style={styles.chipTextSlate}>Member</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Bottom Mountain Summit View & Placement Program Footer */}
        <View style={styles.mountainBox}>
          <MountainSummitView
            variant="light"
            height={130}
            tagline="mPOWER Placement Training Program"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  headingBox: {
    alignItems: 'center',
    marginVertical: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: MOBILE_THEME.navyHeader,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: MOBILE_THEME.textSecondary,
    marginTop: 4,
  },
  formCard: {
    width: '100%',
    marginVertical: 10,
  },
  signInBtn: {
    backgroundColor: MOBILE_THEME.navyButton,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: MOBILE_THEME.navyButton,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 12,
    color: MOBILE_THEME.textSecondary,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: MOBILE_THEME.danger,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  evaluatorContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  evaluatorToggle: {
    paddingVertical: 6,
  },
  evaluatorToggleText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipGold: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  chipTextGold: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '700',
  },
  chipBlue: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  chipTextBlue: {
    color: '#0369A1',
    fontSize: 11,
    fontWeight: '700',
  },
  chipSlate: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  chipTextSlate: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  mountainBox: {
    width: '100%',
    marginTop: 16,
  },
});
