import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/patients', '/appointments', '/prescriptions'];
const PUBLIC_ONLY = ['/login', '/signup'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read token from multiple possible cookie names
  const token =
    req.cookies.get('token')?.value ||
    req.cookies.get('__session')?.value ||
    '';

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isPublicOnly = PUBLIC_ONLY.some(p => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup
  if (isPublicOnly && token) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patients/:path*',
    '/appointments/:path*',
    '/prescriptions/:path*',
    '/login',
    '/signup',
  ],
};
