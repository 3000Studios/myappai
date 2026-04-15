'use client';

import React from 'react';

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$12,450.00" trend="+12.5%" />
        <StatCard title="Active Streams" value="3" trend="Stable" />
        <StatCard title="Orders Today" value="48" trend="+24%" />
        <StatCard title="System Health" value="99.9%" trend="Optimal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem text="New order processed: #8829" time="2 mins ago" type="order" />
            <ActivityItem
              text="Voice command parsed: 'deploy update'"
              time="15 mins ago"
              type="voice"
            />
            <ActivityItem text="System backup completed" time="1 hour ago" type="system" />
            <ActivityItem
              text="New user registered: j***@gmail.com"
              time="3 hours ago"
              type="user"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold mb-6">Server Status</h3>
          <div className="space-y-6">
            <StatusRow label="Edge Network" status="online" />
            <StatusRow label="Database Cluster" status="online" />
            <StatusRow label="Voice AI Worker" status="online" />
            <StatusRow label="Monetization Engine" status="online" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-black italic">{value}</h4>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.includes('+') ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}

function ActivityItem({ text, time, type }: { text: string; time: string; type: string }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div
        className={`w-2 h-2 rounded-full ${type === 'order' ? 'bg-green-500' : type === 'voice' ? 'bg-purple-500' : 'bg-blue-500'}`}
      ></div>
      <div className="flex-1 text-gray-300">{text}</div>
      <div className="text-[10px] text-gray-500 uppercase font-bold">{time}</div>
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: 'online' | 'offline' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-gray-500">{status}</span>
        <div
          className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
        ></div>
      </div>
    </div>
  );
}
