'use client';

import { useEffect, useState } from 'react';

interface AvatarEmotionDriverProps {
  api: {
    smile: () => void;
    frown: () => void;
    shock: () => void;
    slump: () => void;
    resetFace: () => void;
  };
}

export default function AvatarEmotionDriver({ api }: AvatarEmotionDriverProps) {
  const [, setEmotion] = useState<string>('neutral');

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!String(e.data).startsWith('emotion:')) return;
      const value = e.data.replace('emotion:', '');
      setEmotion(value);

      // Avatar reactions
      if (value === 'happy') api.smile();
      if (value === 'angry') api.frown();
      if (value === 'surprised') api.shock();
      if (value === 'sad') api.slump();
      if (value === 'neutral') api.resetFace();
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

