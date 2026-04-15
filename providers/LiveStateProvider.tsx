'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface LiveState {
  isLive: boolean;
  viewerCount: number;
  streamUrl: string | null;
  streamTitle: string;
}

interface LiveStateContextType {
  live: LiveState;
  goLive: (url: string, title: string) => void;
  goOffline: () => void;
  updateViewerCount: (count: number) => void;
}

const LiveStateContext = createContext<LiveStateContextType | undefined>(undefined);

export function LiveStateProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState<LiveState>({
    isLive: false,
    viewerCount: 0,
    streamUrl: null,
    streamTitle: '',
  });

  const goLive = useCallback((url: string, title: string) => {
    setLive({
      isLive: true,
      viewerCount: 0,
      streamUrl: url,
      streamTitle: title,
    });
  }, []);

  const goOffline = useCallback(() => {
    setLive((prev) => ({
      ...prev,
      isLive: false,
      streamUrl: null,
    }));
  }, []);

  const updateViewerCount = useCallback((count: number) => {
    setLive((prev) => ({ ...prev, viewerCount: count }));
  }, []);

  return (
    <LiveStateContext.Provider
      value={{
        live,
        goLive,
        goOffline,
        updateViewerCount,
      }}
    >
      {children}
    </LiveStateContext.Provider>
  );
}

export function useLiveState() {
  const context = useContext(LiveStateContext);
  if (!context) throw new Error('useLiveState must be used within LiveStateProvider');
  return context;
}

