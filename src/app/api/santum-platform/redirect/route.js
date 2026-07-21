import { NextResponse } from "next/server";

import { getAuthToken } from "@/lib/auth/session";

export async function GET(request) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.redirect(new URL("/lets-you-in", request.url));
  }

  const santumUrl = new URL("https://santum.net/");
  santumUrl.searchParams.set("pwa_token", token);

  const response = NextResponse.redirect(santumUrl);
  response.headers.set("Cache-Control", "no-store");

  return response;
}
