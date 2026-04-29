import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";
import { clearAuthCookie } from "../../../../lib/auth/session";

export async function GET() {
  try {
    const data = assertApiSuccess(
      await apiFetchWithAuth("/v1/credit/balance", {
        method: "GET",
        cache: "no-store",
      }),
      "Unable to load credit balance",
    );

    return NextResponse.json(data?.data ?? data);
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "Unable to load credit balance");
  }
}
