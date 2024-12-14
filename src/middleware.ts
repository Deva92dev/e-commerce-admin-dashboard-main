import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "../env";

const PUBLIC_ROUTES = [
  "/",
  "/products(.*)",
  "/contact",
  "/collection(.*)",
  "/api/(.*)",
];

const ADMIN_ROUTES = ["/admin(.*)"];

const isRouteMatch = (url: string, routes: string[]) =>
  routes.some((route) => new RegExp(`^${route}$`).test(url));

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  if (isRouteMatch(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  if (isRouteMatch(pathname, ADMIN_ROUTES)) {
    const isAdminUser = userId === env.ADMIN_USER_ID!;

    if (!isAdminUser) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
