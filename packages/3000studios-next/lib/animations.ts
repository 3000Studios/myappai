import { Variants } from 'framer-motion';

export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.95 },
};

export const hoverGlow: Variants = {
  initial: { boxShadow: '0 0 0 rgba(212, 175, 55, 0)' },
  hover: {
    boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
    transition: { duration: 0.3 },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

