'use client';

import { useEffect } from 'react';

export default function Heatmap() {
  useEffect(() => {
    const trackClick = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[HEATMAP]', {
          x: e.clientX,
          y: e.clientY,
          target: (e.target as HTMLElement).tagName,
          timestamp: new Date().toISOString(),
        });
      }
    };

    document.addEventListener('click', trackClick);

    return () => document.removeEventListener('click', trackClick);
  }, []);

  return null;
}

