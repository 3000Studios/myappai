/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { useState, useCallback } from "react";

export function useShadowCommand() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (command: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shadow/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, user: "MrJWSwain", origin: "hook" }),
      });

      if (!res.ok) throw new Error("Command failed");

      const data = await res.json();
      return data;
    } catch (err: unknown) {
      setError((err instanceof Error ? (err instanceof Error ? err.message : "Unknown error") : "Unknown error"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

