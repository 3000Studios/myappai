'use client';

import { useEffect } from 'react';

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  zIndex?: number;
}

interface ConfettiEffectProps {
  show: boolean;
}

export default function ConfettiEffect({ show }: ConfettiEffectProps) {
  useEffect(() => {
    if (!show) return;

    // Dynamic import with type assertion to avoid TypeScript module resolution issues
    (async () => {
      try {
        const confettiModule = await import(/* webpackIgnore: true */ 'canvas-confetti' as string);
        const confetti = confettiModule.default as (options?: ConfettiOptions) => Promise<null>;
        await confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.7 },
          zIndex: 99999,
        });
      } catch (error: unknown) {
        console.warn("", error);
      }
    })();
  }, [show]);

  return null;
}

