'use client';

import { motion } from 'framer-motion';
import { BarChart3, Cpu, Globe, Shield, Target, Zap } from 'lucide-react';
import Card from '../../ui/Card';

export default function GlobalDashboard() {
  return (
    <div className="container-standard py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            Nexus Performance
          </h1>
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">
            Real-time Global Infrastructure Audit
          </p>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Globe} label="Network Reach" value="GLOBAL" sub="142 Nodes Active" />
          <StatCard icon={Zap} label="Response Latency" value="1.2ms" sub="Optimization Peak" />
          <StatCard icon={Shield} label="Security Index" value="100.0" sub="Zero Breach State" />
          <StatCard icon={Cpu} label="Compute Load" value="14%" sub="Scaled for Demand" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual: Performance Map Placeholder */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10 p-12 h-[500px] flex flex-col items-center justify-center relative shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />
            <BarChart3 className="text-[#D4AF37]/20 mb-6" size={80} />
            <h2 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 italic">
              Neural Throughput Visualization
            </h2>
            <div className="w-full max-w-md h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '75%' }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                className="h-full bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]"
              />
            </div>
            <p className="mt-8 text-white/20 text-[8px] font-black uppercase tracking-widest">
              Awaiting Live Webhook Synchronization...
            </p>
          </Card>

          {/* Side: Optimization Tasks */}
          <Card className="bg-white/5 border-[#D4AF37]/20 p-8 flex flex-col items-center">
            <Target className="text-[#D4AF37] mb-6" size={32} />
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">
              Active Directives
            </h3>
            <div className="space-y-6 w-full">
              <DirectiveRow label="Audit SEO Integrity" status="SYNCED" />
              <DirectiveRow label="Inject AdSense Slots" status="ACTIVE" />
              <DirectiveRow label="Normalize Global Padding" status="FIXED" />
              <DirectiveRow label="Auto-Commit Engine" status="HOT" />
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="bg-white/5 border-white/5 p-8 flex flex-col items-center group hover:border-[#D4AF37]/30 transition-all">
      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="text-[#D4AF37]" size={20} />
      </div>
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">
        {label}
      </span>
      <span className="text-2xl font-black text-white italic tracking-tighter mb-2">{value}</span>
      <span className="text-[8px] font-bold text-[#D4AF37]/60 tracking-widest uppercase">
        {sub}
      </span>
    </Card>
  );
}

function DirectiveRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">{label}</span>
      <span className="text-[#D4AF37] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#D4AF37]/10 rounded-sm italic">
        {status}
      </span>
    </div>
  );
}


