/**
 * Revenue Endpoint Alert API
 * Monitors revenue-generating endpoints and alerts on failure
 * FAILSAFE SYSTEM - Critical for business continuity
 */

import { NextRequest, NextResponse } from 'next/server';

interface EndpointStatus {
  endpoint: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastChecked: Date;
}

const REVENUE_ENDPOINTS = [
  '/api/paypal/create-order',
  '/api/products',
  '/api/analytics',
  '/api/auth/login',
];

export async function GET(request: NextRequest) {
  try {
    const results: EndpointStatus[] = [];

    for (const endpoint of REVENUE_ENDPOINTS) {
      const start = Date.now();
      try {
        const response = await fetch(`${request.nextUrl.origin}${endpoint}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'HealthCheck/1.0',
          },
        });

        const responseTime = Date.now() - start;
        const status = response.ok ? 'healthy' : 'down'; // Mark as down if not OK for simplicity/revenue critical

        results.push({
          endpoint,
          status,
          responseTime,
          lastChecked: new Date(),
        });

        if (!response.ok) {
          console.error(`Revenue endpoint ${endpoint} returned ${response.status}`);
        }
      } catch (err) {
        results.push({
          endpoint,
          status: 'down',
          responseTime: Date.now() - start,
          lastChecked: new Date(),
        });
        console.error(`Failed to reach ${endpoint}:`, err);
      }
    }

    const allHealthy = results.every((r) => r.status === 'healthy');
    const criticalDown = results.filter((r) => r.status === 'down');

    return NextResponse.json({
      success: true,
      healthy: allHealthy,
      endpoints: results,
      alerts: criticalDown.length > 0 ? `${criticalDown.length} critical endpoints down` : null,
    });
  } catch (error: unknown) {
    console.error('', error);
    return NextResponse.json({ error: 'Health check failed' }, { status: 500 });
  }
}
