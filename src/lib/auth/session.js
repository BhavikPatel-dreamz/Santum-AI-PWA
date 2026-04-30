import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24;

function getCookieOptions(overrides = {}) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
    ...overrides,
  };
}

export function setAuthCookie(response, token) {
  response.cookies.set(AUTH_COOKIE_NAME, token, getCookieOptions());
  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set(AUTH_COOKIE_NAME, "", getCookieOptions({ maxAge: 0 }));
  return response;
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export function getAuthTokenFromRequest(request) {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}
