import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MountainSummitViewProps {
  variant?: 'twilight' | 'light';
  height?: number;
  tagline?: string;
}

export const MountainSummitView: React.FC<MountainSummitViewProps> = ({
  variant = 'twilight',
  height = 200,
  tagline = 'Your Journey. Our Summit.',
}) => {
  const isTwilight = variant === 'twilight';

  return (
    <View style={[styles.container, { height }]}>
      {/* Twilight Sky / Sunset Glow */}
      <View
        style={[
          styles.skyGlow,
          isTwilight ? styles.skyTwilight : styles.skyLight,
        ]}
      />

      {/* Mountain Silhouettes (Layer 1: Back range) */}
      <View style={styles.mountainLayerBack}>
        <View style={[styles.peakBackLeft, isTwilight ? styles.peakDarkBack : styles.peakLightBack]} />
        <View style={[styles.peakBackRight, isTwilight ? styles.peakDarkBack : styles.peakLightBack]} />
      </View>

      {/* Mountain Silhouettes (Layer 2: Forefront sharp peaks with golden ridges) */}
      <View style={styles.mountainLayerFront}>
        <View style={[styles.peakMain, isTwilight ? styles.peakTwilightMain : styles.peakLightMain]}>
          <View style={styles.snowRidge} />
        </View>
        <View style={[styles.peakLeft, isTwilight ? styles.peakTwilightSide : styles.peakLightSide]} />
        <View style={[styles.peakRight, isTwilight ? styles.peakTwilightSide : styles.peakLightSide]} />
      </View>

      {/* Tagline footer */}
      {tagline ? (
        <View style={styles.taglineBox}>
          <Text style={[styles.taglineText, isTwilight ? styles.textWhite : styles.textNavy]}>
            {tagline}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  skyGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  skyTwilight: {
    backgroundColor: '#070D1E',
  },
  skyLight: {
    backgroundColor: 'rgba(224, 242, 254, 0.4)',
  },
  mountainLayerBack: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '65%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  peakBackLeft: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 140,
    borderRightWidth: 140,
    borderBottomWidth: 150,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    left: -40,
    bottom: 0,
  },
  peakBackRight: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 160,
    borderRightWidth: 160,
    borderBottomWidth: 170,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    right: -50,
    bottom: 0,
  },
  peakDarkBack: {
    borderBottomColor: '#101D3F',
  },
  peakLightBack: {
    borderBottomColor: '#CBD5E1',
  },
  mountainLayerFront: {
    width: '100%',
    height: '60%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  peakMain: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 120,
    borderRightWidth: 120,
    borderBottomWidth: 140,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    zIndex: 3,
  },
  peakTwilightMain: {
    borderBottomColor: '#0E172E',
  },
  peakLightMain: {
    borderBottomColor: '#94A3B8',
  },
  snowRidge: {
    position: 'absolute',
    top: 20,
    left: -15,
    width: 30,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ rotate: '25deg' }],
  },
  peakLeft: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 90,
    borderRightWidth: 90,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    left: 10,
    bottom: 0,
    zIndex: 2,
  },
  peakRight: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderBottomWidth: 110,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    right: 15,
    bottom: 0,
    zIndex: 2,
  },
  peakTwilightSide: {
    borderBottomColor: '#0A1224',
  },
  peakLightSide: {
    borderBottomColor: '#BAC7D5',
  },
  taglineBox: {
    position: 'absolute',
    bottom: 12,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taglineText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  textWhite: {
    color: '#F8FAFC',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  textNavy: {
    color: '#0F1D4A',
  },
});
