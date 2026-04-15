'use client';

import React, { useEffect, useState } from 'react';

type RevenueState = {
  totalRevenue?: number;
  storeOrders?: number;
  conversionRate?: number;
};

type HealthState = {
  healthy?: boolean;
  alerts?: string | null;
};

export default function RevenuePage() {
  const [stats, setStats] = useState<RevenueState | null>(null);
  const [health, setHealth] = useState<HealthState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [analyticsRes, healthRes] = await Promise.all([
          fetch('/api/analytics?timeRange=week'),
          fetch('/api/health/revenue'),
        ]);
        const analyticsJson = await analyticsRes.json();
        const healthJson = await healthRes.json();
        if (!analyticsRes.ok) {
          throw new Error(analyticsJson?.error || 'Failed to load analytics');
        }
        if (!healthRes.ok) {
          throw new Error(healthJson?.error || 'Failed to load health');
        }
        if (active) {
          setStats(analyticsJson?.stats || null);
          setHealth(healthJson);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load revenue data');
        }
      }
    };
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black italic uppercase mb-2">Revenue Tracking</h2>
        <p className="text-gray-400">Real-time monetization performance across all channels.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm p-4 rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 p-8 rounded-3xl border border-white/5 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 italic mb-4">Revenue chart visualization placeholder</p>
            <div className="flex items-end gap-2 h-32 justify-center">
              <div className="w-8 bg-white/10 h-1/2 rounded-t-lg"></div>
              <div className="w-8 bg-white/20 h-2/3 rounded-t-lg"></div>
              <div className="w-8 bg-white/30 h-3/4 rounded-t-lg"></div>
              <div className="w-8 bg-white/40 h-1/2 rounded-t-lg"></div>
              <div className="w-8 bg-white h-full rounded-t-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Payout Schedule
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-black">
                ${stats?.totalRevenue?.toLocaleString() || '0'}
              </span>
              <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold">
                NEXT PAYOUT
              </span>
            </div>
            <p className="text-xs text-gray-500">Scheduled for January 15, 2026</p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Top Channels
            </h3>
            <div className="space-y-4">
              <ChannelRow
                name="Direct Store"
                amount={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
                percent={68}
              />
              <ChannelRow name="Subscription" amount="$0" percent={0} />
              <ChannelRow name="Ads / Referral" amount="$0" percent={0} />
            </div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Revenue Endpoint Health
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {health?.healthy ? 'All endpoints healthy' : 'Attention needed'}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  health?.healthy ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {health?.healthy ? 'OK' : 'CHECK'}
              </span>
            </div>
            {health?.alerts && (
              <p className="text-xs text-yellow-200 mt-3">{health.alerts}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelRow({ name, amount, percent }: { name: string; amount: string; percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{name}</span>
        <span className="font-bold">{amount}</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-white" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
