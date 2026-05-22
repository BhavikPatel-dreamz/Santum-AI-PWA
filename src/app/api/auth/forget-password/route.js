import { NextResponse } from "next/server";
import {
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";
import { apiFetch } from "../../../../lib/api/client";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const payload = new FormData();
    payload.set("email", body.email.trim());

    const data = assertApiSuccess(
      await apiFetch("/v1/login/forgot/", {
        method: "POST",
        body: payload,
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return createErrorResponse(error, "Failed to send OTP");
  }
}
