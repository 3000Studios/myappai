'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VoiceCommand {
  transcript: string;
  confidence: number;
  timestamp: Date;
}

interface VoiceBridgeContextType {
  isListening: boolean;
  lastCommand: VoiceCommand | null;
  startListening: () => void;
  stopListening: () => void;
  executeCommand: (command: string) => Promise<void>;
}

const VoiceBridgeContext = createContext<VoiceBridgeContextType | undefined>(undefined);

export function VoiceBridgeProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const router = useRouter();

  const executeCommand = useCallback(
    async (command: string) => {
      const lower = command.toLowerCase();

      // Navigation commands
      if (lower.includes('go to') || lower.includes('navigate to') || lower.includes('open')) {
        if (lower.includes('home')) router.push('/');
        else if (lower.includes('about')) router.push('/about');
        else if (lower.includes('blog')) router.push('/blog');
        else if (lower.includes('contact')) router.push('/contact');
        else if (lower.includes('store')) router.push('/store');
        else if (lower.includes('live')) router.push('/live');
        else if (lower.includes('admin')) router.push('/admin');
      }

      // UI commands
      else if (lower.includes('scroll down')) {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      } else if (lower.includes('scroll up')) {
        window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
      } else if (lower.includes('scroll to top')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setLastCommand({
        transcript: command,
        confidence: 0.9,
        timestamp: new Date(),
      });
    },
    [router]
  );

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      executeCommand(transcript);
    };

    recognition.start();
    setIsListening(true);
  }, [executeCommand]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return (
    <VoiceBridgeContext.Provider
      value={{
        isListening,
        lastCommand,
        startListening,
        stopListening,
        executeCommand,
      }}
    >
      {children}
    </VoiceBridgeContext.Provider>
  );
}

export function useVoiceBridge() {
  const context = useContext(VoiceBridgeContext);
  if (!context) throw new Error('useVoiceBridge must be used within VoiceBridgeProvider');
  return context;
}

