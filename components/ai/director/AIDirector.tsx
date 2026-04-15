'use client';

import { useCallback, useEffect, useState } from 'react';
import AvatarSpeech from '../dialogue/AvatarSpeech';
import DialogueBrain from '../dialogue/DialogueBrain';

interface AvatarMouth {
  startTalking: () => void;
  stopTalking: () => void;
}

interface Avatar {
  mouth: AvatarMouth;
}

interface AIDirectorProps {
  avatar?: Avatar | null;
}

export default function AIDirector({ avatar }: AIDirectorProps) {
  const [line, setLine] = useState('');

  const brain = DialogueBrain({
    onDialogue: (l: string) => setLine(l),
  });

  const generateLine = useCallback(
    (context: string) => {
      brain.generateLine(context);
    },
    [brain]
  );

  useEffect(() => {
    // Auto speaks whenever emotion changes
    const emotionHandler = (e: MessageEvent) => {
      if (String(e.data).startsWith('emotion:')) {
        generateLine('emotion shift');
      }
    };

    // Auto speaks whenever the crowd reacts
    const crowdHandler = (e: MessageEvent) => {
      if (String(e.data).startsWith('crowd:')) {
        generateLine('crowd reaction');
      }
    };

    window.addEventListener('message', emotionHandler);
    window.addEventListener('message', crowdHandler);

    // Interval dialogue so avatar never shuts up
    const interval = setInterval(() => {
      generateLine('interval fill');
    }, 9000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', emotionHandler);
      window.removeEventListener('message', crowdHandler);
    };
  }, [generateLine]);

  return <AvatarSpeech text={line} avatar={avatar} />;
}

