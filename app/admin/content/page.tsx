'use client';

import React from 'react';

export default function ContentAutomationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black italic uppercase mb-2">Content Automation</h2>
        <p className="text-gray-400">AI-driven blog generation and social media scheduling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold">New Task</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-500">Prompt Source</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 text-white">
                <option>Latest Tech News</option>
                <option>Store Product Updates</option>
                <option>Community Feedback</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-500">
                Target Platform
              </label>
              <div className="flex gap-2">
                <PlatformToggle name="Blog" active />
                <PlatformToggle name="X" active />
                <PlatformToggle name="TikTok" />
              </div>
            </div>
          </div>
          <button className="w-full bg-white text-black py-3 rounded-2xl font-black italic uppercase hover:bg-gray-200 transition-colors">
            RUN AUTOMATION
          </button>
        </div>

        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold mb-6">Queue Status</h3>
          <div className="space-y-6">
            <QueueItem
              title="Blog: The Future of Quantum Audio"
              status="processing"
              progress={45}
            />
            <QueueItem title="Social: 3KAI Launch Trailer" status="scheduled" progress={0} />
            <QueueItem
              title="Update: Product 8829 Descriptions"
              status="completed"
              progress={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformToggle({ name, active = false }: { name: string; active?: boolean }) {
  return (
    <div
      className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase cursor-pointer transition-colors ${active ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'}`}
    >
      {name}
    </div>
  );
}

function QueueItem({
  title,
  status,
  progress,
}: {
  title: string;
  status: string;
  progress: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-300 font-bold">{title}</span>
        <span
          className={`uppercase tracking-widest font-black text-[8px] ${status === 'processing' ? 'text-blue-500' : status === 'scheduled' ? 'text-purple-500' : 'text-green-500'}`}
        >
          {status}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
