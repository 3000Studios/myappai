// Copyright (c) 2025 NAME.
// All rights reserved.

import { NextResponse } from "next/server";

// Track visitor data in memory (production should use a database)
let visitorLog: Array<{
  timestamp: number;
  path: string;
  userAgent: string;
  ip?: string;
}> = [];

export async function POST(req: Request) {
  try {
    const { path, userAgent } = await req.json();
    const ip =
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");

    visitorLog.push({
      timestamp: Date.now(),
      path,
      userAgent,
      ip: ip || undefined,
    });

    // Keep only last 10,000 visits to prevent memory overflow
    if (visitorLog.length > 10000) {
      visitorLog = visitorLog.slice(-10000);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") }, { status: 500 });
  }
}

export async function GET() {
  try {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    const last7d = now - 7 * 24 * 60 * 60 * 1000;
    const last30d = now - 30 * 24 * 60 * 60 * 1000;

    const visitors24h = visitorLog.filter((v) => v.timestamp > last24h);
    const visitors7d = visitorLog.filter((v) => v.timestamp > last7d);
    const visitors30d = visitorLog.filter((v) => v.timestamp > last30d);

    // Calculate unique visitors by IP
    const uniqueIps24h = new Set(visitors24h.map((v) => v.ip).filter(Boolean));
    const uniqueIps7d = new Set(visitors7d.map((v) => v.ip).filter(Boolean));

    // Page views by path
    const pageViews: Record<string, number> = {};
    visitorLog.forEach((v) => {
      pageViews[v.path] = (pageViews[v.path] || 0) + 1;
    });

    // Top pages
    const topPages = Object.entries(pageViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, views: count }));

    return NextResponse.json({
      total: visitorLog.length,
      last24h: visitors24h.length,
      last7d: visitors7d.length,
      last30d: visitors30d.length,
      unique24h: uniqueIps24h.size,
      unique7d: uniqueIps7d.size,
      topPages,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") }, { status: 500 });
  }
}

