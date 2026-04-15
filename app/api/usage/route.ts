import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await prisma.aIUsage.groupBy({
      by: ['model'],
      _sum: {
        tokens: true,
      },
      _avg: {
        latencyMs: true,
      },
    });

    const formattedStats = stats.map(
      (stat: {
        model: string;
        _sum: { tokens: number | null };
        _avg: { latencyMs: number | null };
      }) => ({
        model: stat.model,
        tokens: stat._sum.tokens || 0,
        avg_latency: Math.round(stat._avg.latencyMs || 0),
      })
    );

    return NextResponse.json(formattedStats);
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to fetch usage stats' }, { status: 500 });
  }
}

