'use client';

import { useState } from 'react';

export type Emotion = 'happy' | 'neutral' | 'curious';

export default function useEmotion() {
  const [emotion, setEmotion] = useState<Emotion>('neutral');

  function reactTo(text: string) {
    if (/hi|hello|hey/i.test(text)) setEmotion('happy');
    else if (/\?|what|how/i.test(text)) setEmotion('curious');
    else setEmotion('neutral');
  }

  return { emotion, reactTo };
}

