"use client";

import { registerPushServiceWorker } from "@/lib/push/client";
import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    registerPushServiceWorker().catch((error) => {
      console.error("Unable to register service worker:", error);
    });
  }, []);

  return null;
}
