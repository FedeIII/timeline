import { NextResponse } from 'next/server';

function isAuthenticated(request) {
  const oauth2_token = request.cookies.get(process.env.OAUTH_COOKIE)?.value;
  return !!oauth2_token;
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  if (isAuthenticated(request)) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/', '/projects/:path*', '/create-project'],
};
