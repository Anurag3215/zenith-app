export const COLORS = {
  // Backgrounds - Cosmic Obsidian & Deep Violet Slate (matching reference image)
  backgroundDeep: '#070318',
  backgroundNavy: '#0D0727',
  surfaceCard: '#140C32',
  surfaceCardHover: '#1E1248',
  surfaceElevated: '#1F134A',

  // Borders & Dividers - Violet Glass Hairlines
  borderSubtle: 'rgba(168, 85, 247, 0.18)',
  borderAccent: 'rgba(168, 85, 247, 0.38)',
  borderHighlight: '#A855F7',

  // Primary Brand Accents - Vibrant Violet & Electric Indigo
  brandElectric: '#8B5CF6',
  brandElectricGlow: '#A855F7',
  brandElectricSoft: 'rgba(139, 92, 246, 0.16)',

  // Secondary Accents - Neon Fuchsia / Pink (matches reference gradient)
  brandCyan: '#EC4899',
  brandCyanLight: '#F472B6',
  brandCyanSoft: 'rgba(236, 72, 153, 0.16)',

  // Gold Competition Accents (Preserved for podium Rank 1 & medals)
  accentGold: '#F59E0B',
  accentGoldBright: '#FBBF24',
  accentGoldSoft: 'rgba(245, 158, 11, 0.15)',

  // Metallic Podium Tones
  podiumGold: '#F59E0B',
  podiumSilver: '#C084FC',
  podiumBronze: '#F472B6',

  // Semantic States
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.15)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.15)',
  error: '#EF4444',
  warning: '#F97316',
  warningSoft: 'rgba(249, 115, 22, 0.15)',
  info: '#A855F7',

  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#A5A6C4',
  textMuted: '#71719A',
  textInverse: '#070318',
  textGold: '#FDE68A',
  textCyan: '#F472B6',
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
