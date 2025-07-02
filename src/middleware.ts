import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get('session')?.value;

  const isAuthPage = pathname.startsWith('/auth');

  // If the user is trying to access an auth page
  if (isAuthPage) {
    if (sessionCookie) {
      // If they have a session cookie, they are likely logged in.
      // Redirect them to the home page.
      // We don't need to verify the cookie here, as an invalid one will be
      // caught on protected pages anyway. This is a simple UX improvement.
      return NextResponse.redirect(new URL('/', req.url));
    }
    // If no session cookie, let them access the auth page
    return NextResponse.next();
  }

  // For all other pages (protected routes)
  if (!sessionCookie) {
    // If no session cookie, redirect to sign-in
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
  // If a session cookie exists, we assume it's valid.
  // The verification should happen in your API routes or Server Components
  // that fetch sensitive data, to avoid hitting Firebase on every request.
  // This provides basic route protection. For high security, you would
  // verify it here on every navigation.

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};