import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/api/client";
import {
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";
import { clearAuthCookie, getAuthToken } from "../../../../lib/auth/session";

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = assertApiSuccess(
      await apiFetch("/v1/membership/plans", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      "Unable to load Subscription Plans",
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

    return createErrorResponse(error, "Unable to Subscription Plans");
  }
}
