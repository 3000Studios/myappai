/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { useEffect, useState } from "react";

export function useAvatarSounds() {
  const [soundMap, setSoundMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadFiles() {
      try {
        const res = await fetch("/sfx/avatar/manifest.json");
        if (!res.ok) throw new Error("no manifest");
        const manifest: string[] = await res.json();
        const map: Record<string, string> = {};
        manifest.forEach((file: string) => {
          const key = file.replace(/\.wav$/i, "").toLowerCase();
          map[key] = `/sfx/avatar/${file}`;
        });
        if (isMounted) setSoundMap(map);
      } catch (e: unknown) {
        if (isMounted) setSoundMap({});
      }
    }
    loadFiles();
    return () => {
      isMounted = false;
    };
  }, []);

  return soundMap;
}

