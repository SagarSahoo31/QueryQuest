export const colors = {
  // Dark mode primary theme
  dark: {
    background: '#0B0F19',
    surface: '#151C2C',
    surfaceBorder: '#232D42',
    surfaceHighlight: '#1E293B',

    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    primary: '#6366F1', // Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',

    secondary: '#10B981', // Emerald
    secondaryLight: '#34D399',

    accent: '#F59E0B', // Amber / Streak Fire
    accentLight: '#FBBF24',

    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.12)',
    errorBorder: 'rgba(239, 68, 68, 0.3)',

    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    successBorder: 'rgba(16, 185, 129, 0.3)',

    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.12)',

    editorBg: '#0F172A',
    editorGutter: '#1E293B',
    editorText: '#E2E8F0',
    editorKeyword: '#38BDF8', // Cyan
    editorFunction: '#F472B6', // Pink
    editorString: '#A7F3D0', // Mint
    editorNumber: '#FDE047', // Yellow

    cardBg: '#1E293B',
    badgeBg: '#334155',
  },
};

export type ThemeColors = typeof colors.dark;
