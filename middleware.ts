import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/insights",
  "/keywords",
  "/competitors",
  "/local-seo",
  "/reports",
  "/admin",
  "/settings",
];
const ADMIN_PREFIXES = ["/admin"];

const DEMO_MODE = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== "false";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminRoute = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  // In demo mode, dashboard is open. Auth pages still redirect once signed in.
  if (DEMO_MODE) {
    if (isAuthRoute && session?.user) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isProtected && !session?.user) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|favicon.ico|robots.txt|sitemap.xml|og-image.png).*)",
  ],
};
