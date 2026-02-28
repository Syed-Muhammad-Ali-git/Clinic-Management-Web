import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const protectedPaths = ['/dashboard', '/patients', '/appointments', '/prescriptions'];
  const pathname = req.nextUrl.pathname;

  const shouldProtect = protectedPaths.some(p => pathname.startsWith(p));
  if (!shouldProtect) return NextResponse.next();

  const token = req.cookies.get('token')?.value || null;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/patients/:path*', '/appointments/:path*', '/prescriptions/:path*'],
};
