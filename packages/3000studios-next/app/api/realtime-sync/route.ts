/**
 * Real-Time Sync API Route
 * Server-Sent Events endpoint for live deployment updates
 */

import { NextRequest } from 'next/server';
import { instantSync, batchSync, DeploymentEvent } from '@/lib/services/realtime-sync';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, filePath, content, commitMessage, files } = body;

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: DeploymentEvent) => {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        };

        try {
          let result;

          if (action === 'batch' && files) {
            // Batch sync multiple files
            result = await batchSync(files, commitMessage || 'Batch update', sendEvent);
          } else if (filePath && content) {
            // Single file sync
            result = await instantSync(
              filePath,
              content,
              commitMessage || 'Voice command update',
              sendEvent
            );
          } else {
            throw new Error('Invalid request: missing filePath/content or files array');
          }

          // Send final result
          const finalEvent: DeploymentEvent = {
            type: result.success ? 'deploy_complete' : 'deploy_error',
            data: {
              commitSha: result.commitSha,
              deploymentId: result.deploymentId,
              url: result.deploymentUrl,
              status: result.message,
            },
            timestamp: result.timestamp,
          };
          sendEvent(finalEvent);

          controller.close();
        } catch (error: unknown) {
          const errorEvent: DeploymentEvent = {
            type: 'deploy_error',
            data: {
              error:
                error instanceof Error
                  ? error instanceof Error
                    ? error instanceof Error
                      ? error.message
                      : 'Unknown error'
                    : 'Unknown error'
                  : 'Unknown error',
            },
            timestamp: Date.now(),
          };
          sendEvent(errorEvent);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process sync request',
        message:
          error instanceof Error
            ? error instanceof Error
              ? error instanceof Error
                ? error.message
                : 'Unknown error'
              : 'Unknown error'
            : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

