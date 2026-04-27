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

    if (!Array.isArray(body?.interests) || body.interests.length === 0) {
      return NextResponse.json(
        { message: "At least one interest is required" },
        { status: 400 },
      );
    }

    const payload = new FormData();
    body.interests.forEach((interest) => {
      payload.append("area_of_interest[]", interest);
    });

    const data = assertApiSuccess(
      await apiFetchWithAuth("/v1/user/profile/interests", {
        method: "POST",
        body: payload,
      }),
      "Unable to save interests",
    );

    return NextResponse.json({
      success: true,
      message: data?.data?.message || data?.message || "Interests saved",
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "Unable to save interests");
  }
}
