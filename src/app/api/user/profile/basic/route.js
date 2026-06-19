import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../../lib/api/server";
import { clearAuthCookie } from "../../../../../lib/auth/session";

export async function POST(req) {
  try {
    const body = await req.json();

    // const hasBasicProfile =
    //   Boolean(body?.firstName) || Boolean(body?.lastName) || Boolean(body?.dob);
    const hasFingerprintEnabled =
      typeof body?.fingerprintEnabled === "boolean" ||
      typeof body?.fingerprint_enabled === "boolean" ||
      body?.fingerprintEnabled === 0 ||
      body?.fingerprintEnabled === 1 ||
      body?.fingerprint_enabled === 0 ||
      body?.fingerprint_enabled === 1;
    const hasPasskeyId =
      typeof body?.passkeyId === "string" ||
      Array.isArray(body?.passkeyId) ||
      typeof body?.passkey_id === "string" ||
      Array.isArray(body?.passkey_id);
    const hasPaused =
      typeof body?.paused === "boolean" ||
      body?.paused === 0 ||
      body?.paused === 1;

    const hasDelete =
      typeof body?.delete === "boolean" ||
      body?.delete === 0 ||
      body?.delete === 1;

    if (
      // !hasBasicProfile &&
      !hasFingerprintEnabled &&
      !hasPasskeyId &&
      !hasPaused &&
      !hasDelete
    ) {
      return NextResponse.json(
        { message: "No profile updates provided" },
        { status: 400 },
      );
    }

    // if (
    //   hasBasicProfile &&
    //   (!body?.firstName || !body?.lastName || !body?.dob)
    // ) {
    //   return NextResponse.json(
    //     { message: "First name, last name, and date of birth are required" },
    //     { status: 400 },
    //   );
    // }

    const payload = new FormData();

    // if (hasBasicProfile) {
    //   payload.append("first_name", body.firstName);
    //   payload.append("last_name", body.lastName);
    //   payload.append("dob", body.dob);
    // }

    if (hasFingerprintEnabled) {
      const fingerprintEnabled =
        body.fingerprintEnabled ?? body.fingerprint_enabled;
      payload.append("fingerprint_enabled", fingerprintEnabled ? "1" : "0");
    }

    if (hasPasskeyId) {
      const passkeyId = body.passkeyId ?? body.passkey_id;
      payload.append(
        "passkey_id",
        Array.isArray(passkeyId) ? JSON.stringify(passkeyId) : passkeyId,
      );
    }

    if (hasPaused) {
      payload.append("paused", body.paused ? "1" : "0");
    }

    if (hasDelete) {
      payload.append("delete", body.delete ? "1" : "0");
    }

    if (hasPaused) {
      const endpoint = body.paused
        ? "/v1/user/membership/pause"
        : "/v1/user/membership/resume";

      const data = await apiFetchWithAuth(endpoint, {
        method: "POST",
      })

      if (data?.success === false) {
        console.log("MemberShip updation error:", data?.message)
        throw {
          status: 400,
          message: "Unable to pause or resume membership"
        };
      }
    }

    if (body.delete === true) {
      const data = await apiFetchWithAuth("/v1/user/membership/cancel", {
        method: "POST",
      })

      if (data?.success === false) {
        console.log("MemberShip Cancellation error:", data?.message)
        throw {
          status: 400,
          message: "Unable to cancel membership"
        };
      }
    }

    const data = assertApiSuccess(
      await apiFetchWithAuth("/v1/user/profile/basic", {
        method: "POST",
        body: payload,
      }),
      "Unable to save profile"
    );

    return NextResponse.json({
      success: true,
      message: data?.data?.message || data?.message || "Profile saved",
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    return createErrorResponse(error, "Unable to save profile");
  }
}
