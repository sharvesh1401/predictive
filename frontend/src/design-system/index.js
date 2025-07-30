/**
 * Design System for EV Routing Simulation Tool
 * 
 * This file defines the design tokens, colors, spacing, typography,
 * and other design constants used throughout the application.
 * 
 * @author EV Routing Team
 * @version 1.0.0
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    50: '#f3e8ff',
    100: '#e9d5ff',
    200: '#d8b4fe',
    300: '#c084fc',
    400: '#a855f7',
    500: '#9333ea',
    600: '#7c3aed',
    700: '#6b21a8',
    800: '#581c87',
    900: '#3b0764',
    950: '#2d1b69',
  },

  // Secondary Colors (Electric Blue)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Accent Colors (Electric Green)
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Neutral Colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Dark Mode Colors
  dark: {
    bg: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      card: '#1e293b',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      muted: '#64748b',
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
      accent: '#7c3aed',
    },
  },

  // Light Mode Colors
  light: {
    bg: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.1)',
    },
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      tertiary: '#64748b',
      muted: '#94a3b8',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      accent: '#7c3aed',
    },
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
    mono: [
      'JetBrains Mono',
      'Fira Code',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem',     // 128px
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem',    // 384px
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },

  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  properties: {
    all: 'all',
    colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
    opacity: 'opacity',
    shadow: 'box-shadow',
    transform: 'transform',
  },
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },

  // Slide animations
  slideInUp: {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },

  // Scale animations
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.9)', opacity: 0 },
  },

  // Bounce animations
  bounce: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.05)' },
  },

  // Pulse animations
  pulse: {
    from: { opacity: 1 },
    to: { opacity: 0.5 },
  },

  // Spin animations
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
};

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const componentVariants = {
  button: {
    size: {
      sm: {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm,
        borderRadius: borderRadius.md,
      },
      md: {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
        borderRadius: borderRadius.lg,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[6]}`,
        fontSize: typography.fontSize.lg,
        borderRadius: borderRadius.xl,
      },
    },
    variant: {
      primary: {
        backgroundColor: colors.primary[600],
        color: colors.light.text.primary,
        border: `1px solid ${colors.primary[600]}`,
        '&:hover': {
          backgroundColor: colors.primary[700],
          borderColor: colors.primary[700],
        },
        '&:focus': {
          boxShadow: `0 0 0 3px ${colors.primary[200]}`,
        },
      },
      secondary: {
        backgroundColor: colors.secondary[600],
        color: colors.light.text.primary,
        border: `1px solid ${colors.secondary[600]}`,
        '&:hover': {
          backgroundColor: colors.secondary[700],
          borderColor: colors.secondary[700],
        },
        '&:focus': {
          boxShadow: `0 0 0 3px ${colors.secondary[200]}`,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.primary[600],
        border: `1px solid ${colors.primary[600]}`,
        '&:hover': {
          backgroundColor: colors.primary[50],
        },
        '&:focus': {
          boxShadow: `0 0 0 3px ${colors.primary[200]}`,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.primary[600],
        border: '1px solid transparent',
        '&:hover': {
          backgroundColor: colors.primary[50],
        },
        '&:focus': {
          boxShadow: `0 0 0 3px ${colors.primary[200]}`,
        },
      },
    },
  },

  card: {
    variant: {
      default: {
        backgroundColor: colors.light.bg.card,
        border: `1px solid ${colors.light.border.primary}`,
        boxShadow: shadows.base,
      },
      elevated: {
        backgroundColor: colors.light.bg.card,
        border: 'none',
        boxShadow: shadows.lg,
      },
      outline: {
        backgroundColor: 'transparent',
        border: `1px solid ${colors.light.border.primary}`,
        boxShadow: 'none',
      },
    },
  },

  input: {
    size: {
      sm: {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm,
        borderRadius: borderRadius.md,
      },
      md: {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
        borderRadius: borderRadius.lg,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[5]}`,
        fontSize: typography.fontSize.lg,
        borderRadius: borderRadius.xl,
      },
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a CSS custom property string
 * @param {string} name - The custom property name
 * @param {string} value - The custom property value
 * @returns {string} CSS custom property string
 */
export const createCSSVariable = (name, value) => `--${name}: ${value};`;

/**
 * Generates a CSS class name with BEM methodology
 * @param {string} block - The block name
 * @param {string} element - The element name (optional)
 * @param {string} modifier - The modifier name (optional)
 * @returns {string} BEM class name
 */
export const bem = (block, element = '', modifier = '') => {
  let className = block;
  if (element) className += `__${element}`;
  if (modifier) className += `--${modifier}`;
  return className;
};

/**
 * Merges multiple class names with conditional logic
 * @param {...any} classes - Class names to merge
 * @returns {string} Merged class names
 */
export const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([, condition]) => condition)
          .map(([className]) => className)
          .join(' ');
      }
      return cls;
    })
    .join(' ');
};

/**
 * Generates responsive styles
 * @param {Object} styles - Styles for different breakpoints
 * @returns {Object} Responsive styles object
 */
export const responsive = (styles) => {
  return Object.entries(styles).reduce((acc, [breakpoint, style]) => {
    if (breakpoint === 'base') {
      acc.base = style;
    } else {
      acc[breakpoint] = `@media (min-width: ${breakpoints[breakpoint]}) { ${style} }`;
    }
    return acc;
  }, {});
};

// ============================================================================
// EXPORT ALL DESIGN TOKENS
// ============================================================================

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  animations,
  componentVariants,
  createCSSVariable,
  bem,
  cn,
  responsive,
}; 