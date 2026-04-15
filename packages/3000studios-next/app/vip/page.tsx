'use client';

import VoiceCodeEditor from '@/app/admin/components/VoiceCodeEditor';

export default function VIPPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono p-10">
      <h1 className="text-3xl font-bold tracking-widest mb-6">VIP COMMAND CENTER</h1>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-emerald-400 font-mono text-sm mb-2">SYSTEM STATUS: ONLINE</p>
          <p className="text-gray-400">
            Voice Command Interface active. All commands are auditable and reversible.
          </p>
        </div>

        <VoiceCodeEditor />
      </div>
    </div>
  );
}

