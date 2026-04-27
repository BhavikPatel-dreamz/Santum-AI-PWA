import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../../lib/api/server";
import { clearAuthCookie } from "../../../../../lib/auth/session";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.preferredLanguage) {
      return NextResponse.json(
        { message: "Preferred language is required" },
        { status: 400 },
      );
    }

    const payload = new FormData();
    payload.append("preferred_language", body.preferredLanguage);

    const data = assertApiSuccess(
      await apiFetchWithAuth("/v1/user/profile/language", {
        method: "POST",
        body: payload,
      }),
      "Unable to update language",
    );

    return NextResponse.json({
      success: true,
      message: data?.data?.message || data?.message || "Language updated",
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "Unable to update language");
  }
}
