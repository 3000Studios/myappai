// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';

import { Collaborator } from '@/types';

interface CollaboratorListProps {
  collaborators: Collaborator[];
  onRemove: (id: number) => void;
  isRemoving: number | null;
}

function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'admin':
      return 'from-red-600 to-orange-600';
    case 'editor':
      return 'from-blue-600 to-cyan-600';
    default:
      return 'from-gray-600 to-gray-500';
  }
}

export default function CollaboratorList({
  collaborators,
  onRemove,
  isRemoving,
}: CollaboratorListProps) {
  if (collaborators.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl text-center">
        <p className="text-gray-400">No collaborators yet. Add your first collaborator above.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-cyan-400">👥</span> Team Members
      </h2>

      <div className="space-y-3">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {collaborator.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{collaborator.name}</p>
                <p className="text-sm text-gray-400">{collaborator.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRoleBadgeColor(collaborator.role)} text-white`}
              >
                {collaborator.role}
              </span>
              <button
                onClick={() => onRemove(collaborator.id)}
                disabled={isRemoving === collaborator.id}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                title="Remove collaborator"
              >
                {isRemoving === collaborator.id ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

