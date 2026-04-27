import { NextResponse } from "next/server";

const AUTH_PAGE_PREFIXES = ["/sign-in", "/sign-up"];
const PROTECTED_PREFIXES = [
  "/home",
  "/verify-otp",
  "/personal-information",
  "/language",
  "/intrest",
  "/reasons",
  "/notification",
  "/create-pin",
  "/finger-scan",
  "/notifications",
  "/amigo-chat",
  "/plus-subscription",
  "/settings",
];

export function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const isAuthPage = AUTH_PAGE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

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
    "/reasons",
    "/notification",
    "/create-pin",
    "/finger-scan",
    "/notifications",
    "/amigo-chat",
    "/plus-subscription",
    "/settings/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
