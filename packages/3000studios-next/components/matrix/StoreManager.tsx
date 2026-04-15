'use client';

import { useState } from 'react';

export default function StoreManager() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const products = JSON.parse(text);

      const res = await fetch('/api/store/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });

      if (res.ok) {
        alert('Products imported successfully!');
      } else {
        alert('Import failed');
      }
    } catch (error: unknown) {
      alert('Error: ' + String(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border shadow-2xl bg-black/60 backdrop-blur-xl border-yellow-500/30 rounded-xl">
      <h2 className="mb-4 text-3xl font-bold text-yellow-500">Store Manager</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-400">Import Products (JSON)</label>
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-3 text-white border border-gray-600 rounded-lg bg-black/50"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full p-4 font-bold text-black transition rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'IMPORTING...' : 'IMPORT PRODUCTS'}
      </button>

      <div className="p-4 mt-4 border border-gray-700 rounded-lg bg-black/50">
        <p className="text-sm text-gray-400">Total Products: 0</p>
        <p className="text-sm text-gray-400">Revenue Today: $0</p>
      </div>
    </div>
  );
}

