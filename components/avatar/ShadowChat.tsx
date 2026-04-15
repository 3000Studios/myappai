/**
 * Shadow Chat Component
 * Interactive chat interface with Shadow PRIME
 */

'use client';

import { useShadowOS } from '@/lib/shadow/os/state';
import { useState } from 'react';

export default function ShadowChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateEmotion } = useShadowOS();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/shadow/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, role: 'visitor' }),
      });

      const data = await res.json();

      if (data.ok) {
        setMessages((prev) => [...prev, { role: 'shadow', text: data.text }]);

        // Update avatar emotion
        updateEmotion(data.avatar.emotion, data.avatar.intensity);
      }
    } catch (error: unknown) {
      console.error("", error);
      setMessages((prev) => [
        ...prev,
        { role: 'shadow', text: 'Yo, my circuits just glitched. Try again?' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-black/60 backdrop-blur-xl border-2 border-sapphire rounded-xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-sapphire mb-4">💬 Chat with Shadow PRIME</h3>

        <div className="h-[300px] overflow-y-auto mb-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Start a conversation...</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-gold/20 text-white ml-10'
                    : 'bg-sapphire/20 text-sapphire mr-10'
                }`}
              >
                <p className="text-sm font-bold mb-1">
                  {msg.role === 'user' ? 'You' : 'Shadow PRIME'}
                </p>
                <p>{msg.text}</p>
              </div>
            ))
          )}
          {loading && (
            <div className="text-sapphire text-center animate-pulse">Shadow is thinking...</div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Say something to Shadow..."
            className="flex-1 p-3 bg-black/60 border border-sapphire rounded-lg text-white focus:outline-none focus:border-gold"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-600 text-black font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

