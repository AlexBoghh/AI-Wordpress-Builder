// Design System Tokens
// Following 8-point spacing system and Perfect Fourth typography scale

export const spacing = {
  0: '0px',
  1: '8px',    // space-1
  2: '16px',   // space-2
  3: '24px',   // space-3
  4: '32px',   // space-4
  5: '40px',   // space-5
  6: '48px',   // space-6
  8: '64px',   // space-8
  10: '80px',  // space-10
  12: '96px',  // space-12
  16: '128px', // space-16
  20: '160px', // space-20
} as const

export const typography = {
  // Perfect Fourth Scale (1.333 ratio)
  xs: {
    size: '0.75rem',    // 12px
    lineHeight: '1rem',
    letterSpacing: '0.025em'
  },
  sm: {
    size: '0.875rem',   // 14px
    lineHeight: '1.25rem',
    letterSpacing: '0.01em'
  },
  base: {
    size: '1rem',       // 16px
    lineHeight: '1.5rem',
    letterSpacing: '0'
  },
  lg: {
    size: '1.125rem',   // 18px
    lineHeight: '1.75rem',
    letterSpacing: '-0.01em'
  },
  xl: {
    size: '1.333rem',   // ~21px
    lineHeight: '2rem',
    letterSpacing: '-0.015em'
  },
  '2xl': {
    size: '1.777rem',   // ~28px
    lineHeight: '2.25rem',
    letterSpacing: '-0.02em'
  },
  '3xl': {
    size: '2.369rem',   // ~38px
    lineHeight: '2.75rem',
    letterSpacing: '-0.025em'
  },
  '4xl': {
    size: '3.157rem',   // ~51px
    lineHeight: '3.5rem',
    letterSpacing: '-0.03em'
  },
  '5xl': {
    size: '4.209rem',   // ~67px
    lineHeight: '4.5rem',
    letterSpacing: '-0.035em'
  },
  '6xl': {
    size: '5.610rem',   // ~90px
    lineHeight: '5.5rem',
    letterSpacing: '-0.04em'
  }
} as const

export const elevation = {
  none: 'none',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
} as const

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  full: '9999px'
} as const

export const animation = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms'
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
} as const

export const zIndex = {
  base: '0',
  dropdown: '10',
  sticky: '20',
  modal: '30',
  popover: '40',
  tooltip: '50',
  notification: '60'
} as const

// Extended design tokens for component consistency
export const components = {
  // Button variants and sizes
  button: {
    sizes: {
      xs: {
        height: '24px',
        padding: '0 8px',
        fontSize: typography.xs.size,
        borderRadius: borderRadius.sm
      },
      sm: {
        height: '32px',
        padding: '0 12px',
        fontSize: typography.sm.size,
        borderRadius: borderRadius.sm
      },
      md: {
        height: '36px',
        padding: '0 16px',
        fontSize: typography.base.size,
        borderRadius: borderRadius.DEFAULT
      },
      lg: {
        height: '44px',
        padding: '0 20px',
        fontSize: typography.lg.size,
        borderRadius: borderRadius.md
      }
    },
    variants: {
      primary: {
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        boxShadow: elevation.sm
      },
      secondary: {
        background: 'hsl(var(--secondary))',
        color: 'hsl(var(--secondary-foreground))',
        border: '1px solid hsl(var(--border))'
      },
      ghost: {
        background: 'transparent',
        color: 'hsl(var(--foreground))',
        hover: {
          background: 'hsl(var(--accent))'
        }
      }
    }
  },
  
  // Card component tokens
  card: {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    boxShadow: elevation.sm
  },

  // Input component tokens
  input: {
    height: '36px',
    padding: '0 12px',
    borderRadius: borderRadius.sm,
    border: '1px solid hsl(var(--border))',
    fontSize: typography.sm.size,
    lineHeight: typography.sm.lineHeight,
    focus: {
      borderColor: 'hsl(var(--primary))',
      boxShadow: '0 0 0 2px hsl(var(--primary) / 0.2)'
    }
  },

  // Navigation tokens
  navigation: {
    height: '60px',
    padding: spacing[4],
    background: 'hsl(var(--background))',
    borderBottom: '1px solid hsl(var(--border))'
  },

  // Sidebar tokens
  sidebar: {
    width: '384px', // w-96
    background: 'hsl(var(--background))',
    borderRight: '1px solid hsl(var(--border))'
  }
} as const

// Semantic color tokens for consistent messaging
export const semanticColors = {
  success: {
    background: 'hsl(142 76% 36%)',
    foreground: 'hsl(0 0% 100%)',
    muted: 'hsl(142 76% 36% / 0.1)',
    border: 'hsl(142 76% 36% / 0.2)'
  },
  warning: {
    background: 'hsl(38 92% 50%)',
    foreground: 'hsl(0 0% 100%)',
    muted: 'hsl(38 92% 50% / 0.1)',
    border: 'hsl(38 92% 50% / 0.2)'
  },
  error: {
    background: 'hsl(0 84% 60%)',
    foreground: 'hsl(0 0% 100%)',
    muted: 'hsl(0 84% 60% / 0.1)',
    border: 'hsl(0 84% 60% / 0.2)'
  },
  info: {
    background: 'hsl(221 83% 53%)',
    foreground: 'hsl(0 0% 100%)',
    muted: 'hsl(221 83% 53% / 0.1)',
    border: 'hsl(221 83% 53% / 0.2)'
  }
} as const

// Layout tokens for consistent spacing and sizing
export const layout = {
  // Common container widths
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Common breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px'
  },

  // Header and navigation heights
  heights: {
    header: '60px',
    breadcrumb: '42px',
    tabBar: '48px',
    statusBar: '32px'
  }
} as const

// Utility function to get design tokens
export function getDesignToken(path: string): string | object {
  const pathArray = path.split('.')
  let current: any = { spacing, typography, elevation, borderRadius, animation, zIndex, components, semanticColors, layout }
  
  for (const key of pathArray) {
    if (current[key] === undefined) {
      throw new Error(`Design token path "${path}" not found`)
    }
    current = current[key]
  }
  
  return current
}

// Icon sizing system for consistent icon usage
export const iconSizes = {
  tiny: {
    size: '12px',     // h-3 w-3
    class: 'h-3 w-3',
    usage: 'Small decorative icons, badges'
  },
  small: {
    size: '14px',     // h-3.5 w-3.5
    class: 'h-3.5 w-3.5',
    usage: 'Secondary UI elements, inline text icons'
  },
  medium: {
    size: '16px',     // h-4 w-4 (DEFAULT)
    class: 'h-4 w-4',
    usage: 'Primary UI icons, buttons, navigation'
  },
  large: {
    size: '20px',     // h-5 w-5
    class: 'h-5 w-5',
    usage: 'Emphasis icons, section headers'
  },
  xlarge: {
    size: '24px',     // h-6 w-6
    class: 'h-6 w-6',
    usage: 'Feature icons, cards'
  },
  hero: {
    size: '32px',     // h-8 w-8
    class: 'h-8 w-8',
    usage: 'Hero sections, large call-to-actions'
  }
} as const

// Helper functions for common token usage
export const tokens = {
  // Get spacing value
  space: (size: keyof typeof spacing) => spacing[size],
  
  // Get typography properties
  text: (size: keyof typeof typography) => typography[size],
  
  // Get elevation shadow
  shadow: (level: keyof typeof elevation) => elevation[level],
  
  // Get border radius
  radius: (size: keyof typeof borderRadius) => borderRadius[size],
  
  // Get animation properties
  animate: (property: keyof typeof animation) => animation[property],
  
  // Get icon size class
  icon: (size: keyof typeof iconSizes) => iconSizes[size].class
} as const