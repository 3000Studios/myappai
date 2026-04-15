'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { AudioProvider } from './AudioProvider';
import { AvatarProvider } from './AvatarProvider';
import { VoiceBridgeProvider } from './VoiceBridgeProvider';
import { LiveStateProvider } from './LiveStateProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * MASTER PROVIDER STACK
 * Order matters - each layer builds on the previous
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AudioProvider>
        <AvatarProvider>
          <VoiceBridgeProvider>
            <LiveStateProvider>{children}</LiveStateProvider>
          </VoiceBridgeProvider>
        </AvatarProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}

