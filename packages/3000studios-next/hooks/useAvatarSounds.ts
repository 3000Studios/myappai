/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { useEffect, useState } from 'react';

export function useAvatarSounds() {
  const [soundMap, setSoundMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const manifest: string[] = await fetch('/sfx/avatar/manifest.json').then((r) => r.json());
        const map: Record<string, string> = {};
        manifest.forEach((file: string) => {
          const key = file.replace(/\.(wav|mp3)$/i, '').toLowerCase();
          map[key] = `/sfx/avatar/${file}`;
        });
        setSoundMap(map);
      } catch (e: unknown) {
        console.warn('No avatar sound manifest found.');
        setSoundMap({});
      }
    }
    load();
  }, []);

  return soundMap;
}

