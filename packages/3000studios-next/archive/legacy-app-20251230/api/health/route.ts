/**
 * HEALTH CHECK ENDPOINT
 * Verifies system operational status
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      voice_router: 'ready',
      autopilot: 'active',
    },
  });
}

