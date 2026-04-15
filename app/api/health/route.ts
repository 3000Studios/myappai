import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * PUBLIC HEALTH CHECK (NO AUTH)
 * Used to verify if the Vercel Firewall is blocking external bot traffic.
 */

export async function GET() {
  return NextResponse.json({
    status: 'Online',
    message: 'The gate is open. This route has no authentication.',
    timestamp: new Date().toISOString(),
  });
}

