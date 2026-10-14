import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import { DEMO_DATA_BANNER } from '@zenith/shared';

export const DemoBanner: React.FC = () => {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <View style={styles.indicator} />
      <Text style={styles.text}>{DEMO_DATA_BANNER}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.3)',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentGold,
    marginRight: SPACING.sm,
  },
  text: {
    color: COLORS.accentGoldBright,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },
});
