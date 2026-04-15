/**
 * Streaming Stop API Route
 * Stops WebRTC broadcast
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { streamId } = body;

    if (!streamId) {
      return NextResponse.json({ error: 'Stream ID required' }, { status: 400 });
    }

    // In a real implementation:
    // 1. Update stream status in database
    // 2. Notify viewers via WebSocket
    // 3. Clean up TURN server resources

    return NextResponse.json({
      success: true,
      streamId,
      message: 'Stream stopped successfully',
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to stop stream' }, { status: 500 });
  }
}

