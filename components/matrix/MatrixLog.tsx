/**
 * Matrix Log Component
 * Real-time event timeline
 */

'use client';

import { useEffect, useState } from 'react';

export default function MatrixLog() {
  const [events, setEvents] = useState<any[]>([]);

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
    const interval = setInterval(fetchEvents, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 p-8 rounded-xl border-2 border-purple-600">
      <h2 className="text-4xl font-bold text-purple-400 mb-6">🔮 Live System Log</h2>

      <div className="h-[400px] overflow-y-auto space-y-3 bg-black/50 p-4 rounded-xl border border-purple-900">
        {events.length === 0 ? (
          <p className="text-purple-300 text-center">No events yet...</p>
        ) : (
          events.map((event, i) => (
            <div key={i} className="text-sm bg-black/60 p-3 rounded border-l-4 border-purple-500">
              <div className="flex justify-between mb-1">
                <span className="text-purple-300 font-bold">{event.type}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <pre className="text-purple-200 text-xs overflow-x-auto">
                {JSON.stringify(event, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

