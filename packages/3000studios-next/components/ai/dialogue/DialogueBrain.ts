'use client';

import { useEffect, useState } from 'react';

interface DialogueBrainProps {
  onDialogue: (line: string) => void;
}

export default function DialogueBrain({ onDialogue }: DialogueBrainProps) {
  const [emotion, setEmotion] = useState('neutral');
  const [lastLine, setLastLine] = useState('');

  const EMO_TONES = {
    happy: 'energetic, charismatic, uplifting, playful',
    angry: 'intense, gritty, aggressive, dominant',
    sad: 'soft, slow, reflective, warm',
    surprised: 'sharp, excited, shocked, high-pitch',
    neutral: 'calm, composed, smooth, balanced',
  };

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!String(e.data).startsWith('emotion:')) return;
      const mood = e.data.replace('emotion:', '');
      setEmotion(mood);
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  async function generateLine(context = '') {
    const tone = EMO_TONES[emotion as keyof typeof EMO_TONES];

    const prompt = `
You are the AI speaking avatar for 3000Studios.
Your job: generate ONE SHORT LINE of dialogue.
Your tone is: ${tone}.
Emotion is: ${emotion}.
Context: ${context}.
Avoid repeating lines. Avoid sounding robotic. Be expressive.

Example moods:
- happy: “Let’s light this place up!”
- angry: “Don’t test me today.”
- sad: “We’ll push through… together.”
- surprised: “Whoa—hold up, what just happened?”
- neutral: “Steady as we go.”

Now produce the next line:
    `;

    try {
      const res = await fetch('/api/shadow/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const line = data?.text ?? '…';

      if (line !== lastLine) {
        setLastLine(line);
        onDialogue(line);
      }
    } catch (err: unknown) {
      console.error("", err);
    }
  }

  return { generateLine };
}

