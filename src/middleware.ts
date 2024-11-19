import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/products(.*)",
  "/contact",
  "/api/collections(.*)",
  "/api/products(.*)",
  "/api/orders(.*)",
  "/api/reviews(.*)",
  "/api/customers",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();
  const isAdminUser = userId === process.env.ADMIN_USER_ID;
  const isGetRequest = req.method === "GET";

  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isPublicRoute(req) && !isGetRequest) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
