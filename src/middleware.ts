import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public and admin routes
const PUBLIC_ROUTES = [
  "/",
  "/products(.*)",
  "/contact",
  "/api/collections(.*)",
  "/api/products(.*)",
  "/api/orders(.*)",
  "/api/reviews(.*)",
  "/api/customers",
];

const ADMIN_ROUTES = ["/admin(.*)"];

// Helper function to match routes
const isRouteMatch = (url: string, routes: string[]) =>
  routes.some((route) => new RegExp(`^${route}$`).test(url));

// Middleware function
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Handle public routes
  if (isRouteMatch(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Handle admin routes
  if (isRouteMatch(pathname, ADMIN_ROUTES)) {
    const isAdminUser = userId === process.env.ADMIN_USER_ID;

    if (!isAdminUser) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
