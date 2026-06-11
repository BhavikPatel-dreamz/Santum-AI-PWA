"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function OfflineDetector() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const syncOnlineStatus = () => {
      setOnline(window.navigator.onLine);
    };

    syncOnlineStatus();

    window.addEventListener("online", syncOnlineStatus);
    window.addEventListener("offline", syncOnlineStatus);

    return () => {
      window.removeEventListener("online", syncOnlineStatus);
      window.removeEventListener("offline", syncOnlineStatus);
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[10000] flex justify-center px-4 pt-4"
    >
      <div className="theme-surface-elevated theme-border flex w-full max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-left shadow-[0_16px_40px_rgba(15,15,15,0.16)]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8FFF1] text-[#00A84D]">
          <WifiOff aria-hidden="true" size={22} strokeWidth={2.2} />
        </span>
        <span className="theme-text-primary text-[14px] font-semibold leading-5">
          No internet connection
        </span>
      </div>
    </div>
  );
}
