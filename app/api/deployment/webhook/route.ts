/**
 * Deployment Webhook Handler
 * Receives deployment status updates from GitHub Actions and Vercel
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { status, branch, commit, timestamp, source } = body;

    console.log('📡 Deployment webhook received:', {
      status,
      branch,
      commit: commit?.substring(0, 7),
      timestamp,
      source: source || 'github-actions',
    });

    // In a production environment, you would:
    // 1. Broadcast this to connected WebSocket clients
    // 2. Store in database for history
    // 3. Trigger cache invalidation
    // 4. Send notifications

    // For now, just acknowledge receipt
    return NextResponse.json({
      success: true,
      message: 'Deployment webhook processed',
      received: {
        status,
        branch,
        timestamp: timestamp || new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET(_request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Deployment webhook endpoint',
    endpoints: {
      post: 'Receive deployment status updates',
      get: 'Webhook health check',
    },
  });
}

