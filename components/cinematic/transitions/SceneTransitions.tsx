'use client';

import { useEffect } from 'react';

export function SceneTransitions({ beat }: { beat: string }) {
  useEffect(() => {
    const msg = JSON.stringify({
      type: 'transition',
      beat,
    });
    window.postMessage(msg, '*');
  }, [beat]);

  return null;
}

