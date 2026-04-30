import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../../lib/api/server";
import { clearAuthCookie } from "../../../../../lib/auth/session";
import { buildSubscriptionStatus } from "../../../../../lib/utills/subscription";

function extractPlans(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }

    if (Array.isArray(payload.plans)) {
      return payload.plans;
    }
  }

  return [];
}

export async function GET() {
  try {
    const [plansResponse, profileResponse] = await Promise.all([
      apiFetchWithAuth("/v1/membership/plans", {
        method: "GET",
        cache: "no-store",
      }),
      apiFetchWithAuth("/v1/user/profile/", {
        method: "GET",
        cache: "no-store",
      }),
    ]);

    const plansPayload = assertApiSuccess(
      plansResponse,
      "Unable to load subscription plans",
    );
    const profilePayload = assertApiSuccess(
      profileResponse,
      "Unable to load profile",
    );

    const plans = extractPlans(plansPayload?.data ?? plansPayload);
    const profile = profilePayload?.data ?? profilePayload;

    return NextResponse.json({
      success: true,
      data: buildSubscriptionStatus({ plans, profile }),
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "Unable to load subscription status");
  }
}
