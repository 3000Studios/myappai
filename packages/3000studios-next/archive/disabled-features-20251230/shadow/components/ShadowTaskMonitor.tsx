// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";

interface Task {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
}

interface ShadowTaskMonitorProps {
  tasks: Task[];
}

export default function ShadowTaskMonitor({ tasks }: ShadowTaskMonitorProps) {
  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "running":
        return "⚡";
      case "completed":
        return "✅";
      case "failed":
        return "❌";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "running":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      case "failed":
        return "text-red-400";
    }
  };

  return (
    <div className="bg-black/90 border border-purple-500/30 rounded-lg p-4">
      <h3 className="text-purple-400 font-bold mb-3 text-sm">Active Tasks</h3>
      {tasks.length === 0 ? (
        <div className="text-gray-500 text-xs">No active tasks</div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 text-xs">
              <span className="text-lg">{getStatusIcon(task.status)}</span>
              <span className={getStatusColor(task.status)}>{task.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

