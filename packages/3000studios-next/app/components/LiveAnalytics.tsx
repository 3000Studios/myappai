/**
 * Live Analytics Component
 * Real-time visitor analytics and site metrics for THE MATRIX admin dashboard
 * Features: Live visitor count, page views, realtime events
 */

'use client';

import { useState, useEffect } from 'react';
import { Users, Eye, Activity, TrendingUp, Globe, Zap } from 'lucide-react';

interface AnalyticsData {
  liveVisitors: number;
  todayViews: number;
  activePages: { page: string; count: number }[];
  recentEvents: { type: string; timestamp: Date; details: string }[];
}

export default function LiveAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    liveVisitors: 0,
    todayViews: 0,
    activePages: [],
    recentEvents: [],
  });

  useEffect(() => {
    // Simulate live analytics data
    // TODO: In production, connect to real analytics service (Google Analytics, Vercel Analytics, etc.)
    const updateAnalytics = () => {
      setAnalytics({
        liveVisitors: Math.floor(Math.random() * 50) + 10,
        todayViews: Math.floor(Math.random() * 1000) + 500,
        activePages: [
          { page: '/store', count: Math.floor(Math.random() * 20) + 5 },
          { page: '/', count: Math.floor(Math.random() * 15) + 3 },
          { page: '/projects', count: Math.floor(Math.random() * 10) + 2 },
          { page: '/live', count: Math.floor(Math.random() * 8) + 1 },
        ].sort((a, b) => b.count - a.count),
        recentEvents: [
          {
            type: 'page_view',
            timestamp: new Date(Date.now() - Math.random() * 60000),
            details: 'User viewed /store',
          },
          {
            type: 'purchase',
            timestamp: new Date(Date.now() - Math.random() * 120000),
            details: 'Product purchased - $99.99',
          },
          {
            type: 'signup',
            timestamp: new Date(Date.now() - Math.random() * 180000),
            details: 'New user registered',
          },
          {
            type: 'page_view',
            timestamp: new Date(Date.now() - Math.random() * 240000),
            details: 'User viewed /projects',
          },
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      });
    };

    updateAnalytics();
    const interval = setInterval(updateAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="text-gold" size={28} />
          Live Analytics
          <span className="text-xs text-gray-500 font-normal ml-2">(Demo Data)</span>
        </h2>
        <div className="flex items-center gap-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">LIVE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Live Visitors */}
        <div className="card bg-gradient-to-br from-gold/10 to-transparent border-gold/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Live Visitors</p>
              <p className="text-4xl font-bold text-white">{analytics.liveVisitors}</p>
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                +12% vs yesterday
              </p>
            </div>
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
              <Users className="text-gold" size={32} />
            </div>
          </div>
        </div>

        {/* Today's Views */}
        <div className="card bg-gradient-to-br from-sapphire/10 to-transparent border-sapphire/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Today's Views</p>
              <p className="text-4xl font-bold text-white">
                {analytics.todayViews.toLocaleString()}
              </p>
              <p className="text-sapphire text-xs mt-1 flex items-center gap-1">
                <Eye size={12} />
                Peak: 1,247
              </p>
            </div>
            <div className="w-16 h-16 bg-sapphire/20 rounded-full flex items-center justify-center">
              <Eye className="text-sapphire" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Active Pages */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="text-gold" size={20} />
          Most Active Pages
        </h3>
        <div className="space-y-3">
          {analytics.activePages.map((page, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{page.page}</span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{page.count} active</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-sapphire rounded-full transition-all duration-500"
                    style={{ width: `${(page.count / analytics.activePages[0]?.count) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="text-gold" size={20} />
          Recent Events
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.recentEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  event.type === 'purchase'
                    ? 'bg-gold'
                    : event.type === 'signup'
                      ? 'bg-sapphire'
                      : 'bg-gray-500'
                }`}
              ></div>
              <div className="flex-1">
                <p className="text-white text-sm">{event.details}</p>
                <p className="text-gray-500 text-xs mt-1">{formatTime(event.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

