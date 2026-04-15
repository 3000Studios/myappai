'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Brain, ArrowRight } from 'lucide-react';
import Card from '../../ui/Card';

export default function IdeaPage() {
  return (
    <div className="container-standard py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-12"
      >
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4 italic">
            Idea Nexus
          </h1>
          <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.5em]">
            Future Initiative Incubation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <IdeaCard
            icon={Lightbulb}
            title="AI Expansion"
            desc="Integrate deep learning nodes for real-time site adaptation based on user voice patterns."
            status="DRAFT"
          />
          <IdeaCard
            icon={Rocket}
            title="Global Nodes"
            desc="Exanding server footprint to include 12 new primary regions for sub-1ms latency."
            status="RESEARCH"
          />
          <IdeaCard
            icon={Brain}
            title="Voice CMS"
            desc="Eliminate touch-based editing entirely. Shift to 100% natural language project control."
            status="PROTOTYPE"
          />
        </div>

        <Card className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-12 rounded-3xl">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">
            Submit a Directive
          </h2>
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Describe your next breakthrough..."
              className="flex-1 bg-black border border-white/10 rounded-xl px-6 py-4 text-white focus:border-[#D4AF37] outline-none transition-all"
            />
            <button className="bg-[#D4AF37] text-black font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors">
              INCUBATE <ArrowRight size={18} />
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function IdeaCard({ icon: Icon, title, desc, status }) {
  return (
    <Card className="bg-white/5 border-white/5 p-8 text-left group hover:border-[#D4AF37]/40 transition-all hover:-translate-y-2">
      <Icon className="text-[#D4AF37] mb-6" size={40} />
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        <span className="text-[8px] font-black bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded-sm">
          {status}
        </span>
      </div>
      <p className="text-white/40 text-sm leading-relaxed mb-6">{desc}</p>
      <button className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors">
        Analyze Potential
      </button>
    </Card>
  );
}
