/**
 * Quick Actions Component
 * One-click AI-powered commands
 */

'use client';

export default function QuickActions() {
  const runAction = async (cmd: string) => {
    try {
      await fetch('/api/shadow/edit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spoken: cmd }),
      });
      alert(`✅ Action executed: ${cmd}`);
    } catch (error: unknown) {
      alert('❌ Action failed');
    }
  };

  const actions = [
    { label: '🚀 Deploy Now', cmd: 'deploy the site to vercel immediately' },
    { label: '🎨 Dark Lux Theme', cmd: 'apply dark luxury theme globally' },
    { label: '🛒 Refresh Store', cmd: 'update all product data' },
    { label: '🔧 Fix Errors', cmd: 'scan and auto fix all code errors' },
    { label: '📊 Generate Report', cmd: 'create analytics report' },
    { label: '🔄 Full Sync', cmd: 'sync all modules with deployment' },
  ];

  return (
    <div className="bg-black/40 p-6 rounded-xl border-2 border-gold">
      <h2 className="text-3xl font-bold text-gold mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => runAction(action.cmd)}
            className="px-4 py-3 bg-gradient-to-r from-gold to-yellow-600 text-black rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

