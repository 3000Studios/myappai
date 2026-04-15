/**
 * Motion Orchestrator
 * Unified animation system with performance safeguards
 */

'use client';

export const motionConfig = {
  // Easing curves
  easing: {
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    snap: [0.25, 1, 0.5, 1],
  },

  // Durations (ms)
  duration: {
    fast: 150,
    normal: 300,
    slow: 600,
  },

  // Common spring configs
  spring: {
    gentle: { stiffness: 100, damping: 15 },
    snappy: { stiffness: 300, damping: 25 },
    bouncy: { stiffness: 500, damping: 35 },
  },

  // Scroll triggers
  scroll: {
    fadeIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    slideIn: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
  },
};

export function getMotionSafe() {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function shouldUseGPU() {
  // Check if device supports GPU acceleration
  if (typeof window === 'undefined') return false;

  // Mobile check
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Low-end device check
  const hasLimitedHardware = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

  return !isMobile && !hasLimitedHardware;
}

