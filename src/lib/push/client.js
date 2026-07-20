import { OFFLINE_ERROR_MESSAGE } from "@/lib/api/error";

const PUSH_DEVICE_ID_STORAGE_KEY = "push_device_id";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);

  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

function getDeviceId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingDeviceId = normalizeText(
    window.localStorage.getItem(PUSH_DEVICE_ID_STORAGE_KEY),
  );

  if (existingDeviceId) {
    return existingDeviceId;
  }

  const nextDeviceId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `push-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem(PUSH_DEVICE_ID_STORAGE_KEY, nextDeviceId);
  return nextDeviceId;
}

function getDeviceInfo() {
  if (typeof window === "undefined") {
    return {};
  }

  return {
    deviceId: getDeviceId(),
    platform: normalizeText(window.navigator?.platform),
    language: normalizeText(window.navigator?.language),
    userAgent: normalizeText(window.navigator?.userAgent),
  };
}

function createRequestError(response, payload, fallbackMessage) {
  const error = new Error(
    normalizeText(payload?.message) ||
      normalizeText(payload?.error) ||
      fallbackMessage,
  );

  error.status = response.status;
  return error;
}

function createOfflineError() {
  const error = new Error(OFFLINE_ERROR_MESSAGE);

  error.status = "CUSTOM_ERROR";
  error.error = "OFFLINE";
  error.data = {
    offline: true,
    message: OFFLINE_ERROR_MESSAGE,
  };

  return error;
}

function assertOnline() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw createOfflineError();
  }
}

export async function registerPushServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const registration = await navigator.serviceWorker.register("/sw.js", {
    updateViaCache: "none",
  });

  registration.update().catch(() => undefined);

  return registration;
}

export async function subscribeCurrentBrowserToPush() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    typeof Notification === "undefined"
  ) {
    return { status: "unsupported" };
  }

  const vapidPublicKey = normalizeText(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  );

  if (!vapidPublicKey) {
    throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
  }

  assertOnline();
  await registerPushServiceWorker();
  const registration = await navigator.serviceWorker.ready;
  const permission =
    Notification.permission === "granted"
      ? "granted"
      : Notification.permission === "denied"
        ? "denied"
        : await Notification.requestPermission();

  if (permission !== "granted") {
    return { status: permission };
  }

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  }

  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      deviceInfo: getDeviceInfo(),
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw createRequestError(
      response,
      payload,
      "Failed to save push subscription",
    );
  }

  return {
    status: "granted",
    subscription: subscription.toJSON(),
    result: payload,
  };
}

export async function unsubscribeCurrentBrowserFromPush() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    typeof Notification === "undefined"
  ) {
    return { status: "unsupported" };
  }

  await registerPushServiceWorker();
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  const endpoint = normalizeText(subscription?.endpoint);

  assertOnline();

  if (subscription) {
    const unsubscribed = await subscription.unsubscribe();

    if (!unsubscribed) {
      throw new Error("Failed to unsubscribe this browser from push");
    }
  }

  const response = await fetch("/api/subscribe", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deviceInfo: getDeviceInfo(),
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw createRequestError(
      response,
      payload,
      "Failed to disable push notifications",
    );
  }

  return {
    status: Notification.permission,
    endpoint,
    result: payload,
  };
}
