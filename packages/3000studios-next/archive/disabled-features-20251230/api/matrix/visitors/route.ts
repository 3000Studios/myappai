/**
 * Live Visitors API
 * Tracks and returns current visitor count
 */

import { getEventsByType } from "@/lib/matrix/analytics";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get recent visit events (last 5 minutes)
    const visitEvents = getEventsByType("visit", 100);
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    
    const recentVisits = visitEvents.filter(
      (event) => event.timestamp && event.timestamp > fiveMinutesAgo
    );

    // Extract unique locations
    const locations = visitEvents
      .filter((e) => e.city && e.country)
      .slice(0, 10)
      .map((e) => ({
        city: e.city,
        country: e.country,
        region: e.region,
      }));

    return NextResponse.json({
      ok: true,
      count: recentVisits.length,
      locations,
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json(
      { error: (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") || "Failed to fetch visitors" },
      { status: 500 }
    );
  }
}

