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

    if (!body?.firstName || !body?.lastName || !body?.dob) {
      return NextResponse.json(
        { message: "First name, last name, and date of birth are required" },
        { status: 400 },
      );
    }

    const payload = new FormData();
    payload.append("first_name", body.firstName);
    payload.append("last_name", body.lastName);
    payload.append("dob", body.dob);

    const data = assertApiSuccess(
      await apiFetchWithAuth("/v1/user/profile/basic", {
        method: "POST",
        body: payload,
      }),
      "Unable to save profile",
    );

    return NextResponse.json({
      success: true,
      message: data?.data?.message || data?.message || "Profile saved",
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "Unable to save profile");
  }
}
