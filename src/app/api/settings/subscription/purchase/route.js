import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../../lib/api/server";
import { clearAuthCookie } from "../../../../../lib/auth/session";
import {
  buildPlanPurchaseReference,
  extractCreditBalance,
  resolvePurchaseCreditAmount,
} from "../../../../../lib/utills/credit";

function normalizePlanName(plan) {
  if (typeof plan?.name === "string" && plan.name.trim()) {
    return plan.name.trim();
  }

  return "Selected";
}

function getBillingAmount(plan) {
  const rawAmount = Number(plan?.billing_amount ?? plan?.price ?? 0);
  return Number.isFinite(rawAmount) ? rawAmount : 0;
}

async function loadUpdatedCreditBalance() {
  const balanceResponse = assertApiSuccess(
    await apiFetchWithAuth("/v1/credit/balance", {
      method: "GET",
      cache: "no-store",
    }),
    "Unable to load updated credit balance",
  );

  return extractCreditBalance(balanceResponse?.data ?? balanceResponse);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const plan = body?.plan;

    if (!plan || typeof plan !== "object") {
      return NextResponse.json(
        { message: "A valid plan selection is required" },
        { status: 400 },
      );
    }

    const planName = normalizePlanName(plan);
    const billingAmount = getBillingAmount(plan);
    const creditsToAdd = resolvePurchaseCreditAmount(plan);

    if (billingAmount <= 0 || creditsToAdd <= 0) {
      return NextResponse.json(
        { message: `${planName} does not require a paid credit top-up` },
        { status: 400 },
      );
    }

    const payload = new FormData();
    payload.append("amount", String(creditsToAdd));
    payload.append("reference_id", buildPlanPurchaseReference(planName));
    payload.append("note", `Dummy payment confirmed for ${planName} plan`);
    payload.append("source", "subscription_purchase");

    assertApiSuccess(
      await apiFetchWithAuth("/v1/credit/increase", {
        method: "POST",
        body: payload,
      }),
      "Unable to increase credits after plan purchase",
    );

    const updatedBalance = await loadUpdatedCreditBalance();

    return NextResponse.json({
      success: true,
      message: `${planName} plan activated successfully`,
      plan_name: planName,
      credits_added: creditsToAdd,
      updated_balance: updatedBalance,
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "Unable to complete plan purchase");
  }
}
