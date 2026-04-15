'use client';

import { useAvatar } from '@/providers/AvatarProvider';
import { useVoiceBridge } from '@/providers/VoiceBridgeProvider';
import { MessageSquare, Mic, MicOff, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const InteractiveAvatar = dynamic(() => import('@/app/components/InteractiveAvatar'), {
  ssr: false,
});

export function LiveAvatarDock() {
  const { avatar, hideAvatar, showAvatar, speak } = useAvatar();
  const { isListening, startListening, stopListening, lastCommand } = useVoiceBridge();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!avatar.isVisible) {
    return (
      <button
        onClick={showAvatar}
        className="fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full bg-linear-to-r from-yellow-600 to-yellow-400 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Show Avatar"
      >
        <MessageSquare className="text-black" size={28} />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 w-20 h-20 rounded-full bg-linear-to-r from-yellow-600 to-yellow-400 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border-4 border-black"
        aria-label="Expand Avatar"
      >
        <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
          <MessageSquare className="text-black animate-pulse" size={32} />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Control Panel */}
      <div className="bg-black/90 backdrop-blur-md border border-yellow-500/30 rounded-lg p-3 flex flex-col gap-2 shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-yellow-400 text-xs font-bold">3000 AVATAR</span>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="w-6 h-6 rounded bg-yellow-600/20 hover:bg-yellow-600/40 flex items-center justify-center transition-colors"
              aria-label="Minimize"
            >
              <span className="text-yellow-400 text-xs">−</span>
            </button>
            <button
              onClick={hideAvatar}
              className="w-6 h-6 rounded bg-red-600/20 hover:bg-red-600/40 flex items-center justify-center transition-colors"
              aria-label="Close Avatar"
            >
              <X className="text-red-400" size={14} />
            </button>
          </div>
        </div>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-linear-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black'
          }`}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          {isListening ? 'LISTENING...' : 'VOICE COMMAND'}
        </button>

        {lastCommand && (
          <div className="text-xs text-gray-400 bg-black/50 rounded p-2 max-w-[200px]">
            "{lastCommand.transcript}"
          </div>
        )}

        <button
          onClick={() => speak('3000 Studios systems online and ready')}
          className="px-3 py-1 bg-black/50 hover:bg-black/70 text-yellow-400 text-xs rounded transition-colors"
        >
          Test Speech
        </button>
      </div>

      {/* Avatar Display */}
      <div className="w-64 h-64 rounded-2xl overflow-hidden border-4 border-yellow-500/50 shadow-2xl bg-black">
        <InteractiveAvatar />
      </div>

      {/* Emotion Indicator */}
      <div className="bg-black/90 backdrop-blur-md border border-yellow-500/30 rounded-lg px-3 py-1">
        <span className="text-yellow-400 text-xs">
          {avatar.isSpeaking && '🗣️ '}
          {avatar.currentEmotion.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

