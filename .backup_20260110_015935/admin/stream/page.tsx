'use client';

import { motion } from 'framer-motion';
import { Activity, MessageSquare, Play, Radio, Square, Tv, Users } from 'lucide-react';
import { useState } from 'react';
import Card from '../../ui/Card';

export default function StreamAdmin() {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <div className="container-standard py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-12"
      >
        <div className="text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            Live Broadcast
          </h1>
          <div className="flex items-center justify-center gap-4 text-[#D4AF37] font-black text-[10px] tracking-[0.4em]">
            <span
              className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}
            />
            STATUS: {isStreaming ? 'ON AIR' : 'OFFLINE'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Monitor */}
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl">
              {!isStreaming ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-4">
                    <Tv className="text-white/20" size={40} />
                  </div>
                  <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                    No Signal Detected
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-red-950/20 to-black flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Activity className="text-red-500 animate-bounce mb-4" size={48} />
                    <span className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                      Encoding Active
                    </span>
                  </div>
                </div>
              )}
              {/* HUD Overlays */}
              <div className="absolute top-6 left-6 flex gap-3">
                <Badge label="1080p / 60fps" color="bg-black/60 text-white" />
                <Badge label="Bitrate: 6.2Mbps" color="bg-black/60 text-white" />
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="text-center md:text-left">
                  <h2 className="text-white font-black uppercase tracking-widest text-sm italic">
                    Broadcast Control
                  </h2>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">
                    Master kill-switch & start protocol
                  </p>
                </div>
                <div className="flex gap-4">
                  {!isStreaming ? (
                    <button
                      onClick={() => setIsStreaming(true)}
                      className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                    >
                      <Play size={16} fill="white" /> Go Live
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsStreaming(false)}
                      className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all active:scale-95"
                    >
                      <Square size={16} fill="white" /> Terminate
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Side Panels: Chat & Stats */}
          <div className="space-y-8">
            <Card className="bg-white/5 border-white/10 p-8 h-[400px] flex flex-col">
              <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                <MessageSquare size={14} className="text-[#D4AF37]" /> Live Transmission Chat
              </h3>
              <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
                <Radio className="mb-4" size={32} />
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  Waiting for incoming
                  <br />
                  data streams...
                </p>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-8">
              <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                <Users size={14} className="text-[#D4AF37]" /> Audience Metrics
              </h3>
              <div className="space-y-6">
                <MetricRow label="Current Viewers" value="0" />
                <MetricRow label="Peak Today" value="0" />
                <MetricRow label="Avg. Stickiness" value="0%" />
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <div
      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md ${color}`}
    >
      {label}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-2">
      <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">{label}</span>
      <span className="text-xl font-black text-white tabular-nums">{value}</span>
    </div>
  );
}


