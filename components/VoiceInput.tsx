'use client';

import { useEffect, useRef, useState } from 'react';

export default function VoiceInput() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SR = (window as any).webkitSpeechRecognition;
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join(' ');
        setTranscript(text);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const start = () => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setListening(true);
    recognitionRef.current.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="voice-input">
      <div className="controls">
        <button className="btn" onClick={listening ? stop : start}>
          {listening ? '🛑 Stop' : '🎙️ Start'}
        </button>
      </div>
      <p className="transcript">{transcript}</p>
      <textarea className="text-area" defaultValue={transcript} />
    </div>
  );
}

