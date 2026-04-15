'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, Map, TrendingUp, Users } from 'lucide-react';
import Card from '../../ui/Card';

export default function AdminStats() {
  return (
    <div className="container-standard py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center">
          <h1 className="text-5xl font-black text-[#D4AF37] tracking-tighter uppercase mb-2 italic">
            Intelligence Data
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
            Behavioral Analytics & Traffic Yield
          </p>
        </div>

        {/* Real-time Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard label="Live Sessions" value="1,492" icon={Users} trend="+12%" />
          <MetricCard label="Conversion Efficiency" value="4.8%" icon={TrendingUp} trend="+0.4%" />
          <MetricCard label="Avg. Core Duration" value="08:42" icon={Clock} trend="-2%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Heatmap Placeholder */}
          <Card className="bg-white/5 border-white/10 p-12 flex flex-col items-center justify-center min-h-[400px]">
            <Map className="text-white/10 mb-6" size={60} />
            <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-8">
              Global Interaction Heatmap
            </h3>
            <div className="w-full h-48 bg-white/5 rounded-3xl border border-dashed border-white/10 flex items-center justify-center">
              <span className="text-white/5 text-[9px] font-black uppercase tracking-widest">
                Processing Geospatial Payloads...
              </span>
            </div>
          </Card>

          {/* Detailed Breakdown */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 p-8">
              <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-3">
                <Activity size={14} className="text-[#D4AF37]" /> Interaction Density
              </h3>
              <div className="space-y-8">
                <ProgressBar label="Hero Section Engagement" value={88} />
                <ProgressBar label="Product View Conversion" value={42} />
                <ProgressBar label="Storefront Retention" value={65} />
                <ProgressBar label="AI Avatar Interactivity" value={92} />
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-8 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">
                  Bounced Events
                </span>
                <span className="text-2xl font-black text-white italic">0.4%</span>
              </div>
              <div className="w-24 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <span className="text-green-500 text-[10px] font-black italic">ULTRA-LOW</span>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: any;
  trend: string;
}) {
  return (
    <Card className="bg-white/5 border-white/10 p-8 flex flex-col items-center">
      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-4">
        <Icon size={18} className="text-[#D4AF37]" />
      </div>
      <span className="text-white/30 text-[8px] font-black uppercase tracking-widest mb-1">
        {label}
      </span>
      <span className="text-3xl font-black text-white italic tracking-tighter mb-2">{value}</span>
      <span
        className={`text-[10px] font-black ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}
      >
        {trend} Target
      </span>
    </Card>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
        <span className="text-white font-black text-[10px] italic">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full bg-linear-to-r from-[#D4AF37] to-[#FFD700] shadow-[0_0_10px_rgba(212,175,55,0.3)]"
        />
      </div>
    </div>
  );
}


