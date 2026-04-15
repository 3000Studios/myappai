'use client';

import { useState } from 'react';

export default function Builder() {
  const [html, setHTML] = useState('');

  async function push() {
    await fetch('/api/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'injectHTML',
        html,
      }),
    });
    alert('Injected live!');
  }

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-white">Live Page Builder</h1>
      <p className="text-gray-400 mb-6">Write HTML and inject it live into any page</p>

      <textarea
        className="w-full h-64 bg-black text-green-400 p-4 font-mono border border-green-500/30 rounded-lg"
        placeholder="<div>Your HTML here...</div>"
        onChange={(e) => setHTML(e.target.value)}
      />

      <button
        onClick={push}
        className="mt-4 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors"
      >
        Inject Live
      </button>
    </div>
  );
}


