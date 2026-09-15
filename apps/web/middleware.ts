import { NextResponse, type NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Backward Compatibility: Redirect misspelled archive route ─────────────
  if (pathname === '/admin/archieve' || pathname.startsWith('/admin/archieve/')) {
    const newPath = pathname.replace('/admin/archieve', '/admin/archive');
    return NextResponse.redirect(new URL(newPath, request.url), 308);
  }

  // ── Admin Route Protection Guard ──────────────────────────────────────────
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin-log';
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      if (isAdminApi) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized: Administrator authentication required.',
          },
          { status: 401 }
        );
      }

      // Page request -> Redirect to login page
      const loginUrl = new URL('/admin-log', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Security Headers ──────────────────────────────────────────────────────
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
