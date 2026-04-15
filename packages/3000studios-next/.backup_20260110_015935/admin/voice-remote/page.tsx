'use client';

import {
  resolveSpeechRecognition,
  type SpeechRecognitionErrorEventLike,
  type SpeechRecognitionEventLike,
  type SpeechRecognitionHandle,
} from '@/lib/speechRecognition';
import { AlertCircle, Mic, MicOff, Radio, Volume2, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface VoiceLog {
  id: string;
  command: string;
  status: 'success' | 'error' | 'pending';
  timestamp: Date;
}

export default function VoiceRemotePage() {
  const [status, setStatus] = useState<'ready' | 'listening' | 'processing' | 'error'>('ready');
  const [transcript, setTranscript] = useState('');
  const [logs, setLogs] = useState<VoiceLog[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionHandle | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = resolveSpeechRecognition();

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setStatus('listening');
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;

      setTranscript(text);

      if (result.isFinal) {
        executeCommand(text);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      console.error('Speech recognition error:', event.error);
      setStatus('error');
      setTimeout(() => setStatus('ready'), 2000);
    };

    recognition.onend = () => {
      if (status === 'listening') {
        setStatus('ready');
      }
    };

    recognitionRef.current = recognition;
  }, [status]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || status === 'listening') return;

    setTranscript('');
    try {
      recognitionRef.current.start();
    } catch (err: unknown) {
      console.error('', err);
    }
  }, [status]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setStatus('ready');
  }, []);

  const executeCommand = async (command: string) => {
    const logId = Date.now().toString();
    setStatus('processing');

    // Add pending log
    setLogs((prev) => [
      { id: logId, command, status: 'pending', timestamp: new Date() },
      ...prev.slice(0, 9),
    ]);

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          target: 'voice-remote',
          payload: { command },
        }),
      });

      if (!res.ok) throw new Error('API error');

      // Update log to success
      setLogs((prev) =>
        prev.map((log) => (log.id === logId ? { ...log, status: 'success' as const } : log))
      );
      setStatus('ready');
    } catch (err: unknown) {
      // Update log to error
      setLogs((prev) =>
        prev.map((log) => (log.id === logId ? { ...log, status: 'error' as const } : log))
      );
      setStatus('error');
      setTimeout(() => setStatus('ready'), 2000);
    }
  };

  const quickCommands = [
    { label: 'Deploy Site', icon: '🚀', command: 'deploy site' },
    { label: 'Optimize', icon: '⚡', command: 'toggle optimization' },
    { label: 'Dark Mode', icon: '🌙', command: 'make it dark' },
    { label: 'Light Mode', icon: '☀️', command: 'make it light' },
    { label: 'Gold Theme', icon: '🟡', command: 'set accent gold' },
    { label: 'Blue Theme', icon: '🔵', command: 'set accent sapphire' },
  ];

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Voice Not Supported</h1>
          <p className="text-gray-400">
            Your browser doesn&apos;t support speech recognition. Please try Chrome on desktop, or
            Chrome/Safari on mobile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="text-yellow-500" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Voice Commander
            </h1>
          </div>
          <p className="text-gray-400">Tap the microphone and speak your command</p>
        </div>

        {/* Main Voice Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={status === 'listening' ? stopListening : startListening}
            disabled={status === 'processing'}
            className={`
              relative w-48 h-48 rounded-full border-4 flex items-center justify-center
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              ${
                status === 'listening'
                  ? 'border-red-500 bg-red-900/30 scale-110 shadow-[0_0_60px_rgba(239,68,68,0.4)]'
                  : status === 'processing'
                    ? 'border-yellow-500 bg-yellow-900/20 animate-pulse'
                    : status === 'error'
                      ? 'border-red-600 bg-red-900/20'
                      : 'border-yellow-500 bg-yellow-900/20 hover:scale-105 hover:shadow-[0_0_40px_rgba(234,179,8,0.3)]'
              }
            `}
          >
            {/* Pulse rings when listening */}
            {status === 'listening' && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-20" />
                <div
                  className="absolute inset-[-20px] rounded-full border border-red-400 animate-ping opacity-10"
                  style={{ animationDelay: '0.5s' }}
                />
              </>
            )}

            {status === 'listening' ? (
              <MicOff className="w-20 h-20 text-red-400" />
            ) : status === 'processing' ? (
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mic className="w-20 h-20 text-yellow-400" />
            )}
          </button>
        </div>

        {/* Status Display */}
        <div className="text-center mb-8">
          <p
            className={`text-xl font-mono uppercase tracking-widest ${
              status === 'listening'
                ? 'text-red-400 animate-pulse'
                : status === 'processing'
                  ? 'text-yellow-400 animate-pulse'
                  : status === 'error'
                    ? 'text-red-500'
                    : 'text-gray-400'
            }`}
          >
            {status === 'listening'
              ? '🎤 Listening...'
              : status === 'processing'
                ? '⚡ Processing...'
                : status === 'error'
                  ? '❌ Error - Try Again'
                  : '⏺ Ready'}
          </p>
        </div>

        {/* Transcript Display */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="text-gray-500" size={16} />
            <span className="text-gray-500 text-sm uppercase tracking-wider">Transcript</span>
          </div>
          <p className="text-white text-lg font-mono min-h-[28px]">
            {transcript || <span className="text-gray-600">Say something...</span>}
          </p>
        </div>

        {/* Quick Commands */}
        <div className="mb-8">
          <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap size={14} />
            Quick Commands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickCommands.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setTranscript(item.command);
                  executeCommand(item.command);
                }}
                disabled={status === 'processing'}
                className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-yellow-500/50 hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Command History */}
        {logs.length > 0 && (
          <div>
            <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">Recent Commands</h2>
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                    log.status === 'success'
                      ? 'bg-green-900/20 border-green-500/30'
                      : log.status === 'error'
                        ? 'bg-red-900/20 border-red-500/30'
                        : 'bg-gray-900/50 border-gray-700 animate-pulse'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>
                      {log.status === 'success' ? '✅' : log.status === 'error' ? '❌' : '⏳'}
                    </span>
                    <span className="text-white font-mono text-sm">{log.command}</span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



