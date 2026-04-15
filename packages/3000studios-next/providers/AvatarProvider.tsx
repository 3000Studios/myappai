'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface AvatarState {
  isVisible: boolean;
  isSpeaking: boolean;
  currentEmotion: 'neutral' | 'happy' | 'thinking' | 'excited';
  position: 'bottom-right' | 'bottom-left' | 'floating';
}

interface AvatarContextType {
  avatar: AvatarState;
  showAvatar: () => void;
  hideAvatar: () => void;
  setEmotion: (emotion: AvatarState['currentEmotion']) => void;
  speak: (text: string) => Promise<void>;
  setPosition: (pos: AvatarState['position']) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [avatar, setAvatar] = useState<AvatarState>({
    isVisible: true,
    isSpeaking: false,
    currentEmotion: 'neutral',
    position: 'bottom-right',
  });

  const showAvatar = useCallback(() => {
    setAvatar((prev) => ({ ...prev, isVisible: true }));
  }, []);

  const hideAvatar = useCallback(() => {
    setAvatar((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const setEmotion = useCallback((emotion: AvatarState['currentEmotion']) => {
    setAvatar((prev) => ({ ...prev, currentEmotion: emotion }));
  }, []);

  const speak = useCallback(async (text: string) => {
    setAvatar((prev) => ({ ...prev, isSpeaking: true }));
    // Web Speech API integration
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setAvatar((prev) => ({ ...prev, isSpeaking: false }));
      };
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const setPosition = useCallback((pos: AvatarState['position']) => {
    setAvatar((prev) => ({ ...prev, position: pos }));
  }, []);

  return (
    <AvatarContext.Provider
      value={{
        avatar,
        showAvatar,
        hideAvatar,
        setEmotion,
        speak,
        setPosition,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (!context) throw new Error('useAvatar must be used within AvatarProvider');
  return context;
}

