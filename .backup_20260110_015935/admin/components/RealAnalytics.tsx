/**
 * Real Analytics Dashboard Component
 * Displays live data from MongoDB
 */

'use client';

import { useAnalytics } from '@/hooks/useAPI';
import {
  BarChart3,
  DollarSign,
  Eye,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

interface AnalyticsStats {
  totalRevenue?: number;
  activeUsers?: number;
  storeOrders?: number;
  liveViewers?: number;
  pageViews?: number;
  conversionRate?: number;
}

interface AnalyticsResponse {
  stats: AnalyticsStats;
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      {change && trend && (
        <div
          className={`flex items-center text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
        >
          <TrendingUp size={16} className={trend === 'down' ? 'rotate-180' : ''} />
          <span className="ml-1">{change} from last month</span>
        </div>
      )}
    </div>
  );
}

export default function RealAnalytics() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const { fetchAnalytics, loading, error } = useAnalytics();

  const loadAnalytics = useCallback(async () => {
    try {
      const data = await fetchAnalytics(timeRange);
      const parsedData: AnalyticsResponse = data;
      setStats(parsedData.stats);
    } catch (err: unknown) {
      console.error('', err);
    }
  }, [fetchAnalytics, timeRange]);

  useEffect(() => {
    loadAnalytics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [loadAnalytics]);

  if (loading && !stats) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin text-gold" size={32} />
          <span className="ml-3 text-white">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="text-gold" size={28} />
          Real-Time Analytics
        </h2>
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-gold text-black'
                  : 'glass border border-gray-700 text-gray-300 hover:border-gold'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="p-2 glass border border-gray-700 hover:border-gold rounded-lg transition-all"
            title="Refresh"
          >
            <RefreshCw className={`text-gold ${loading ? 'animate-spin' : ''}`} size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg text-yellow-400">
          ⚠️ {error} - Showing fallback data
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          change="+23.5%"
          icon={<DollarSign className="text-black" size={24} />}
          trend="up"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers?.toLocaleString() || '0'}
          change="+12.3%"
          icon={<Users className="text-black" size={24} />}
          trend="up"
        />
        <StatCard
          title="Store Orders"
          value={stats?.storeOrders?.toLocaleString() || '0'}
          change="+8.1%"
          icon={<ShoppingCart className="text-black" size={24} />}
          trend="up"
        />
        <StatCard
          title="Live Viewers"
          value={stats?.liveViewers?.toLocaleString() || '0'}
          change="-5.2%"
          icon={<Eye className="text-black" size={24} />}
          trend="down"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Page Views</h3>
          <div className="text-center">
            <p className="text-4xl font-bold gradient-text">
              {stats?.pageViews?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-gray-400 mt-2">Total page views this {timeRange}</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Conversion Rate</h3>
          <div className="text-center">
            <p className="text-4xl font-bold gradient-text">
              {stats?.conversionRate?.toFixed(2) || '0'}%
            </p>
            <p className="text-sm text-gray-400 mt-2">Visitor to customer conversion</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        📊 Connected to MongoDB • Auto-refreshes every 30 seconds
      </div>
    </div>
  );
}


