/**
 * Live Visitors Component
 * Shows current site visitors
 */

'use client';

import { useEffect, useState } from 'react';

export default function LiveVisitors() {
  const [visitors, setVisitors] = useState(0);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await fetch('/api/matrix/visitors');
        const data = await res.json();
        setVisitors(data.count || 0);
        setLocations(data.locations || []);
      } catch (error: unknown) {
        console.error('Visitor Fetch Error:', error);
      }
    };

    fetchVisitors();
    const interval = setInterval(fetchVisitors, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 p-6 rounded-xl border-2 border-teal-500">
      <h2 className="text-3xl font-bold text-teal-300 mb-4">Visitors Online</h2>

      <div className="text-center mb-6">
        <p className="text-7xl font-black text-white animate-pulse">{visitors}</p>
        <p className="text-teal-400 mt-2">Active now</p>
      </div>

      {locations.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400 mb-3">Recent locations:</p>
          {locations.slice(0, 5).map((loc, i) => (
            <div
              key={i}
              className="flex justify-between text-sm text-teal-200 border-b border-teal-900 pb-2"
            >
              <span>{loc.city || 'Unknown'}</span>
              <span>{loc.country || '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

