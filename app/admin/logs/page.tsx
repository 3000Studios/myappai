'use client';

import React from 'react';

export default function LogsPage() {
  const systemLogs = [
    { id: 1, type: 'info', message: 'System deployment successful', time: '2026-01-10 09:12:00' },
    {
      id: 2,
      type: 'warn',
      message: 'High CPU usage detected on Voice Worker',
      time: '2026-01-10 09:15:22',
    },
    {
      id: 3,
      type: 'error',
      message: 'Failed login attempt from IP 192.168.1.45',
      time: '2026-01-10 09:18:45',
    },
    {
      id: 4,
      type: 'info',
      message: 'Database optimization routine completed',
      time: '2026-01-10 09:20:01',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black italic uppercase mb-2">System Logs</h2>
        <p className="text-gray-400">Low-level system events and audit trail.</p>
      </div>

      <div className="bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden font-mono text-xs">
        <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
          <span className="text-gray-500 uppercase font-black">auth.log / system.log</span>
          <div className="flex gap-4">
            <span className="text-green-500">Live Updates Enabled</span>
            <span className="text-gray-600">|</span>
            <span className="text-white hover:underline cursor-pointer">Clear Buffer</span>
          </div>
        </div>
        <div className="p-6 space-y-2 max-h-[500px] overflow-y-auto">
          {systemLogs.map((log) => (
            <div key={log.id} className="flex gap-4 group">
              <span className="text-gray-600 shrink-0">[{log.time}]</span>
              <span
                className={`uppercase font-bold shrink-0 ${log.type === 'error' ? 'text-red-500' : log.type === 'warn' ? 'text-yellow-500' : 'text-blue-500'}`}
              >
                {log.type.padEnd(5)}
              </span>
              <span className="text-gray-300 group-hover:text-white transition-colors">
                {log.message}
              </span>
            </div>
          ))}
          <div className="flex gap-4 animate-pulse">
            <span className="text-gray-600">
              [{new Date().toISOString().replace('T', ' ').split('.')[0]}]
            </span>
            <span className="text-gray-500 uppercase font-bold">WAIT </span>
            <span className="text-gray-600">Listening for events...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
