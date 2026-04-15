// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';

import { useState, useRef, useEffect } from 'react';

export default function AIChatBox() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(
    []
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/shadow/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: userMessage }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.interpretation || data.result || 'Command executed successfully',
        },
      ]);
    } catch (error: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error: Unable to process command',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-corporate-navy border border-corporate-steel rounded-lg p-4 h-[400px] flex flex-col">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-corporate-steel">
        <svg
          className="w-5 h-5 text-corporate-gold"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <h3 className="font-heading font-semibold text-corporate-gold">AI Command Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto mb-3 space-y-2 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-corporate-silver text-sm text-center py-8">
            Type a command or question...
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded text-sm ${
              msg.role === 'user'
                ? 'bg-corporate-steel text-white ml-8'
                : 'bg-corporate-charcoal text-corporate-silver mr-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-corporate-silver text-sm p-3">
            <span className="animate-pulse">Processing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything or give commands..."
          className="flex-1 bg-corporate-charcoal border border-corporate-steel rounded px-3 py-2 text-sm text-white placeholder-corporate-silver focus:outline-none focus:border-corporate-gold"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-gold-gradient text-corporate-navy px-4 py-2 rounded font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

