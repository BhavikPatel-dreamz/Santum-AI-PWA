import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/api/client";
import {
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const otp = typeof body?.otp === "string" ? body.otp.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !otp || !password.trim()) {
      return NextResponse.json(
        { message: "Email, OTP, and password are required" },
        { status: 400 },
      );
    }

    const payload = new FormData();
    payload.set("email", email);
    payload.set("otp", otp);
    payload.set("password", password);

    const data = assertApiSuccess(
      await apiFetch("/v1/login/reset/", {
        method: "POST",
        body: payload,
      }),
      "Password reset failed",
    );

    return NextResponse.json({
      success: true,
      message:
        data?.data?.message || data?.message || "Password reset successfully",
    });
  } catch (error) {
    return createErrorResponse(error, "Password reset failed");
  }
}
