'use client';

// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';

import { useEffect } from 'react';

/**
 * EventBus - Central event dispatcher for Shadow PRIME OS
 * Listens for all shadow-event custom events and routes them through the system
 */
export default function EventBus() {
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { type, ...data } = customEvent.detail || {};

      // Log events in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Shadow OS Event] ${type}`, data);
      }

      // Future: Route to kernel for processing
      // This is the central nervous system of Shadow PRIME
    };

    window.addEventListener('shadow-event', handler);
    return () => window.removeEventListener('shadow-event', handler);
  }, []);

  return null;
}

