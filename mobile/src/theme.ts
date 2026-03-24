export const theme = {
  colors: {
    background: '#09090B', // Almost black
    surface: '#18181B', // Dark gray
    primaryText: '#FAFAFA',
    secondaryText: '#A1A1AA',
    accent: '#3B82F6', // Subtle blue
    accentPurple: '#8B5CF6',
    border: '#27272A',
    error: '#EF4444',
    success: '#22C55E',
  },
  typography: {
    fontFamily: 'System',
    sizes: {
      xs: 13,
      sm: 14,
      md: 15,
      lg: 17,
      xl: 24,
      xxl: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  }
};
