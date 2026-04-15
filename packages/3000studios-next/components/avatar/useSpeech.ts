'use client';

import { useEffect } from 'react';

export default function useSpeech() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const Recognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!Recognition) return;

    const rec = new Recognition();
    rec.continuous = true;
    rec.lang = 'en-US';

    rec.onresult = (e: any) => {
      const text = e.results[e.results.length - 1][0].transcript;

      const reply = generateReply(text);
      speak(reply);
    };

    rec.start();

    return () => {
      rec.stop();
    };
  }, []);
}

function generateReply(input: string) {
  const seen = localStorage.getItem('visited');
  localStorage.setItem('visited', 'true');

  if (!seen) return "Welcome to 3000 Studios. I've been waiting for you.";
  if (/hello|hi|hey/i.test(input)) return 'Good to see you again.';
  if (/what|how|why|where/i.test(input)) return "That's an interesting question. Tell me more.";
  if (/help|assist/i.test(input)) return "I'm here to help. What can I do for you?";
  return 'I hear you. Please continue.';
}

function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1.05;
  speechSynthesis.speak(utter);
}

