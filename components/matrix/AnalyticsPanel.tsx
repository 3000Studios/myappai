/**
 * Analytics Panel Component
 * Real-time metrics dashboard
 */

'use client';

import { useShadowOS } from '@/lib/shadow/os/state';
import { useEffect, useState } from 'react';

interface EventData {
  id: string;
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export default function AnalyticsPanel() {
  const { liveVisitors, totalRevenue, aiCost } = useShadowOS();
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/matrix/events');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error: unknown) {
        console.error("", error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 3000);
    return () => clearInterval(interval);
  }, []);

  const traffic = events.filter((e) => e.type === 'visit').length;
  const sales = events.filter((e) => e.type === 'sale').length;
  const revenue = totalRevenue.toFixed(2);
  const cost = aiCost.toFixed(4);

  return (
    <div className="bg-black/40 p-6 rounded-xl border-2 border-sapphire shadow-xl">
      <h2 className="text-3xl font-bold text-sapphire mb-6">Live Analytics</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-black/60 rounded-xl border border-gold">
          <h3 className="text-lg text-gold mb-1">Traffic</h3>
          <p className="text-4xl font-black text-white">{traffic}</p>
        </div>

        <div className="p-4 bg-black/60 rounded-xl border border-green-500">
          <h3 className="text-lg text-green-400 mb-1">Sales</h3>
          <p className="text-4xl font-black text-white">{sales}</p>
        </div>

        <div className="p-4 bg-black/60 rounded-xl border border-gold">
          <h3 className="text-lg text-gold mb-1">Revenue</h3>
          <p className="text-4xl font-black text-white">${revenue}</p>
        </div>

        <div className="p-4 bg-black/60 rounded-xl border border-sapphire">
          <h3 className="text-lg text-sapphire mb-1">AI Cost</h3>
          <p className="text-4xl font-black text-white">${cost}</p>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        <p>🔴 Live • Updates every 3s</p>
      </div>
    </div>
  );
}

