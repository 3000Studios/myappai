'use client';

// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';
import { useEffect, useState } from 'react';

interface VoiceListenerProps {
  isListening: boolean;
  onToggle: () => void;
  onCommand: (transcript: string) => void;
}

export default function VoiceListener({ isListening, onToggle, onCommand }: VoiceListenerProps) {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);

      // If final result, execute command
      if (event.results[current].isFinal) {
        onCommand(transcriptText);
        setTranscript('');
        onToggle(); // Stop listening after command
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setIsSupported(false);
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, onCommand]);

  if (!isSupported) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-4xl mb-2">🎤</p>
        <p className="text-sm">Voice commands not supported in this browser</p>
        <p className="text-xs mt-1">Try Chrome, Edge, or Safari</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <button
        onClick={onToggle}
        className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50'
            : 'bg-yellow-600 hover:bg-yellow-700 shadow-lg shadow-yellow-500/50'
        }`}
      >
        {isListening ? '🔴' : '🎤'}
      </button>

      <div className="min-h-[60px]">
        {isListening ? (
          <div>
            <p className="text-sm text-gray-400 mb-2">Listening...</p>
            {transcript && (
              <p className="text-lg text-white font-medium px-4 py-2 bg-black/50 rounded-lg inline-block">
                "{transcript}"
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Click microphone to start</p>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Try saying:</p>
        <p className="text-yellow-400">"Deploy my site"</p>
        <p className="text-yellow-400">"Update the hero section"</p>
        <p className="text-yellow-400">"Generate new content"</p>
      </div>
    </div>
  );
}

