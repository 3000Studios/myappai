/**
 * 3000 Studios Brand System
 * Master export - import this for complete design system access
 */

import { colors } from './colors';
import { layout } from './layout';
import { motion } from './motion';
import { typography } from './typography';

export const brand = {
  colors,
  typography,
  motion,
  layout,

  // Brand Identity
  identity: {
    name: '3000 Studios',
    tagline: 'Command Your Digital Empire',
    mission: 'Elite digital solutions powered by voice, built for authority',
  },

  // Brand Personality
  personality: {
    primary: 'authoritative',
    secondary: 'futuristic',
    tone: ['confident', 'powerful', 'precise', 'elite'],
  },

  // Visual Language
  visual: {
    style: 'dark futuristic cyberpunk elite',
    mood: 'powerful commanding exclusive',
    effects: ['glow', 'depth', 'motion', 'precision'],
  },

  // Conversion Psychology
  conversion: {
    colorHierarchy: [
      'electric cyan for primary CTAs',
      'neon green for success/money states',
      'midnight black for authority',
      'white for clarity',
    ],
    motionPrinciples: [
      'micro-animations on every interaction',
      'smooth transitions = premium feel',
      'hover states trigger dopamine',
      'fast feedback = trust',
    ],
    layoutRules: [
      'clear visual hierarchy',
      'generous whitespace = luxury',
      'CTAs always visible',
      'progressive disclosure',
    ],
  },
} as const;

export { colors, layout, motion, typography };
export type Brand = typeof brand;

