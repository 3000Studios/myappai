import { NextResponse } from 'next/server';

// In-memory stream state (use Redis or database in production)
const streamState = {
  config: {
    status: 'offline',
    title: '3000 Studios Live',
    description: '',
    viewers: 0,
    streamUrl: '',
    streamKey: '',
  },
  health: {
    bitrate: 0,
    fps: 0,
    dropped: 0,
  },
};

export async function GET() {
  return NextResponse.json(streamState);
}

