/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis for production with multiple instances)
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

// Preset configurations
export const RATE_LIMITS = {
  strict: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 req/min
  standard: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 req/min
  relaxed: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 req/min
  api: { windowMs: 60 * 1000, maxRequests: 30 }, // 30 req/min for API
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 req/15min for auth
  payment: { windowMs: 5 * 60 * 1000, maxRequests: 3 }, // 3 req/5min for payments
};

/**
 * Get client identifier from request
 * Uses X-Forwarded-For header (Vercel provides this) or IP
 */
function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

/**
 * Clean up expired entries (runs every minute)
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Schedule cleanup
setInterval(cleanupExpiredEntries, 60 * 1000);

/**
 * Rate limit middleware
 * Returns null if request is allowed, or NextResponse with 429 status if rate limited
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.standard
): NextResponse | null {
  const clientId = getClientId(request);
  const key = `${clientId}:${request.nextUrl.pathname}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null; // Allow request
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);

    console.warn(`⚠️ Rate limit exceeded for ${clientId} on ${request.nextUrl.pathname}`);

    return NextResponse.json(
      {
        error: config.message || 'Too many requests',
        retryAfter: resetIn,
      },
      {
        status: 429,
        headers: {
          'Retry-After': resetIn.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        },
      }
    );
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return null; // Allow request
}

/**
 * Get rate limit info for response headers
 */
export function getRateLimitHeaders(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.standard
): Record<string, string> {
  const clientId = getClientId(request);
  const key = `${clientId}:${request.nextUrl.pathname}`;
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': config.maxRequests.toString(),
    };
  }

  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': Math.max(0, config.maxRequests - entry.count).toString(),
    'X-RateLimit-Reset': entry.resetTime.toString(),
  };
}

/**
 * Middleware wrapper for API routes
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (request: NextRequest) => {
    const rateLimitResponse = rateLimit(request, config);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const response = await handler(request);

    // Add rate limit headers to successful responses
    const headers = getRateLimitHeaders(request, config);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

