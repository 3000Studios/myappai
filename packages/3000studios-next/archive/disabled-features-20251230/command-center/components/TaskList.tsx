// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";

interface Task {
  id: string;
  command: string;
  status: "queued" | "running" | "completed" | "failed";
  result?: string;
  timestamp: number;
}

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const getStatusBadge = (status: Task["status"]) => {
    const styles = {
      queued: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      running: "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse",
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      failed: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    return (
      <span
        className={`px-2 py-1 rounded border text-xs font-bold ${styles[status]}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No tasks yet</div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-black/30 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 font-mono">
                {new Date(task.timestamp).toLocaleTimeString()}
              </span>
              {getStatusBadge(task.status)}
            </div>
            <p className="text-white font-medium mb-2">{task.command}</p>
            {task.result && (
              <p className="text-xs text-gray-400 bg-black/50 p-2 rounded">
                {task.result}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

