'use client';

import { motion } from 'framer-motion';
import { Video, Youtube, Share2, PlayCircle, Settings } from 'lucide-react';
import Card from '../../ui/Card';

export default function AutomationPage() {
  return (
    <div className="container-standard py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
              Omni-Content Lab
            </h1>
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">
              AI Video & Social Automation
            </p>
          </div>
          <div className="flex gap-4">
            <button className="p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
              <Settings size={20} />
            </button>
            <button className="px-8 py-2 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Emergency Stop
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10 p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <Video className="text-[#D4AF37]" size={18} /> Production Queue
              </h2>
              <span className="text-[10px] text-[#D4AF37] font-black">4 READY</span>
            </div>
            <div className="space-y-4">
              <QueueItem
                title="Weekly Tech Roundup"
                duration="0:45"
                status="PROCESSING"
                progress={65}
              />
              <QueueItem
                title="Designer Spotlight"
                duration="1:15"
                status="RENDERING"
                progress={88}
              />
              <QueueItem
                title="Nexus Launch Trailer"
                duration="0:30"
                status="UPLOADING"
                progress={12}
              />
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <Share2 className="text-[#D4AF37]" size={18} /> Distribution Nodes
              </h2>
              <span className="text-[10px] text-green-500 font-black">ALL ONLINE</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SocialCard platform="TikTok" handle="@3000studios" active />
              <SocialCard platform="YouTube" handle="3000StudiosOfficial" active />
              <SocialCard platform="Instagram" handle="@3000_studios" active />
              <SocialCard platform="Twitter" handle="@3000studios" active />
            </div>
          </Card>
        </div>

        <Card className="bg-linear-to-r from-[#D4AF37]/10 to-transparent border-white/5 p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] -z-10 group-hover:bg-[#D4AF37]/20 transition-all" />
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
              Auto-Create New Series
            </h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Let the AI engine scan your latest blog posts and portfolio updates to generate viral
              video content for all platforms automatically.
            </p>
            <button className="px-10 py-4 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform flex items-center gap-3">
              <PlayCircle size={20} /> Initialize Neural Render
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function QueueItem({ title, duration, status, progress }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-white text-xs font-bold">{title}</p>
          <p className="text-[8px] text-white/40 font-black uppercase tracking-widest">
            {duration} • {status}
          </p>
        </div>
        <span className="text-[10px] text-white/60 font-mono">{progress}%</span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-[#D4AF37]"
        />
      </div>
    </div>
  );
}

function SocialCard({ platform, handle, active }) {
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#D4AF37]/40 transition-colors">
      <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-1">
        {platform}
      </p>
      <p className="text-white text-[10px] truncate mb-3">{handle}</p>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-[8px] text-white/40 font-black uppercase">
          {active ? 'Connected' : 'Offline'}
        </span>
      </div>
    </div>
  );
}
