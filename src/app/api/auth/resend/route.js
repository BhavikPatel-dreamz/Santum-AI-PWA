import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";
import { clearAuthCookie } from "../../../../lib/auth/session";

export async function POST() {
  try {
    const data = assertApiSuccess(
      await apiFetchWithAuth("/v1/register/verify/email/resend", {
        method: "POST",
      }),
      "Failed to send OTP",
    );

    return NextResponse.json({
      otp: data?.data?.otp,
      success: true,
      message:
        data?.data?.message || data?.message || "OTP resent successfully",
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "Failed to send OTP");
  }
}
