// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";
import { useState, useEffect } from "react";

interface ShadowVoiceInputProps {
  onTranscript: (text: string) => void;
}

export default function ShadowVoiceInput({
  onTranscript,
}: ShadowVoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);

      if (event.results[current].isFinal) {
        onTranscript(transcriptText);
        setTranscript("");
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening, onTranscript]);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setIsListening(!isListening)}
        className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all ${
          isListening
            ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/50"
            : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/50"
        }`}
      >
        {isListening ? "🔴" : "🎤"}
      </button>
      {transcript && (
        <div className="px-4 py-2 bg-black/50 rounded-lg text-white text-sm">
          "{transcript}"
        </div>
      )}
    </div>
  );
}

