import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Profile } from '@zenith/shared';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../../theme';
import { Badge } from '../common/Badge';

interface MemberCardProps {
  member: Profile;
  onPress: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Member: ${member.full_name}, Role: ${member.role}`}
    >
      <View style={styles.topRow}>
        {/* Monogram Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(member.full_name)}</Text>
        </View>

        {/* Name and Role */}
        <View style={styles.nameBlock}>
          <Text style={styles.fullName}>{member.full_name}</Text>
          <Text style={styles.emailText}>{member.email}</Text>
          <View style={styles.badgeRow}>
            <Badge
              label={member.role.replace('_', ' ')}
              variant="role"
              role={member.role}
            />
          </View>
        </View>

        <Text style={styles.chevron}>→</Text>
      </View>

      {/* Skills Chips */}
      {member.skills && member.skills.length > 0 ? (
        <View style={styles.skillsRow}>
          {member.skills.map((skill, index) => (
            <View key={index} style={styles.skillPill}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Placeholder Disclaimer */}
      <View style={styles.footerRow}>
        <Text style={styles.placeholderNotice}>
          [Official Profile Details Pending Institutional Verification]
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1.5,
    borderColor: COLORS.brandElectric,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: TYPOGRAPHY.sizes.md,
  },
  nameBlock: {
    flex: 1,
  },
  fullName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
  },
  emailText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    color: COLORS.brandCyanLight,
    fontSize: 18,
    fontWeight: '700',
    paddingLeft: SPACING.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 51, 104, 0.4)',
  },
  skillPill: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  skillText: {
    color: COLORS.brandCyanLight,
    fontSize: 10,
    fontWeight: '600',
  },
  footerRow: {
    marginTop: SPACING.xs + 2,
  },
  placeholderNotice: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontStyle: 'italic',
  },
});
