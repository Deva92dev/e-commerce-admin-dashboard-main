import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/products(.*)",
  "/contact",
  "/api/collections(.*)",
  "/api/products(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/orders(.*)"]);

export default clerkMiddleware((auth, req) => {
  const userId = auth().userId;
  const isAdminUser = userId === process.env.ADMIN_USER_ID!;
  // console.log("Logged in user ID:", userId);
  // console.log("Request URL:", req.url);
  // console.log("Request Method:", req.method);
  // console.log("Is Admin User:", isAdminUser);
  // console.log("Admin user ID from .env:", process.env.ADMIN_USER_ID);

  if (isPublicRoute(req) && req.method === "GET") {
    console.log("Public GET route allowed");
    return NextResponse.next();
  }

  // Allow access to admin routes only for the admin user
  if (isAdminRoute(req)) {
    if (isAdminUser) {
      console.log("Admin route accessed by admin user");
      return NextResponse.next();
    } else {
      console.log("Admin route access denied for non-admin user");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect the route if it's not public or if the method is not GET
  auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
