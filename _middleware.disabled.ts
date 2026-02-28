import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/patients', '/appointments', '/prescriptions', '/ai'];
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('clinic-auth-token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);
  const isRootPath = pathname === '/';

  if ((isProtectedRoute || isRootPath) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((isAuthRoute || isRootPath) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

