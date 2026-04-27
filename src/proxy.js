import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up");

  const isProtected =
    req.nextUrl.pathname.startsWith("/home") ||
    req.nextUrl.pathname.startsWith("/verify-otp") ||
    req.nextUrl.pathname.startsWith("/personal-information") ||
    req.nextUrl.pathname.startsWith("/language") ||
    req.nextUrl.pathname.startsWith("/intrest");

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/verify-otp",
    "/personal-information",
    "/language",
    "/intrest",
    "/sign-in",
    "/sign-up",
  ],
};
