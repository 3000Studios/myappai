'use client';

import React, { useCallback, useEffect, useState } from 'react';

type VoiceLog = {
  id?: string | number;
  transcript?: string;
  confidence?: number;
  time?: string;
  status?: 'success' | 'ambiguous' | 'failed';
};

export default function VoiceLogsPage() {
  const [logs, setLogs] = useState<VoiceLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/voice-logs?limit=50');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to load voice logs');
      }
      setLogs(data?.logs || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load voice logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadLogs]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black italic uppercase mb-2">Voice Logs</h2>
        <p className="text-gray-400">Audit trail for voice-activated commands and transcripts.</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          {loading ? 'Loading' : 'Auto-refreshing every 5 minutes'}
        </span>
        <button
          onClick={loadLogs}
          className="text-xs uppercase tracking-widest font-bold text-white bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm p-4 rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {logs.length === 0 && !loading && (
          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 text-sm text-gray-400">
            No voice logs yet. This will populate as voice commands are processed.
          </div>
        )}
        {logs.map((log, index) => (
          <div
            key={log.id || index}
            className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold mb-1">
                  "{log.transcript || 'Unlabeled command'}"
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <span>{log.time || 'Unknown time'}</span>
                  <span>|</span>
                  <span>Confidence: {Math.round((log.confidence || 0) * 100)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  log.status === 'success'
                    ? 'bg-green-500/20 text-green-500'
                    : log.status === 'failed'
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-yellow-500/20 text-yellow-500'
                }`}
              >
                {log.status || 'unknown'}
              </span>
              <button className="text-gray-500 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
