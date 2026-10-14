import { COLORS, SPACING, RADII, TYPOGRAPHY } from '@zenith/shared';

export { COLORS, SPACING, RADII, TYPOGRAPHY };

export const MOBILE_THEME = {
  // Clean Crisp White & Slate Light Theme (Matching Mobile Blueprint)
  bgLight: '#F8FAFC',
  bgSoftBlue: '#F0F7FF',
  surfaceWhite: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceCardHover: '#F1F5F9',

  // Deep Navy Primary Identity
  navyDeep: '#070D1E',
  navyHeader: '#0B1736',
  navyCard: '#0E1E40',
  navyButton: '#0B1736',

  // Brand Golden Star Accents
  brandGold: '#D4AF37',
  brandGoldBright: '#E5A93C',
  brandGoldSoft: 'rgba(212, 175, 55, 0.15)',

  // Sky Blue & Slate Tones
  skyBlue: '#0284C7',
  skyLight: '#38BDF8',
  skySoft: '#E0F2FE',

  // Borders & Dividers
  borderLight: '#E2E8F0',
  borderMedium: '#CBD5E1',
  borderSubtle: 'rgba(15, 23, 42, 0.08)',

  // Typography
  textDark: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textLight: '#F8FAFC',

  // State Indicators
  statusLive: '#10B981',
  statusLiveSoft: 'rgba(16, 185, 129, 0.15)',
  statusLiveRed: '#EF4444',
  danger: '#EF4444',

  // Dark Cyber Scoreboard Screen
  scoreboardBg: '#0B1124',
  scoreboardCard: '#131D38',
  scoreboardBorder: '#1E2D54',
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHover: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardDark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  glowElectric: {
    shadowColor: COLORS.brandElectric,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  glowCyan: {
    shadowColor: COLORS.brandCyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  glowGold: {
    shadowColor: MOBILE_THEME.brandGoldBright,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
};
