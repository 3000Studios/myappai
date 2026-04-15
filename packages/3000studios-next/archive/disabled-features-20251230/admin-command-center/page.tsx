'use client';

import dynamic from 'next/dynamic';

const VoiceInput = dynamic(() => import('@/components/VoiceInput'), { ssr: false });
const PreviewFrame = dynamic(() => import('@/components/PreviewFrame'), { ssr: false });
const Avatar3D = dynamic(() => import('@/components/Avatar3D'), { ssr: false });

export default function CommandCenter() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Command Center</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/80 p-6 rounded-xl">
          <Avatar3D isListening={false} isSpeaking={false} />
        </div>
        <div className="space-y-6">
          <VoiceInput />
          <PreviewFrame />
          <button className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold">
            CONFIRM & DEPLOY
          </button>
        </div>
      </div>
    </div>
  );
}

