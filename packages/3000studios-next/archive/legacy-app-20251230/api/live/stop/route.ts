import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In production, stop the actual stream with your provider

  return NextResponse.json({
    success: true,
    message: 'Stream stopped successfully',
  });
}

