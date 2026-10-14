import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'ZENITH',
  subtitle = 'Team No. 5',
  showBack = false,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) + SPACING.xs }]}>
      <View style={styles.contentRow}>
        <View style={styles.leftCol}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Navigate Back"
            >
              <Text style={styles.backArrow}>←</Text>
              <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.brandRow}>
              <View style={styles.crestContainer}>
                <Text style={styles.crestText}>Z5</Text>
              </View>
              <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.rightCol}>
          {rightAction ? (
            rightAction
          ) : user ? (
            <Badge
              label={user.role.replace('_', ' ')}
              variant="role"
              role={user.role}
            />
          ) : (
            <Badge label="GUEST" variant="custom" color={COLORS.textMuted} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundDeep,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crestContainer: {
    width: 38,
    height: 38,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.brandCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  crestText: {
    color: COLORS.brandCyanLight,
    fontWeight: '800',
    fontSize: TYPOGRAPHY.sizes.sm,
    letterSpacing: 0.5,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.brandCyan,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingRight: SPACING.md,
  },
  backArrow: {
    color: COLORS.brandCyanLight,
    fontSize: 20,
    fontWeight: '700',
    marginRight: SPACING.xs,
  },
  backText: {
    color: COLORS.brandCyanLight,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
