/**
 * Security Middleware
 * CORS, CSRF, input validation, and security headers
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS Configuration
 */
export const CORS_CONFIG = {
  allowedOrigins: [
    'https://3000studios.com',
    'https://www.3000studios.com',
    process.env.NEXT_PUBLIC_SITE_URL || '',
    ...(process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000', 'http://localhost:3001']
      : []),
  ].filter(Boolean),
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Apply CORS headers to response
 */
export function applyCORS(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin') || '';

  if (CORS_CONFIG.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', CORS_CONFIG.allowedMethods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', CORS_CONFIG.allowedHeaders.join(', '));
  response.headers.set('Access-Control-Allow-Credentials', CORS_CONFIG.credentials.toString());
  response.headers.set('Access-Control-Max-Age', CORS_CONFIG.maxAge.toString());

  return response;
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleCORSPreflight(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    return applyCORS(request, response);
  }
  return null;
}

/**
 * Security Headers
 * Implements OWASP recommended security headers
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS Protection (legacy but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.paypal.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://www.google-analytics.com https://api.paypal.com https://api.stripe.com wss:",
      "frame-src 'self' https://www.paypal.com https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://www.paypal.com",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ')
  );

  // Permissions Policy (formerly Feature Policy)
  response.headers.set(
    'Permissions-Policy',
    [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=(self)',
      'usb=()',
    ].join(', ')
  );

  // Strict-Transport-Security (HSTS) - Vercel handles this, but adding for completeness
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

/**
 * Validate request body against schema
 * Simple validation - for production use Zod or similar
 */
export function validateRequestBody(
  body: Record<string, unknown>,
  requiredFields: string[]
): string | null {
  if (!body || typeof body !== 'object') {
    return 'Invalid request body';
  }

  for (const field of requiredFields) {
    if (!(field in body)) {
      return `Missing required field: ${field}`;
    }
  }

  return null; // Valid
}

/**
 * CSRF Token Generation and Validation
 */
const CSRF_SECRET = process.env.CSRF_SECRET || 'change-me-in-production';

import { randomBytes } from 'crypto';

export function generateCSRFToken(sessionId: string): string {
  const timestamp = Date.now();
  const salt = randomBytes(16).toString('hex');
  const token = Buffer.from(`${sessionId}:${timestamp}:${salt}:${CSRF_SECRET}`).toString('base64');
  return token;
}

export function validateCSRFToken(token: string, sessionId: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [receivedSessionId, timestamp, secret] = decoded.split(':');

    // Validate session
    if (receivedSessionId !== sessionId) {
      return false;
    }

    // Validate secret
    if (secret !== CSRF_SECRET) {
      return false;
    }

    // Check expiration (1 hour)
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 3600000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  let sanitized = input;

  // Remove < and >
  sanitized = sanitized.replace(/[<>]/g, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove inline event handlers (apply repeatedly to avoid incomplete sanitization)
  let previous: string;
  do {
    previous = sanitized;
    sanitized = sanitized.replace(/on\w+=/gi, '');
  } while (sanitized !== previous);

  return sanitized.trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if request is from trusted origin
 */
export function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin') || '';
  return CORS_CONFIG.allowedOrigins.includes(origin) || origin === '';
}

/**
 * Middleware wrapper with security features
 */
export function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    cors?: boolean;
    csrf?: boolean;
    validateBody?: string[];
  } = {}
) {
  return async (request: NextRequest) => {
    // Handle CORS preflight
    if (options.cors !== false) {
      const preflightResponse = handleCORSPreflight(request);
      if (preflightResponse) {
        return applySecurityHeaders(preflightResponse);
      }
    }

    // Validate CSRF token for non-GET requests
    if (options.csrf && request.method !== 'GET') {
      const csrfToken = request.headers.get('X-CSRF-Token');
      const sessionId = request.cookies.get('session')?.value || '';

      if (!csrfToken || !validateCSRFToken(csrfToken, sessionId)) {
        return applySecurityHeaders(
          NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
        );
      }
    }

    // Validate request body
    if (options.validateBody && request.method !== 'GET') {
      try {
        const body = await request.json();
        const error = validateRequestBody(body, options.validateBody);
        if (error) {
          return applySecurityHeaders(NextResponse.json({ error }, { status: 400 }));
        }
      } catch {
        return applySecurityHeaders(
          NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
        );
      }
    }

    // Execute handler
    const response = await handler(request);

    // Apply security headers
    let securedResponse = applySecurityHeaders(response);

    // Apply CORS headers
    if (options.cors !== false) {
      securedResponse = applyCORS(request, securedResponse);
    }

    return securedResponse;
  };
}

