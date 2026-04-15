import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy: Guard authenticated areas (admin, vip, matrix).
 * Migrated from middleware to proxy for Next.js 16+.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') || pathname.startsWith('/vip')) {
    if (pathname === '/admin/login' || pathname === '/login') {
      return NextResponse.next();
    }

    const adminSession = request.cookies.get('app_session')?.value;
    const legacyAdmin = request.cookies.get('admin')?.value;
    if (!adminSession && !legacyAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/matrix')) {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vip/:path*', '/matrix/:path*'],
};

