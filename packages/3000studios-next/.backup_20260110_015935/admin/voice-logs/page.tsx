'use client';

import React, { useState } from 'react';

export default function VoiceLogsPage() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      transcript: 'Switch theme to dark mode',
      confidence: 0.98,
      time: '10:45:02 AM',
      status: 'success',
    },
    {
      id: 2,
      transcript: 'Open store manager',
      confidence: 0.95,
      time: '10:42:15 AM',
      status: 'success',
    },
    {
      id: 3,
      transcript: 'Show me revenue for last week',
      confidence: 0.88,
      time: '10:30:55 AM',
      status: 'ambiguous',
    },
    {
      id: 4,
      transcript: 'Deploy latest build to production',
      confidence: 0.99,
      time: '09:12:00 AM',
      status: 'success',
    },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black italic uppercase mb-2">Voice Logs</h2>
        <p className="text-gray-400">Audit trail for voice-activated commands and transcripts.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div
                className={`p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors`}
              >
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
                <div className="text-white font-bold mb-1">"{log.transcript}"</div>
                <div className="flex items-center gap-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <span>{log.time}</span>
                  <span>•</span>
                  <span>Confidence: {Math.round(log.confidence * 100)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${log.status === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}
              >
                {log.status}
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
