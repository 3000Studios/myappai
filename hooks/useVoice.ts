/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

'use client';

import { useState } from 'react';

export default function useVoice() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  let recognition: any = null;

  if (typeof window !== 'undefined') {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
    }
  }

  function start() {
    if (!recognition) return;
    setTranscript('');
    setListening(true);

    recognition.start();
    recognition.onresult = (event: any) => {
      const result = event.results[event.resultIndex][0].transcript;
      setTranscript(result);
    };
  }

  function stop() {
    if (!recognition) return;
    recognition.stop();
    setListening(false);
  }

  return {
    start,
    stop,
    listening,
    transcript,
  };
}

