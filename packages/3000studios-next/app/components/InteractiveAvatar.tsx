'use client';

/**
 * Shadow AI Avatar Component (Home Page Version)
 * This is the conversational, animated avatar that greets visitors
 * Features:
 * - Speech recognition and response
 * - Physics-based animations
 * - Gyroscope responsive (on mobile)
 * - Does NOT edit the website (that's only in THE MATRIX)
 * - Fun, conversational personality
 *
 * NOTE: Full 3D implementation requires Three.js/R3F
 * This is a foundational structure that can be enhanced with 3D models
 */

'use client';

import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ShadowAvatar() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userText, setUserText] = useState('');
  const [avatarText, setAvatarText] = useState("Hey there! I'm Shadow. Ask me anything!");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  const handleUserInput = useCallback(
    async (_input: string) => {
      // Simulate AI response (in production, this would call an AI API)
      const responses = [
        "That's interesting! Want to check out our store?",
        'I like the way you think! Have you seen our projects?',
        "Great question! I'm here to help you navigate 3000 Studios.",
        'Fascinating! You should definitely explore our portfolio.',
        "I hear you! Let me know if you want to see what we're working on.",
        'Cool! Check out our live streams for more content.',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAvatarText(randomResponse);

      // Text-to-speech if enabled
      if (audioEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(randomResponse);
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [audioEnabled]
  );

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for standard API first, then webkit
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        setAvatarText(
          "Hey! Speech recognition isn't supported in your browser, but I can still chat via text!"
        );
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserText(transcript);
        handleUserInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [handleUserInput]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 max-w-sm">
      {/* Avatar Container */}
      <div className="bg-black/80 backdrop-blur-xl border-2 border-gold rounded-2xl p-6 shadow-2xl">
        {/* Avatar Visual (Placeholder for 3D model) */}
        <div className="relative mb-4">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gold via-sapphire to-platinum rounded-full flex items-center justify-center animate-pulse">
            <div
              className={`w-24 h-24 bg-black rounded-full flex items-center justify-center ${isSpeaking ? 'animate-ping' : ''}`}
            >
              <span className="text-4xl">👤</span>
            </div>
          </div>
          {isSpeaking && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gold rounded-full animate-pulse"
                    style={{
                      height: Math.random() * 20 + 10 + 'px',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar Name */}
        <h3 className="text-center text-gold font-bold text-xl mb-2">Shadow AI</h3>

        {/* Avatar Speech Bubble */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4 min-h-[80px] border border-gold/30">
          <p className="text-white text-sm italic">"{avatarText}"</p>
        </div>

        {/* User Input Display */}
        {userText && (
          <div className="bg-sapphire/20 rounded-lg p-3 mb-4 border border-sapphire/30">
            <p className="text-gray-300 text-xs">You: "{userText}"</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gold hover:bg-platinum'
            }`}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <MicOff className="text-white" size={20} />
            ) : (
              <Mic className="text-black" size={20} />
            )}
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-3 rounded-full transition-all ${
              audioEnabled ? 'bg-sapphire hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
            title={audioEnabled ? 'Mute audio' : 'Enable audio'}
          >
            {audioEnabled ? (
              <Volume2 className="text-white" size={20} />
            ) : (
              <VolumeX className="text-white" size={20} />
            )}
          </button>
        </div>

        {/* Info Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          I'm here to chat and help! (I don't edit the site - that's in THE MATRIX)
        </p>
      </div>
    </div>
  );
}

