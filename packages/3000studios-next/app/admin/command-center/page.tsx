'use client';

import { handleVoicePayload } from '@/lib/voice/payloadHandler';
import { motion } from 'framer-motion';
import { Box, Play, Timer, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Card from '../../ui/Card';

const UnifiedAvatar = dynamic(() => import('@/components/avatar/UnifiedAvatar'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 rounded-3xl animate-pulse">
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">
        Hydrating Neural Link...
      </span>
    </div>
  ),
});

export default function CommandCenter() {
  const [status, setStatus] = useState('ACTIVE');

  const triggerUpdate = (accent: string) => {
    setStatus(`SHIFTING: ${accent.toUpperCase()}...`);
    handleVoicePayload({ target: 'style', path: 'accent', value: accent });
    setTimeout(() => setStatus('ACTIVE'), 2000);
  };

  return (
    <div className="container-standard py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            Command Nexus
          </h1>
          <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-black text-[10px] tracking-[0.4em]">
            <span className="animate-pulse">●</span> STATUS: {status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Matrix */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
            <UnifiedAvatar variant="full" className="w-full h-full" showHUD={true} />
            <div className="absolute top-6 left-6 p-4 glass-premium rounded-2xl border border-white/20">
              <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase">
                System Core / 3KAI
              </span>
            </div>
          </div>

          <div className="space-y-8 flex flex-col justify-center">
            {/* Visual Overrides */}
            <Card className="bg-white/5 border-white/10 p-8">
              <h2 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-6 flex items-center justify-center gap-3">
                <Box size={16} className="text-[#D4AF37]" /> Aesthetic Protocol
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {['gold', 'platinum', 'sapphire'].map((accent) => (
                  <button
                    key={accent}
                    onClick={() => triggerUpdate(accent)}
                    className="py-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all font-black uppercase tracking-widest text-[10px] active:scale-95"
                  >
                    {accent}
                  </button>
                ))}
              </div>
            </Card>

            {/* Monetization Injections */}
            <Card className="bg-white/5 border-white/10 p-8">
              <h2 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-6 flex items-center justify-center gap-3">
                <Zap size={16} className="text-green-500" /> Revenue Injections
              </h2>
              <div className="space-y-3 w-full">
                <InjectionButton label="Inject AI Toolkit" prodId="prod_001" color="bg-cyan-600" />
                <InjectionButton
                  label="Inject Masterclass"
                  prodId="prod_002"
                  color="bg-purple-600"
                />
              </div>
            </Card>

            {/* Timers */}
            <Card className="bg-white/5 border-white/10 p-8">
              <h2 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-6 flex items-center justify-center gap-3">
                <Timer size={16} className="text-red-500" /> Scarcity Triggers
              </h2>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() =>
                    handleVoicePayload({ target: 'monetization', path: 'scarcity', value: '15' })
                  }
                  className="flex-1 py-4 rounded-2xl border border-red-500/30 bg-red-500/5 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all"
                >
                  15m Timer
                </button>
                <button
                  onClick={() =>
                    handleVoicePayload({ target: 'monetization', path: 'scarcity', value: '60' })
                  }
                  className="flex-1 py-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 text-orange-500 font-black uppercase tracking-widest text-[10px] hover:bg-orange-500 hover:text-white transition-all"
                >
                  60m Timer
                </button>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InjectionButton({
  label,
  prodId,
  color,
}: {
  label: string;
  prodId: string;
  color: string;
}) {
  return (
    <button
      onClick={() => handleVoicePayload({ target: 'monetization', path: 'inject', value: prodId })}
      className={`w-full p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/30 transition-all group flex items-center justify-between active:scale-[0.98]`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <Play size={16} className="text-white fill-white" />
        </div>
        <div className="text-left">
          <span className="block text-white font-black uppercase tracking-widest text-[10px]">
            {label}
          </span>
          <span className="text-white/30 text-[8px] font-bold uppercase">{prodId}</span>
        </div>
      </div>
      <PlusIcon />
    </button>
  );
}

function PlusIcon() {
  return (
    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white transition-all">
      <span className="text-xl">+</span>
    </div>
  );
}


