import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/api/client";

export async function POST(req) {
  try {
    const body = await req.json();
    const payload = new FormData();
    payload.append("mobile", body.mobile);
    payload.append("password", body.password);

    const data = await apiFetch("/v1/login", {
      method: "POST",
      body: payload,
    });

    if (!data.success) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true,message:data.data.message });

    response.cookies.set("token", data.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 4,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ message: err.data.data.message }, { status: 500 });
  }
}
