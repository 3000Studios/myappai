/**
 * Environment Variables Check API
 *
 * This endpoint allows you to verify that environment variables
 * are properly configured in the deployed environment.
 *
 * Usage: Visit https://3000studios.com/api/env-check after deployment
 *
 * Returns:
 * - NEXT_PUBLIC_SITE_URL: The configured site URL (or null if missing)
 * - NODE_ENV: Current Node environment
 * - ok: Boolean indicating if NEXT_PUBLIC_SITE_URL is set
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const nodeEnv = process.env.NODE_ENV;

  return NextResponse.json({
    NEXT_PUBLIC_SITE_URL: siteUrl ?? null,
    NODE_ENV: nodeEnv ?? 'unknown',
    ok: Boolean(siteUrl),
    timestamp: new Date().toISOString(),
    message: siteUrl
      ? '✅ Environment variables are configured correctly'
      : '❌ NEXT_PUBLIC_SITE_URL is missing',
  });
}

