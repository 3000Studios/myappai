'use client';

// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';

import { useEffect, useState } from 'react';

type MoodType =
  | 'cyber-calm'
  | 'teal-focus'
  | 'sapphire-hype'
  | 'gold-conversion-mode'
  | 'purple-alert'
  | 'red-defense'
  | 'neon-creativity';

/**
 * MoodMap - Tracks and manages the emotional state of the world
 * Responds to system events and updates the global mood/atmosphere
 */
export default function MoodMap() {
  const [currentMood, setCurrentMood] = useState<MoodType>('cyber-calm');

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { type, value } = customEvent.detail || {};

      if (type === 'ui-mood' && value) {
        setCurrentMood(value as MoodType);

        // Apply mood to document root
        document.documentElement.setAttribute('data-mood', value);
      }
    };

    window.addEventListener('shadow-event', handler);
    return () => window.removeEventListener('shadow-event', handler);
  }, []);

  return null;
}

