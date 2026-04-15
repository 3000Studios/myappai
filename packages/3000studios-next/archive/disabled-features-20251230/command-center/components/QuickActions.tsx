// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { label: "🚀 Deploy", command: "deploy site" },
    { label: "🔧 Fix", command: "fix my site" },
    { label: "✨ Update Hero", command: "update hero section" },
    { label: "📊 Status", command: "check status" },
    { label: "📈 SEO", command: "boost SEO" },
    { label: "📝 Content", command: "generate content" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => onAction(action.command)}
          className="px-4 py-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg font-bold hover:scale-105 hover:border-purple-500 transition-all text-sm"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

