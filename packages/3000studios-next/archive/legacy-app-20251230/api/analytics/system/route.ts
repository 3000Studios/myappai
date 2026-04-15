// Copyright (c) 2025 NAME.
// All rights reserved.

import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  try {
    const uptime = Date.now() - startTime;
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

    // Server memory usage
    const memoryUsage = process.memoryUsage();
    const memoryMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };

    // Environment info
    const environment = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      env: process.env.NODE_ENV || "development",
    };

    return NextResponse.json({
      status: "Online",
      uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      uptimeMs: uptime,
      memory: memoryMB,
      environment,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error"), status: "Error" },
      { status: 500 },
    );
  }
}

