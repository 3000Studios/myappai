// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-10 rounded-2xl max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-4 text-red-400">
          Something went wrong!
        </h1>
        <p className="text-gray-300 mb-6">
          {(error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

