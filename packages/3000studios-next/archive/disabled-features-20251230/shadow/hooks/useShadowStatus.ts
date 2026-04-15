/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { useState, useEffect } from "react";

export function useShadowStatus() {
  const [status, setStatus] = useState<"Online" | "Offline">("Offline");
  const [queueInfo, setQueueInfo] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/shadow/system");
        const data = await res.json();
        setStatus(data.status);
        setQueueInfo(data.queue);
      } catch {
        setStatus("Offline");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { status, queueInfo };
}

