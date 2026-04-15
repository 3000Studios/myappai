'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function routeCommand(cmd: string) {
  const router = typeof window !== 'undefined' ? window : null;

  if (!router) return;

  if (cmd.includes('home') || cmd.includes('go home')) {
    window.location.href = '/';
  }
  if (cmd.includes('store') || cmd.includes('shop')) {
    window.location.href = '/store';
  }
  if (cmd.includes('live') || cmd.includes('stream')) {
    window.location.href = '/live';
  }
  if (cmd.includes('admin') || cmd.includes('dashboard')) {
    window.location.href = '/admin';
  }
  if (cmd.includes('portfolio')) {
    window.location.href = '/portfolio';
  }
  if (cmd.includes('contact')) {
    window.location.href = '/contact';
  }
  if (cmd.includes('deploy')) {
    fetch('/api/deploy').catch(console.error);
  }
}

export default function VoiceListener() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log('Voice command:', transcript);
      routeCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event: any) => {
      console.debug('Speech recognition error:', event.error);
    };

    // Auto-start on first user interaction
    const startRecognition = () => {
      recognition.start();
      window.removeEventListener('click', startRecognition);
    };

    window.addEventListener('click', startRecognition, { once: true });

    return () => {
      recognition.stop();
      window.removeEventListener('click', startRecognition);
    };
  }, []);

  return null;
}

