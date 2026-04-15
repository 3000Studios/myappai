/**
 * Analytics API Route
 * Returns real-time analytics data from MongoDB
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getAnalytics } from '@/lib/services/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = (searchParams.get('timeRange') as 'day' | 'week' | 'month') || 'day';

    // Get dashboard statistics
    const stats = await getDashboardStats();

    // Get detailed analytics for the time range
    const analytics = await getAnalytics(timeRange);

    return NextResponse.json({
      success: true,
      stats,
      analytics,
      timeRange,
    });
  } catch (error: unknown) {
    console.error('', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}



