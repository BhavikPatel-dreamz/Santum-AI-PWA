import {
  apiFetchWithAuth,
  assertApiSuccess,
} from "@/lib/api/server";
import { getProfileIdentityKey } from "@/lib/utills/profile";

function normalizeProfilePayload(payload) {
  
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  if (
    payload.data &&
    typeof payload.data.data === "object" &&
    !Array.isArray(payload.data.data)
  ) {
    return payload.data.data.user;
  }

  if (
    payload.user &&
    typeof payload.user === "object" &&
    !Array.isArray(payload.user)
  ) {
    return payload.user;
  }

  return payload;
}

export async function resolveMoodUserKey() {
  const profileResponse = assertApiSuccess(
    await apiFetchWithAuth("/v1/user/profile/", {
      method: "GET",
      cache: "no-store",
    }),
    "Unable to load profile",
  );
  const profile = normalizeProfilePayload(profileResponse);
  const userKey = getProfileIdentityKey(profile);

  if (!userKey) {
    throw {
      status: 400,
      message:
        "Unable to identify the current user for mood check-ins. The profile response did not include a stable id, phone, or email.",
    };
  }

  return userKey;
}
