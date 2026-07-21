import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";
import { assertApiSuccess } from "@/lib/api/server";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth/session";

function getTokenFromUrl(request) {
  const searchParams = new URL(request.url).searchParams;
  return (
    searchParams.get("token") ||
    searchParams.get("santum_token") ||
    searchParams.get("pwa_token") ||
    ""
  ).trim();
}

async function validateSantumToken(token) {
  assertApiSuccess(
    await apiFetch("/v1/user/profile/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    "Unable to verify Santum session",
  );
}

export async function GET(request) {
  const token = getTokenFromUrl(request);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || request.url;
  const loginUrl = new URL("/lets-you-in", siteUrl);

  if (!token) {
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  try {
    await validateSantumToken(token);
  } catch {
    loginUrl.searchParams.set("error", "invalid_santum_token");
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("Cache-Control", "no-store");
    return clearAuthCookie(response);
  }

  const response = NextResponse.redirect(new URL("/home", siteUrl));
  response.headers.set("Cache-Control", "no-store");

  return setAuthCookie(response, token);
}
