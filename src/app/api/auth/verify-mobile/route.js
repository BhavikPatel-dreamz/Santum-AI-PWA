import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";
import { clearAuthCookie } from "../../../../lib/auth/session";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.otp) {
      return NextResponse.json(
        { message: "OTP is required" },
        { status: 400 },
      );
    }

    const payload = new FormData();
    payload.append("otp", body.otp);

    const data = assertApiSuccess(
      await apiFetchWithAuth("/v1/register/verify/mobile", {
        method: "POST",
        body: payload,
      }),
      "OTP verification failed",
    );

    return NextResponse.json({
      success: true,
      message:
        data?.data?.message || data?.message || "OTP verified successfully",
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "OTP verification failed");
  }
}
