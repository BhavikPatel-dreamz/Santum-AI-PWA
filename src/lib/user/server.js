import {
  apiFetchWithAuth,
  assertApiSuccess,
} from "@/lib/api/server";
import { getProfileIdentityKey } from "@/lib/utills/profile";

export function normalizeProfilePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  if (
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    if (
      payload.data.data &&
      typeof payload.data.data === "object" &&
      !Array.isArray(payload.data.data)
    ) {
      if (
        payload.data.data.user &&
        typeof payload.data.data.user === "object" &&
        !Array.isArray(payload.data.data.user)
      ) {
        return payload.data.data.user;
      }

      return payload.data.data;
    }

    if (
      payload.data.user &&
      typeof payload.data.user === "object" &&
      !Array.isArray(payload.data.user)
    ) {
      return payload.data.user;
    }

    return payload.data;
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

export function resolveUserKeyFromProfile(profile) {
  const userKey = getProfileIdentityKey(profile);

  if (!userKey) {
    throw {
      status: 400,
      message:
        "Unable to identify the current user. The profile response did not include a stable id, phone, or email.",
    };
  }

  return userKey;
}

export async function loadCurrentUserProfile() {
  const profileResponse = assertApiSuccess(
    await apiFetchWithAuth("/v1/user/profile/", {
      method: "GET",
      cache: "no-store",
    }),
    "Unable to load profile",
  );

  return normalizeProfilePayload(profileResponse);
}

export async function resolveCurrentUserKey() {
  return resolveUserKeyFromProfile(await loadCurrentUserProfile());
}
