import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export const DemoBanner: React.FC = () => {
  const { isLiveBackend } = useAuth();

  return (
    <View
      style={[
        styles.banner,
        isLiveBackend ? styles.liveBanner : styles.demoBanner,
      ]}
      accessibilityRole="alert"
    >
      <View
        style={[
          styles.indicator,
          isLiveBackend ? styles.indicatorLive : styles.indicatorDemo,
        ]}
      />
      <Text
        style={[
          styles.text,
          isLiveBackend ? styles.textLive : styles.textDemo,
        ]}
      >
        {isLiveBackend
          ? 'SUPABASE CLOUD CONNECTED • Live PostgreSQL & Row Level Security Active'
          : 'DEMONSTRATION PREVIEW MODE • Simulated UI placeholders. Connect Supabase credentials in .env to activate live cloud sync.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderBottomWidth: 1,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderBottomColor: 'rgba(245, 158, 11, 0.3)',
  },
  liveBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderBottomColor: 'rgba(16, 185, 129, 0.3)',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.sm,
  },
  indicatorDemo: {
    backgroundColor: COLORS.accentGold,
  },
  indicatorLive: {
    backgroundColor: COLORS.success,
  },
  text: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },
  textDemo: {
    color: COLORS.accentGoldBright,
  },
  textLive: {
    color: COLORS.success,
  },
});
