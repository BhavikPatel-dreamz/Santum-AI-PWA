import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";
import { clearAuthCookie, getAuthToken } from "../../../../lib/auth/session";

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    assertApiSuccess(
      await apiFetchWithAuth("/v1/user/profile/", { method: "GET" }),
      "Unable to verify session",
    );

    return NextResponse.json({
      authenticated: true,
    });
  } catch (err) {
    if (err?.status === 401) {
      const response = NextResponse.json(
        { authenticated: false, message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(err, "Unable to verify session");
  }
}
