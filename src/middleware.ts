import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';

// Define which routes are protected
const isProtectedRoute = createRouteMatcher(['/admin(.*)']);

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher(['/:path*']);

// for admin user change later for client
const ADMIN_IDENTIFIER = 'buildwith92deva@gmail.com';

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();

  // Create a URL object from the current request URL
  const url = req.nextUrl.clone();

  // Allow access to public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Allow sign-up and sign-in pages to be accessed without authentication
  if (
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/sign-in')
  ) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to sign-in page
  if (!userId) {
    url.pathname = '/sign-in';
    url.searchParams.set('redirect_url', req.nextUrl.pathname); // Preserve the original destination
    return NextResponse.redirect(url);
  }

  // Check if the route is protected and if the user has the required permissions
  if (isProtectedRoute(req)) {
    // Get the user's email or check the user ID
    const user = await clerkClient.users.getUser(userId);
    const isAdmin =
      user.emailAddresses.some(
        (email) => email.emailAddress === ADMIN_IDENTIFIER
      ) || userId === ADMIN_IDENTIFIER;

    if (!isAdmin) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Proceed to the requested route if permissions are valid
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Apply middleware to the admin routes under dashboard
    '/dashboard/admin/:path*',
    // Apply middleware to API routes
    '/api/:path*',
    '/(api|trpc)(.*)',
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
