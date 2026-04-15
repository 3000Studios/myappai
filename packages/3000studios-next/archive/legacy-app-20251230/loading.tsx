// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl text-gray-300">Loading 3000 Studios...</p>
        <p className="text-sm text-gray-500 mt-2">
          Powering up the creative engine
        </p>
      </div>
    </div>
  );
}

