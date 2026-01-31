/**
 * Next.js Middleware
 * ==================
 * Protects admin routes and refreshes auth tokens
 *
 * COMING SOON MODE: Set to true to redirect all public routes to /coming-soon
 */

import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// ============================================================================
// COMING SOON MODE - Set to false when ready to launch
// ============================================================================
const COMING_SOON_MODE = false;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/brand') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ============================================================================
  // COMING SOON MODE - Redirect all public routes
  // ============================================================================
  if (COMING_SOON_MODE) {
    // Check for preview bypass cookie
    const previewCookie = request.cookies.get('site_preview');
    const hasPreviewAccess = previewCookie?.value === 'authorized';

    // Allow these routes through:
    // - /admin/* (admin panel)
    // - /api/* (API routes)
    // - /coming-soon (the coming soon page itself)
    // - /preview/* (preview pages with demo-v2 images)
    // - /demo* (demo pages for filter testing)
    const allowedPaths = ['/admin', '/api', '/coming-soon', '/preview', '/demo'];
    const isAllowed = allowedPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (!isAllowed && !hasPreviewAccess) {
      // Redirect everything else to coming soon
      return NextResponse.redirect(new URL('/coming-soon', request.url));
    }
  }

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      const { supabaseResponse, user } = await updateSession(request);

      // If already logged in, redirect to dashboard
      if (user) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      return supabaseResponse;
    }

    // Protect all other admin routes
    const { supabaseResponse, user } = await updateSession(request);

    if (!user) {
      // Not authenticated - redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  }

  // For non-admin routes, just update session (for any future auth needs)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
