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
      await apiFetch("/v1/login", {
        method: "POST",
        body: payload,
      }),
      "Login failed",
    );

    if (!data?.data?.token) {
      throw { status: 502, message: "Login token missing from upstream response" };
    }

    const response = NextResponse.json({
      success: true,
      message: data?.data?.message || data?.message || "Signed in successfully",
    });

    return setAuthCookie(response, data.data.token);
  } catch (err) {
    return createErrorResponse(err, "Login failed");
  }
}
