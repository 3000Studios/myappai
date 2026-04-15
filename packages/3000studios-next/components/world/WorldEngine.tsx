'use client';

/**
 * World Engine Component
 * Controls global UI mood and atmosphere
 */

'use client';

import { useShadowOS } from '@/lib/shadow/os/state';
import { useEffect } from 'react';

export default function WorldEngine() {
  const { emotion, intensity, uiMood } = useShadowOS();

  useEffect(() => {
    const root = document.documentElement;

    // Map emotions to colors
    const emotionColors: Record<string, string> = {
      neutral: '#1a1a2e',
      excited: '#ffd700',
      aggressive: '#ff0055',
      happy: '#00d4ff',
      curious: '#9b5de5',
    };

    const moodOverlays: Record<string, string> = {
      neutral: 'rgba(0, 0, 0, 0.3)',
      gold: 'rgba(255, 215, 0, 0.1)',
      blue: 'rgba(0, 170, 255, 0.1)',
      'purple-alert': 'rgba(155, 93, 229, 0.2)',
      teal: 'rgba(0, 255, 238, 0.1)',
      'cyber-cyan': 'rgba(0, 250, 255, 0.15)',
    };

    // Apply emotion color
    const color = emotionColors[emotion] || emotionColors.neutral;
    root.style.setProperty('--emotion-color', color);
    root.style.setProperty('--emotion-intensity', intensity.toString());

    // Apply mood overlay
    const overlay = moodOverlays[uiMood] || moodOverlays.neutral;
    root.style.setProperty('--mood-overlay', overlay);
  }, [emotion, intensity, uiMood]);

  return null;
}

