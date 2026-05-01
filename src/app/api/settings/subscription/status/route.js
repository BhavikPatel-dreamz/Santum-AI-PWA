import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../../lib/api/server";
import { clearAuthCookie } from "../../../../../lib/auth/session";
import { extractCreditBalance } from "../../../../../lib/utills/credit";
import {
  buildBillingSnapshot,
  syncBillingNotifications,
} from "../../../../../lib/notifications/server";
import { normalizeProfilePayload, resolveUserKeyFromProfile } from "../../../../../lib/user/server";

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
    const [plansResponse, profileResponse, creditBalanceResult] =
      await Promise.allSettled([
        apiFetchWithAuth("/v1/membership/plans", {
          method: "GET",
          cache: "no-store",
        }),
        apiFetchWithAuth("/v1/user/profile/", {
          method: "GET",
          cache: "no-store",
        }),
        apiFetchWithAuth("/v1/credit/balance", {
          method: "GET",
          cache: "no-store",
        }),
      ]);

    if (plansResponse.status === "rejected") {
      throw plansResponse.reason;
    }

    if (profileResponse.status === "rejected") {
      throw profileResponse.reason;
    }

    const plansPayload = assertApiSuccess(
      plansResponse.value,
      "Unable to load subscription plans",
    );
    const profilePayload = assertApiSuccess(
      profileResponse.value,
      "Unable to load profile",
    );

    const plans = extractPlans(plansPayload?.data ?? plansPayload);
    const profile =
      normalizeProfilePayload(profilePayload) ??
      profilePayload?.data ??
      profilePayload;
    let creditBalance = null;

    if (creditBalanceResult.status === "fulfilled") {
      try {
        const creditBalancePayload = assertApiSuccess(
          creditBalanceResult.value,
          "Unable to load credit balance",
        );

        creditBalance = extractCreditBalance(
          creditBalancePayload?.data ?? creditBalancePayload,
        );
      } catch (creditBalanceError) {
        console.error(
          "Unable to load credit balance while syncing membership notifications:",
          creditBalanceError,
        );
      }
    }

    const billingSnapshot = buildBillingSnapshot({
      creditBalance,
      plans,
      profile,
    });

    try {
      const userKey = resolveUserKeyFromProfile(profile);
      await syncBillingNotifications({
        user: userKey,
        snapshot: billingSnapshot,
      });
    } catch (notificationError) {
      console.error(
        "Unable to sync billing notifications from subscription status:",
        notificationError,
      );
    }

    return NextResponse.json({
      success: true,
      data: billingSnapshot,
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
