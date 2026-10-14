export const COLORS = {
  // Backgrounds - Modern Obsidian & Deep Slate
  backgroundDeep: '#030712',
  backgroundNavy: '#0B1120',
  surfaceCard: '#0F172A',
  surfaceCardHover: '#1E293B',
  surfaceElevated: '#1E293B',

  // Borders & Dividers - Refined & Translucent
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderAccent: 'rgba(56, 189, 248, 0.3)',
  borderHighlight: '#38BDF8',

  // Primary Brand Accents
  brandElectric: '#2563EB',
  brandElectricGlow: '#3B82F6',
  brandElectricSoft: 'rgba(37, 99, 235, 0.15)',

  // Secondary Data Accents
  brandCyan: '#00F0FF',
  brandCyanLight: '#38BDF8',
  brandCyanSoft: 'rgba(6, 182, 212, 0.15)',

  // Gold Competition Accents
  accentGold: '#F59E0B',
  accentGoldBright: '#FBBF24',
  accentGoldSoft: 'rgba(245, 158, 11, 0.15)',

  // Metallic Podium Tones
  podiumGold: '#F59E0B',
  podiumSilver: '#38BDF8',
  podiumBronze: '#D97706',

  // Semantic States
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.15)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.15)',
  error: '#EF4444',
  warning: '#F97316',
  warningSoft: 'rgba(249, 115, 22, 0.15)',
  info: '#38BDF8',

  // Typography
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#030712',
  textGold: '#FDE68A',
  textCyan: '#67E8F9',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const RADII = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 36,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
} as const;
