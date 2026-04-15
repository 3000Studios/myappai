'use client';

import { useState } from 'react';

export default function Editor() {
  const [route, setRoute] = useState('about');
  const [jsx, setJsx] = useState('');

  const save = async () => {
    const res = await fetch('/api/voice/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ route, jsx }),
    });

    const data = await res.json();
    if (data.ok) {
      alert(`Page ${route} updated successfully!`);
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Live Page Editor</h1>

      <div className="mb-4">
        <label className="block text-gray-400 mb-2">Page Route:</label>
        <input
          type="text"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded"
          placeholder="e.g., about, store, portfolio"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-400 mb-2">JSX Code:</label>
        <textarea
          value={jsx}
          onChange={(e) => setJsx(e.target.value)}
          className="w-full h-96 bg-black border border-gray-700 text-green-400 px-4 py-2 rounded font-mono"
          placeholder="export default function Page() { return <div>Content</div> }"
        />
      </div>

      <button
        onClick={save}
        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition-colors"
      >
        Update Page Live
      </button>
    </div>
  );
}


