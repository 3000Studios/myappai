// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";

interface ShadowConsoleProps {
  messages: Array<{
    type: "info" | "success" | "error" | "warning";
    text: string;
  }>;
}

export default function ShadowConsole({ messages }: ShadowConsoleProps) {
  const getColorClass = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      default:
        return "text-cyan-400";
    }
  };

  return (
    <div className="bg-black/90 border border-cyan-500/30 rounded-lg p-4 font-mono text-xs max-h-96 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="text-gray-500">System ready. Awaiting commands...</div>
      ) : (
        <div className="space-y-1">
          {messages.map((msg, i) => (
            <div key={i} className={getColorClass(msg.type)}>
              [{new Date().toLocaleTimeString()}] {msg.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

