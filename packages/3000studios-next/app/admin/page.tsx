'use client';

import React, { useEffect, useMemo, useState } from 'react';

type HealthResponse = {
  healthy?: boolean;
  endpoints?: { endpoint: string; status: string }[];
  alerts?: string | null;
};

type AnalyticsStats = {
  totalRevenue?: number;
  liveViewers?: number;
  storeOrders?: number;
  activeUsers?: number;
};

export default function AdminOverview() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const systemHealth = useMemo(() => {
    if (!health) return 'Checking';
    return health.healthy ? 'Healthy' : 'Attention';
  }, [health]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [healthRes, analyticsRes] = await Promise.all([
          fetch('/api/health/revenue'),
          fetch('/api/analytics?timeRange=day'),
        ]);
        const healthJson = await healthRes.json();
        const analyticsJson = await analyticsRes.json();
        if (!healthRes.ok) {
          throw new Error(healthJson?.error || 'Failed to load health');
        }
        if (!analyticsRes.ok) {
          throw new Error(analyticsJson?.error || 'Failed to load analytics');
        }
        if (isMounted) {
          setHealth(healthJson);
          setStats(analyticsJson?.stats || null);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load admin data');
        }
      }
    };
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm p-4 rounded-2xl">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          trend="+12.5%"
        />
        <StatCard title="Active Streams" value={`${stats?.liveViewers || 0}`} trend="Live" />
        <StatCard title="Orders Today" value={`${stats?.storeOrders || 0}`} trend="+24%" />
        <StatCard title="System Health" value={systemHealth} trend="Status" />
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

      {health?.alerts && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-sm p-4 rounded-2xl">
          {health.alerts}
        </div>
      )}
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
