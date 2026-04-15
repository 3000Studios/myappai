// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';
import { useState, FormEvent } from 'react';

interface CommandConsoleProps {
  onExecute: (command: string) => void;
}

export default function CommandConsole({ onExecute }: CommandConsoleProps) {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onExecute(command);
      setCommand('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command... (e.g., 'update hero section with neon header')"
          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
            Enter
          </kbd>
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
      >
        Execute Command
      </button>
    </form>
  );
}

