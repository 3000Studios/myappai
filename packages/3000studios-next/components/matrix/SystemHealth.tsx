/**
 * System Health Component
 * Monitors all critical systems
 */

'use client';

import { useEffect, useState } from 'react';

export default function SystemHealth() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/matrix/health');
        const data = await res.json();
        setHealth(data);
      } catch (error: unknown) {
        console.error("", error);
      }
    };

    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!health) {
    return (
      <div className="bg-black/40 p-6 rounded-xl border-2 border-indigo-600">
        <h2 className="text-3xl font-bold text-indigo-300">System Health</h2>
        <p className="text-indigo-400 mt-4">Checking...</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 p-6 rounded-xl border-2 border-indigo-600">
      <h2 className="text-3xl font-bold text-indigo-300 mb-4">System Health</h2>

      <ul className="space-y-3">
        {Object.entries(health).map(([key, value]: any, i) => (
          <li key={i} className="flex justify-between items-center border-b border-indigo-900 pb-2">
            <span className="text-lg capitalize">{key.replace(/_/g, ' ')}</span>
            <span
              className={`font-bold px-3 py-1 rounded ${
                value === 'ok' || value === true
                  ? 'bg-green-500 text-black'
                  : 'bg-red-500 text-white'
              }`}
            >
              {value === 'ok' || value === true ? '✅ OK' : '❌ DOWN'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

