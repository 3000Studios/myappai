'use client';

import { useEffect } from 'react';

const LIGHT_PROFILES: Record<string, { color: string; intensity: number }> = {
  happy: { color: '#ffd27f', intensity: 1.3 },
  angry: { color: '#ff3b3b', intensity: 1.6 },
  sad: { color: '#6ab0ff', intensity: 0.7 },
  surprised: { color: '#ffffff', intensity: 1.8 },
  neutral: { color: '#bfbfbf', intensity: 1.0 },
};

export function MoodLighting({ emotion, scene }: { emotion: string; scene: string }) {
  useEffect(() => {
    const profile = LIGHT_PROFILES[emotion] ?? LIGHT_PROFILES.neutral;
    const msg = JSON.stringify({
      type: 'lighting',
      color: profile.color,
      intensity: profile.intensity,
      scene,
    });
    window.postMessage(msg, '*');
  }, [emotion, scene]);

  return null;
}

