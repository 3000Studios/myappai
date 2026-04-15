'use client';

import { useEffect, useRef } from 'react';

// SpeechRecognition is a Web API available in browsers but not typed by default in TS
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

const useVoiceToCommand = (onCommand: (command: string) => void) => {
  const onCommandHandler = useRef(onCommand);

  useEffect(() => {
    onCommandHandler.current = onCommand;

    if (typeof window === 'undefined') return;

    // Get SpeechRecognition API (with vendor prefix support)
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: ISpeechRecognitionConstructor })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: ISpeechRecognitionConstructor })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim();
          console.log('Voice command:', transcript);
          onCommandHandler.current(transcript);
        }
      }
    };

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
    };

    console.log('Starting voice recognition...');
    recognition.start();

    return () => {
      console.log('Stopping voice recognition...');
      recognition.stop();
    };
  }, [onCommand]);
};

export default useVoiceToCommand;

