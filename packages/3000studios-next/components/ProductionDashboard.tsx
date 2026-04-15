// Copyright (c) 2025 NAME.
// All rights reserved.

'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  // Visitors
  totalVisitors: number;
  visitors24h: number;
  visitors7d: number;
  unique24h: number;
  topPages: Array<{ path: string; views: number }>;

  // Sales
  totalSales: number;
  sales24h: number;
  revenue24h: number;
  revenue7d: number;
  revenueTotal: number;
  topProducts: Array<{ product: string; count: number; revenue: number }>;

  // System
  systemStatus: string;
  uptime: string;
  memoryUsed: number;
  memoryTotal: number;

  // Deployments
  totalDeployments: number;
  productionUrl: string | null;
  latestDeployment: {
    state: string;
    created: number;
    url: string;
  } | null;
}

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  icon?: string;
}

const StatCard = ({ title, value, unit, trend, icon }: StatCardProps) => (
  <div className="bg-corporate-navy border border-corporate-steel rounded-lg p-4 hover:border-corporate-gold transition">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-corporate-silver text-xs font-medium uppercase tracking-wide">{title}</h4>
      {icon && <span className="text-lg">{icon}</span>}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-heading font-bold text-white">{value}</span>
      {unit && <span className="text-corporate-silver text-sm">{unit}</span>}
    </div>
    {trend && <p className="text-xs text-corporate-gold mt-1">{trend}</p>}
  </div>
);

export default function ProductionDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [visitorsRes, salesRes, systemRes, deploymentsRes] = await Promise.all([
        fetch('/api/analytics/visitors'),
        fetch('/api/analytics/sales'),
        fetch('/api/analytics/system'),
        fetch('/api/analytics/deployments'),
      ]);

      const [visitors, sales, system, deployments] = await Promise.all([
        visitorsRes.json(),
        salesRes.json(),
        systemRes.json(),
        deploymentsRes.json(),
      ]);

      setStats({
        totalVisitors: visitors.total || 0,
        visitors24h: visitors.last24h || 0,
        visitors7d: visitors.last7d || 0,
        unique24h: visitors.unique24h || 0,
        topPages: visitors.topPages || [],

        totalSales: sales.totalSales || 0,
        sales24h: sales.sales24h || 0,
        revenue24h: sales.revenue24h || 0,
        revenue7d: sales.revenue7d || 0,
        revenueTotal: sales.revenueTotal || 0,
        topProducts: sales.topProducts || [],

        systemStatus: system.status || 'Unknown',
        uptime: system.uptime || '0h 0m',
        memoryUsed: system.memory?.heapUsed || 0,
        memoryTotal: system.memory?.heapTotal || 0,

        totalDeployments: deployments.totalDeployments || 0,
        productionUrl: deployments.productionUrl,
        latestDeployment: deployments.deployments?.[0] || null,
      });

      setLoading(false);
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        setError((err as { message: string }).message);
      } else {
        setError('Unknown error');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-corporate-gold mx-auto mb-4"></div>
          <p className="text-corporate-silver">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
        <p className="text-red-300 font-bold mb-2">Dashboard Error</p>
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-bold transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-corporate-gold">
          Production Dashboard
        </h2>
        <button
          onClick={fetchDashboardData}
          className="px-3 py-1.5 bg-corporate-navy border border-corporate-steel rounded text-sm hover:border-corporate-gold transition"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="System Status" value={stats.systemStatus} icon="🟢" />
        <StatCard title="Uptime" value={stats.uptime} icon="⏱️" />
        <StatCard
          title="Memory"
          value={stats.memoryUsed}
          unit={`/ ${stats.memoryTotal} MB`}
          icon="💾"
        />
        <StatCard title="Deployments" value={stats.totalDeployments} icon="🚀" />
      </div>

      {/* Visitor Analytics */}
      <div>
        <h3 className="text-lg font-heading font-bold text-white mb-3">Visitor Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Visitors" value={stats.totalVisitors} icon="👥" />
          <StatCard title="Last 24 Hours" value={stats.visitors24h} icon="📊" />
          <StatCard title="Last 7 Days" value={stats.visitors7d} icon="📈" />
          <StatCard title="Unique (24h)" value={stats.unique24h} icon="✨" />
        </div>
      </div>

      {/* Top Pages */}
      {stats.topPages.length > 0 && (
        <div className="bg-corporate-navy border border-corporate-steel rounded-lg p-4">
          <h4 className="text-sm font-bold text-corporate-gold mb-3">Top Pages</h4>
          <div className="space-y-2">
            {stats.topPages.map((page, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-white font-mono truncate">{page.path}</span>
                <span className="text-corporate-silver ml-2">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales & Revenue */}
      <div>
        <h3 className="text-lg font-heading font-bold text-white mb-3">Sales & Revenue</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`$${stats.revenueTotal.toFixed(2)}`} icon="💰" />
          <StatCard title="Revenue (7d)" value={`$${stats.revenue7d.toFixed(2)}`} icon="📊" />
          <StatCard title="Revenue (24h)" value={`$${stats.revenue24h.toFixed(2)}`} icon="💵" />
          <StatCard title="Sales (24h)" value={stats.sales24h} icon="🛒" />
        </div>
      </div>

      {/* Top Products */}
      {stats.topProducts.length > 0 && (
        <div className="bg-corporate-navy border border-corporate-steel rounded-lg p-4">
          <h4 className="text-sm font-bold text-corporate-gold mb-3">Top Products</h4>
          <div className="space-y-2">
            {stats.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-white">{product.product}</span>
                <div className="flex items-center gap-3">
                  <span className="text-corporate-silver">{product.count} sold</span>
                  <span className="text-corporate-gold font-bold">
                    ${product.revenue.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Deployment */}
      {stats.latestDeployment && (
        <div className="bg-corporate-navy border border-corporate-steel rounded-lg p-4">
          <h4 className="text-sm font-bold text-corporate-gold mb-3">Latest Deployment</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-corporate-silver">Status:</span>
              <span className="text-white font-bold">{stats.latestDeployment.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-corporate-silver">URL:</span>
              <a
                href={`https://${stats.latestDeployment.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-corporate-gold hover:underline font-mono text-xs"
              >
                {stats.latestDeployment.url}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-corporate-silver">Deployed:</span>
              <span className="text-white">
                {new Date(stats.latestDeployment.created).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Production URL */}
      {stats.productionUrl && (
        <div className="bg-corporate-navy border border-corporate-gold rounded-lg p-4 text-center">
          <p className="text-corporate-silver text-sm mb-2">Production Site</p>
          <a
            href={`https://${stats.productionUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-corporate-gold hover:text-white font-bold text-lg transition"
          >
            {stats.productionUrl}
          </a>
        </div>
      )}
    </div>
  );
}

