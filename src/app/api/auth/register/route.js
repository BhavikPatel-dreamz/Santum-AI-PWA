import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/api/client";
import {
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";
import { setAuthCookie } from "../../../../lib/auth/session";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.mobile || !body?.password) {
      return NextResponse.json(
        { message: "Mobile number and password are required" },
        { status: 400 },
      );
    }

    const payload = new FormData();
    payload.append("mobile", body.mobile);
    payload.append("password", body.password);

    const data = assertApiSuccess(
      await apiFetch("/v1/register", {
        method: "POST",
        body: payload,
      }),
      "Registration failed",
    );

    if (!data?.data?.token) {
      throw {
        status: 502,
        message: "Registration token missing from upstream response",
      };
    }

    const response = NextResponse.json({
      success: true,
      message:
        data?.data?.message || data?.message || "Account created successfully",
    });

    return setAuthCookie(response, data.data.token);
  } catch (error) {
    return createErrorResponse(error, "Registration failed");
  }
}
