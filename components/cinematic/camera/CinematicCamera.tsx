'use client';

import { useEffect } from 'react';

export function CinematicCamera({ scene, beat }: { scene: string; beat: string }) {
  useEffect(() => {
    const message = JSON.stringify({
      type: 'camera',
      action: 'update',
      scene,
      beat,
    });
    window.postMessage(message, '*');
  }, [scene, beat]);

  return null;
}

