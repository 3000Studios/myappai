/**
 * 3000 Studios Brand Colors
 * Authoritative color system - NO inline colors anywhere else
 * Psychology: Authority + Action + Clarity
 */

export const colors = {
  // Primary Brand Colors
  brand: {
    midnight: '#0a0a0f',
    slate: '#1a1a24',
    darkSlate: '#13131b',
    electric: '#00ffff',
    neonGreen: '#00ff88',
    white: '#ffffff',
    offWhite: '#f8f9fa',
  },

  // Semantic Colors
  action: {
    primary: '#00ffff',
    primaryHover: '#00e6e6',
    secondary: '#00ff88',
    secondaryHover: '#00e077',
    danger: '#ff3366',
    dangerHover: '#e62e5c',
    success: '#00ff88',
    warning: '#ffaa00',
  },

  // UI States
  state: {
    success: '#00ff88',
    error: '#ff3366',
    warning: '#ffaa00',
    info: '#00ffff',
    disabled: '#4a4a5a',
  },

  // Text Hierarchy
  text: {
    primary: '#ffffff',
    secondary: '#b0b0c0',
    tertiary: '#808090',
    disabled: '#4a4a5a',
    inverse: '#0a0a0f',
  },

  // Backgrounds
  bg: {
    primary: '#0a0a0f',
    secondary: '#13131b',
    tertiary: '#1a1a24',
    elevated: '#1f1f2e',
    overlay: 'rgba(10, 10, 15, 0.95)',
    glass: 'rgba(26, 26, 36, 0.6)',
  },

  // Borders & Dividers
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    focus: '#00ffff',
    hover: 'rgba(255, 255, 255, 0.2)',
    subtle: 'rgba(255, 255, 255, 0.05)',
  },

  // Gradients
  gradient: {
    primary: 'linear-gradient(135deg, #00ffff 0%, #00ff88 100%)',
    primaryReverse: 'linear-gradient(135deg, #00ff88 0%, #00ffff 100%)',
    dark: 'linear-gradient(180deg, #0a0a0f 0%, #13131b 100%)',
    glow: 'radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%)',
    heroOverlay: 'linear-gradient(180deg, rgba(10, 10, 15, 0) 0%, rgba(10, 10, 15, 0.8) 100%)',
  },

  // Shadows & Effects
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
    md: '0 4px 16px rgba(0, 0, 0, 0.5)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.6)',
    xl: '0 16px 64px rgba(0, 0, 0, 0.7)',
    glow: '0 0 20px rgba(0, 255, 255, 0.5)',
    glowGreen: '0 0 20px rgba(0, 255, 136, 0.5)',
    inner: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
  },

  // Revenue & Money Psychology
  revenue: {
    positive: '#00ff88',
    negative: '#ff3366',
    pending: '#ffaa00',
    premium: '#ffd700',
  },
} as const;

export type Colors = typeof colors;

