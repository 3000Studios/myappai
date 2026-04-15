'use client';

import { motion } from 'framer-motion';
import { Users, UserPlus, Gift, Copy } from 'lucide-react';
import Card from '../../ui/Card';

export default function ReferralPage() {
  return (
    <div className="container-standard py-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Referral Network
          </h1>
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">
            Viral Growth Control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Users} label="Active Referrers" value="158" />
          <StatCard icon={UserPlus} label="New Signups" value="24" />
          <StatCard icon={Gift} label="Rewards Issued" value="$1,200" />
        </div>

        <Card className="bg-white/5 border-white/10 p-10 flex flex-col items-center text-center">
          <h2 className="text-xl font-black text-white mb-2 uppercase italic tracking-widest">
            Global Referral Link
          </h2>
          <p className="text-white/40 text-xs mb-8">Share this link to expand the Nexus network</p>
          <div className="bg-black/50 border border-[#D4AF37]/30 rounded-2xl p-6 flex items-center gap-6 max-w-xl w-full">
            <code className="text-[#D4AF37] font-mono text-lg flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              3000studios.com/ref/bossman3000
            </code>
            <button className="p-4 bg-[#D4AF37] text-black rounded-xl hover:bg-white transition-colors">
              <Copy size={20} />
            </button>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-8">
          <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <ActivityRow
              name="Alex Rivera"
              action="signed up via link"
              time="2h ago"
              revenue="+$0.00"
            />
            <ActivityRow
              name="CryptoPulse"
              action="earned commission"
              time="5h ago"
              revenue="+$50.00"
            />
            <ActivityRow name="Sarah Connor" action="joined VIP" time="1d ago" revenue="+$25.00" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="bg-white/5 border-white/5 p-8 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-[#D4AF37]" size={24} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
        {label}
      </span>
      <span className="text-3xl font-black text-white tracking-widest">{value}</span>
    </Card>
  );
}

function ActivityRow({ name, action, time, revenue }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black text-[10px]">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-white text-xs font-bold">
            {name} <span className="text-white/40 font-normal">{action}</span>
          </p>
          <p className="text-[8px] text-white/20 uppercase font-black">{time}</p>
        </div>
      </div>
      <span className="text-green-500 font-mono font-bold text-xs">{revenue}</span>
    </div>
  );
}
