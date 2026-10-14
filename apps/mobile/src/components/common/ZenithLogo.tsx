import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const LOGO_IMAGE = require('../../../assets/zenith-logo.jpg');

interface ZenithLogoProps {
  size?: number;
  textColor?: string;
  showSubtitle?: boolean;
  align?: 'center' | 'left';
  tagline?: string;
  color?: string;
}

export const ZenithLogo: React.FC<ZenithLogoProps> = ({
  size = 64,
  textColor = '#0B1736',
  showSubtitle = true,
  align = 'center',
  tagline,
}) => {
  const isDarkBackground = textColor === '#FFFFFF';

  return (
    <View style={[styles.container, align === 'center' ? styles.center : styles.left]}>
      {/* Official ZENITH Logo Image Badge */}
      <View
        style={[
          styles.imageBadge,
          { width: size, height: size },
          isDarkBackground && styles.imageBadgeDark,
        ]}
      >
        <Image
          source={LOGO_IMAGE}
          style={[
            styles.image,
            { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 },
          ]}
          resizeMode="cover"
        />
      </View>

      <Text
        style={[
          styles.teamText,
          { color: isDarkBackground ? '#E5A93C' : '#D4AF37' },
        ]}
      >
        Team No. 5
      </Text>

      {showSubtitle ? (
        <Text
          style={[
            styles.subText,
            { color: isDarkBackground ? '#94A3B8' : '#64748B' },
          ]}
        >
          mPOWER Placement Training Program
        </Text>
      ) : null}

      {tagline ? (
        <Text
          style={[
            styles.taglineText,
            { color: isDarkBackground ? '#E2E8F0' : '#475569' },
          ]}
        >
          {tagline}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  center: {
    alignItems: 'center',
    textAlign: 'center',
  },
  left: {
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  imageBadge: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#070D1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  imageBadgeDark: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5A93C',
    shadowColor: '#E5A93C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    backgroundColor: '#FFFFFF',
  },
  teamText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  subText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  taglineText: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
