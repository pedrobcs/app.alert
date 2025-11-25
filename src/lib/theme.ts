// Premium Theme Configuration - Black + Orange (#E35404)

export const theme = {
  colors: {
    // Primary Colors
    black: '#000000',
    orange: '#E35404',
    
    // Variants
    orangeLight: '#FF6B1A',
    orangeDark: '#C44803',
    orangeGlow: 'rgba(227, 84, 4, 0.5)',
    
    // Grayscale
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    
    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Glass Morphism
  glass: {
    background: 'rgba(0, 0, 0, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
    blur: 'blur(20px)',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    orange: '0 10px 40px rgba(227, 84, 4, 0.3)',
    orangeGlow: '0 0 30px rgba(227, 84, 4, 0.5)',
  },
  
  // Animations
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Border Radius (Apple style)
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
} as const;

export type Theme = typeof theme;
