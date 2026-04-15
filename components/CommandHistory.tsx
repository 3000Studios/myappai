// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';

interface Task {
  id: string;
  command: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: string;
  timestamp: number;
}

interface CommandHistoryProps {
  tasks: Task[];
}

export default function CommandHistory({ tasks }: CommandHistoryProps) {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-500';
      case 'running':
        return 'bg-blue-500 animate-pulse';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'queued':
        return '⏳';
      case 'running':
        return '⚡';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-4xl mb-2">🎯</p>
        <p>No commands yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-3 bg-black/30 border border-gray-800 rounded-lg hover:border-purple-500/30 transition-colors"
        >
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(task.status)}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getStatusIcon(task.status)}</span>
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(task.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-white font-medium break-words">{task.command}</p>
              {task.result && (
                <p className="text-xs text-gray-400 mt-2 break-words">{task.result}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

