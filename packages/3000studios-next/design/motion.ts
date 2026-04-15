/**
 * 3000 Studios Motion System
 * Authoritative animation system - dopamine-driven micro-interactions
 */

export const motion = {
  // Easing Curves
  easing: {
    // Standard easing
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',

    // Entrance animations
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    enterSharp: 'cubic-bezier(0.4, 0, 1, 1)',

    // Exit animations
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    exitSharp: 'cubic-bezier(0, 0, 0.2, 1)',

    // Elastic & bounce (for playful elements)
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

    // Power curves (for powerful transitions)
    power1: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    power2: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    power3: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  },

  // Duration (milliseconds)
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 700,
    slowest: 1000,
  },

  // Delay (milliseconds)
  delay: {
    none: 0,
    short: 100,
    normal: 200,
    long: 500,
  },

  // Framer Motion Variants (ready-to-use)
  variants: {
    // Fade in/out
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },

    // Slide from bottom
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },

    // Slide from top
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },

    // Slide from left
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },

    // Slide from right
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },

    // Scale in/out
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },

    // Pop (elastic scale)
    pop: {
      initial: { opacity: 0, scale: 0.8 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      },
      exit: { opacity: 0, scale: 0.8 },
    },

    // Glow pulse (for CTAs)
    glowPulse: {
      initial: { boxShadow: '0 0 0px rgba(0, 255, 255, 0)' },
      animate: {
        boxShadow: [
          '0 0 0px rgba(0, 255, 255, 0)',
          '0 0 20px rgba(0, 255, 255, 0.5)',
          '0 0 0px rgba(0, 255, 255, 0)',
        ],
      },
    },

    // Hover lift
    hoverLift: {
      rest: { y: 0, scale: 1 },
      hover: {
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 },
      },
    },

    // Button press
    buttonPress: {
      rest: { scale: 1 },
      tap: { scale: 0.95 },
    },

    // Stagger children
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },

    // Page transition
    pageTransition: {
      initial: { opacity: 0, x: -20 },
      animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      },
      exit: {
        opacity: 0,
        x: 20,
        transition: { duration: 0.2, ease: 'easeIn' },
      },
    },
  },

  // Micro-interaction configs
  microInteractions: {
    buttonHover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    buttonTap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    cardHover: {
      y: -8,
      boxShadow: '0 16px 64px rgba(0, 0, 0, 0.7)',
      transition: { duration: 0.3 },
    },
    iconSpin: {
      rotate: 360,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  },
} as const;

export type Motion = typeof motion;

