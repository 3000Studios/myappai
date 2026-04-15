/**
 * Streaming Status API Route
 * Returns current stream status
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const streamId = searchParams.get('streamId');

    // In a real implementation, query database for stream status
    // For now, return mock data

    return NextResponse.json({
      success: true,
      streamId,
      isLive: false,
      viewerCount: 0,
      startedAt: null,
      title: 'No active stream',
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to get stream status' }, { status: 500 });
  }
}

