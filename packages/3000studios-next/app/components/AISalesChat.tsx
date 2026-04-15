'use client';

import { useState } from 'react';

export default function AISalesChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-linear-to-r from-yellow-600 to-yellow-400 text-black px-6 py-3 rounded-full z-50 shadow-2xl font-bold hover:scale-105 transition-transform"
      >
        💬 Chat with AI
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-black/95 backdrop-blur-xl border border-yellow-500/30 rounded-lg z-50 shadow-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">AI Sales Assistant</h3>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              ✕
            </button>
          </div>

          <div className="text-gray-400 text-sm space-y-4">
            <p>👋 Hi! I can help you with:</p>
            <ul className="space-y-2 ml-4">
              <li>• Upgrade to Pro</li>
              <li>• Custom services</li>
              <li>• Premium products</li>
              <li>• Support & questions</li>
            </ul>
            <button className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
              Start Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
}

