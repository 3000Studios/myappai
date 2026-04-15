'use client';

import { Code } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================
// FREE MEDIA LIBRARIES - Quick Access
// ============================================

const MEDIA_LIBRARIES = {
  images: {
    name: 'Stock Photos',
    icon: '🖼️',
    categories: [
      {
        name: 'Technology',
        items: [
          {
            url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
            label: 'AI Concept',
          },
          {
            url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
            label: 'Robot',
          },
          {
            url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
            label: 'Data Center',
          },
          {
            url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
            label: 'Abstract Tech',
          },
        ],
      },
      {
        name: 'Business',
        items: [
          {
            url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
            label: 'Professional',
          },
          {
            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            label: 'Business Woman',
          },
          {
            url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
            label: 'Team Meeting',
          },
          {
            url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400',
            label: 'Office',
          },
        ],
      },
      {
        name: 'Abstract',
        items: [
          {
            url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
            label: 'Gradient',
          },
          {
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
            label: 'Waves',
          },
          {
            url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
            label: 'Colors',
          },
          {
            url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400',
            label: 'Particles',
          },
        ],
      },
    ],
  },
  videos: {
    name: 'Stock Videos',
    icon: '🎬',
    categories: [
      {
        name: 'Backgrounds',
        items: [
          {
            url: 'https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4',
            label: 'Particles',
          },
          {
            url: 'https://cdn.pixabay.com/video/2021/02/22/66316-517578498_large.mp4',
            label: 'Tech Grid',
          },
          {
            url: 'https://cdn.pixabay.com/video/2019/09/04/26859-359621230_large.mp4',
            label: 'Abstract Flow',
          },
          {
            url: 'https://cdn.pixabay.com/video/2020/02/12/32194-391715654_large.mp4',
            label: 'Stars',
          },
        ],
      },
      {
        name: 'Nature',
        items: [
          {
            url: 'https://cdn.pixabay.com/video/2019/06/19/24486-343689050_large.mp4',
            label: 'Ocean',
          },
          {
            url: 'https://cdn.pixabay.com/video/2020/08/12/46965-449623750_large.mp4',
            label: 'Mountains',
          },
          {
            url: 'https://cdn.pixabay.com/video/2019/07/11/25235-348418004_large.mp4',
            label: 'Forest',
          },
          {
            url: 'https://cdn.pixabay.com/video/2020/03/28/34044-402706631_large.mp4',
            label: 'Clouds',
          },
        ],
      },
    ],
  },
  icons: {
    name: 'Icons',
    icon: '⚡',
    categories: [
      {
        name: 'Emoji Icons',
        items: [
          { emoji: '🚀', label: 'Rocket' },
          { emoji: '💎', label: 'Diamond' },
          { emoji: '⚡', label: 'Lightning' },
          { emoji: '🔥', label: 'Fire' },
          { emoji: '✨', label: 'Sparkles' },
          { emoji: '🎯', label: 'Target' },
          { emoji: '🏆', label: 'Trophy' },
          { emoji: '💡', label: 'Idea' },
          { emoji: '🎨', label: 'Art' },
          { emoji: '🛡️', label: 'Shield' },
          { emoji: '⭐', label: 'Star' },
          { emoji: '💰', label: 'Money' },
        ],
      },
      {
        name: 'Tech Icons',
        items: [
          { emoji: '🤖', label: 'Robot' },
          { emoji: '🎤', label: 'Mic' },
          { emoji: '🎧', label: 'Headphones' },
          { emoji: '💻', label: 'Laptop' },
          { emoji: '📱', label: 'Phone' },
          { emoji: '🌐', label: 'Globe' },
          { emoji: '🔒', label: 'Lock' },
          { emoji: '📊', label: 'Chart' },
          { emoji: '⚙️', label: 'Settings' },
          { emoji: '🔧', label: 'Tools' },
          { emoji: '📡', label: 'Signal' },
          { emoji: '🎮', label: 'Gaming' },
        ],
      },
    ],
  },
  music: {
    name: 'Music/SFX',
    icon: '🎵',
    categories: [
      {
        name: 'Free Music Sources',
        items: [
          { url: 'https://pixabay.com/music/', label: 'Pixabay Music', type: 'link' },
          { url: 'https://freesound.org/', label: 'Freesound', type: 'link' },
          { url: 'https://incompetech.com/music/', label: 'Incompetech', type: 'link' },
          { url: 'https://www.youtube.com/audiolibrary', label: 'YouTube Audio', type: 'link' },
        ],
      },
    ],
  },
};

type VoiceAction =
  | { type: 'setTheme'; value: 'dark' | 'light' }
  | { type: 'setAccent'; value: string }
  | { type: 'addImage'; value: string }
  | { type: 'addVideo'; value: string }
  | { type: 'message'; value: string };

type VoiceResponse = {
  summary: string;
  actions: VoiceAction[];
};

function applyActions(actions: VoiceAction[]) {
  actions.forEach((action) => {
    if (action.type === 'setTheme') {
      document.documentElement.classList.toggle('dark', action.value === 'dark');
    }
    if (action.type === 'setAccent') {
      document.documentElement.style.setProperty('--accent-color', action.value);
    }
  });
}

export function VoiceCommandCenter() {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<string>('Ready');
  const [log, setLog] = useState<string[]>([]);
  const [actions, setActions] = useState<VoiceAction[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<string>('images');
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  }, []);

  const handleResult = useCallback(async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    setTranscript(cleanText);
    setStatus('Processing...');

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: cleanText }),
      });

      if (!response.ok) {
        throw new Error(`Voice API returned ${response.status}`);
      }

      const payload = (await response.json()) as VoiceResponse;
      setActions(payload.actions);
      applyActions(payload.actions);
      setLog((prev) => [`✓ ${payload.summary}`, ...prev].slice(0, 8));
      setStatus('Applied ✓');
    } catch (error: unknown) {
      console.error("", error);
      setStatus('Error - try again');
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      stopListening();
    } else {
      setStatus('Listening...');
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setStatus('Speech unavailable');
      return;
    }

    const recognition: any = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const result = event?.results?.[0]?.[0]?.transcript ?? '';
      stopListening();
      handleResult(result);
    };

    recognition.onerror = () => {
      setStatus('Speech error');
      stopListening();
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [handleResult, stopListening]);

  const currentLibrary = MEDIA_LIBRARIES[selectedLibrary as keyof typeof MEDIA_LIBRARIES];

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-linear-to-br from-[#D4AF37] to-amber-600 shadow-lg shadow-yellow-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        title="Open Voice Command Center"
      >
        <span className="text-2xl">🎤</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[420px] max-h-[85vh] overflow-hidden rounded-2xl bg-linear-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-linear-to-r from-[#D4AF37]/10 to-transparent">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${listening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
          />
          <div>
            <h2 className="text-white font-bold text-sm">Voice Command Center</h2>
            <p className="text-gray-400 text-xs">{status}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              listening
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/30'
            }`}
          >
            {listening ? '⏹ Stop' : '🎤 Listen'}
          </button>
          <button
            onClick={() => (window.location.href = '/voice-ai')}
            className="w-8 h-8 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 flex items-center justify-center text-cyan-400"
            title="Open Developer Console"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400"
            title="Minimize"
          >
            −
          </button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Voice Input Section */}
        <div className="space-y-3">
          {/* Transcript Display */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transcript</p>
            <p className="text-white text-sm min-h-[20px]">{transcript || 'Say a command...'}</p>
          </div>

          {/* Manual Input */}
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const text = (formData.get('manual') as string) ?? '';
              handleResult(text);
              e.currentTarget.reset();
            }}
          >
            <input
              name="manual"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              placeholder="Type command or paste URL..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg text-sm font-medium hover:bg-[#D4AF37]/30 transition-colors"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Media Libraries Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Media Libraries</p>
            {copiedItem && (
              <span className="text-xs text-green-400 animate-pulse">✓ Copied: {copiedItem}</span>
            )}
          </div>

          {/* Library Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
            {Object.entries(MEDIA_LIBRARIES).map(([key, lib]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedLibrary(key);
                  setSelectedCategory(0);
                }}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedLibrary === key
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-1">{lib.icon}</span>
                {lib.name}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          {currentLibrary.categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {currentLibrary.categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(idx)}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                    selectedCategory === idx
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Media Items Grid */}
          <div className="grid grid-cols-4 gap-2">
            {currentLibrary.categories[selectedCategory]?.items.map((item: any, idx: number) => {
              // Handle link items separately to avoid nested interactive controls
              if (item.type === 'link') {
                return (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all hover:scale-105 flex flex-col items-center justify-center p-1 text-center"
                    title={item.label}
                  >
                    <span className="text-lg">🔗</span>
                    <span className="text-[8px] text-gray-400 leading-tight">{item.label}</span>
                  </a>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    const copyValue = item.url || item.emoji || '';
                    copyToClipboard(copyValue, item.label);
                  }}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all hover:scale-105"
                  title={`Click to copy: ${item.label}`}
                >
                  {item.url && (
                    <Image
                      src={item.url}
                      alt={item.label}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  {item.emoji && (
                    <span className="text-2xl absolute inset-0 flex items-center justify-center">
                      {item.emoji}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium px-1 text-center">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Commands */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Quick Commands</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { cmd: 'make it dark', icon: '🌙' },
              { cmd: 'make it light', icon: '☀️' },
              { cmd: 'accent gold', icon: '🟡' },
              { cmd: 'accent blue', icon: '🔵' },
              { cmd: 'add animation', icon: '✨' },
              { cmd: 'make it faster', icon: '⚡' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleResult(item.cmd)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37]/30 hover:bg-white/10 transition-all text-left"
              >
                <span>{item.icon}</span>
                <span className="text-xs text-gray-300">{item.cmd}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Actions Log */}
        {log.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Recent Actions</p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {log.map((entry, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400"
                >
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Speak or type to edit UI</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Connected
          </span>
        </div>
      </div>
    </div>
  );
}

export default VoiceCommandCenter;

