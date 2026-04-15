'use client';

import React from 'react';

export default function LiveControlPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic uppercase mb-2">Live Control</h2>
          <p className="text-gray-400">Manage stream broadcasts and live engagement.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-red-500 uppercase">System Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-video bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-4 opacity-20"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <p className="text-gray-500 italic">Preview Stream Offline</p>
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2 py-1 bg-black/50 backdrop-blur rounded text-[8px] font-bold uppercase tracking-widest border border-white/10">
              1080p60
            </span>
            <span className="px-2 py-1 bg-black/50 backdrop-blur rounded text-[8px] font-bold uppercase tracking-widest border border-white/10">
              0kbps
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-6">Broadcast Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Stream Key</span>
                <span className="text-xs font-mono text-white">••••••••••••••••</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Latency Mode</span>
                <span className="text-[10px] font-bold uppercase">Ultra Low</span>
              </div>
            </div>
            <button className="w-full mt-8 bg-white text-black py-3 rounded-2xl font-black italic uppercase hover:bg-zinc-200 transition-colors">
              START BROADCAST
            </button>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-6">Live Chat Control</h3>
            <div className="h-48 bg-black/20 rounded-2xl mb-4 border border-white/5 flex items-center justify-center">
              <p className="text-gray-600 text-xs italic uppercase italic">
                Waiting for connection...
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Send a message as ADMIN..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-white/30"
              />
              <button className="p-2 aspect-square bg-white text-black rounded-xl">&rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
