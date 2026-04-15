'use client';

import { useEffect } from 'react';

export default function UIWatchdog() {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[UI WATCHDOG] DOM changed', mutations.length, 'mutations');
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

