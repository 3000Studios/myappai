// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";
import { useState } from "react";

interface ShadowTerminalProps {
  onCommand?: (cmd: string) => void;
}

export default function ShadowTerminal({ onCommand }: ShadowTerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory((prev) => [...prev, `$ ${input}`]);
    onCommand?.(input);
    setInput("");
  };

  return (
    <div className="bg-black/90 border border-purple-500/30 rounded-lg p-4 font-mono text-sm">
      <div className="mb-4 max-h-64 overflow-y-auto space-y-1">
        {history.map((line, i) => (
          <div key={i} className="text-green-400">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-purple-400">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white"
          placeholder="Enter Shadow command..."
          autoFocus
        />
      </form>
    </div>
  );
}

