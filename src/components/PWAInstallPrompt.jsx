"use client";

import { ChevronDown, Share2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const SNOOZE_STORAGE_KEY = "santumai_install_prompt_snoozed_at";
const SNOOZE_DURATION_MS = 5 * 60 * 1000;
const PROMPT_DELAY_MS = 1200;
const IOS_FALLBACK_DELAY_MS = 1800;

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIosDevice() {
  const platform = window.navigator.platform || "";
  const userAgent = window.navigator.userAgent || "";

  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === "MacIntel" && window.navigator.maxTouchPoints > 1)
  );
}

function getSnoozeRemainingMs() {
  let snoozedAt = 0;

  try {
    snoozedAt = Number(window.sessionStorage.getItem(SNOOZE_STORAGE_KEY));
  } catch {
    snoozedAt = 0;
  }

  const isRecent =
    Number.isFinite(snoozedAt) &&
    snoozedAt > 0 &&
    Date.now() - snoozedAt < SNOOZE_DURATION_MS;

  return isRecent ? SNOOZE_DURATION_MS - (Date.now() - snoozedAt) : 0;
}

function rememberSnooze() {
  try {
    window.sessionStorage.setItem(SNOOZE_STORAGE_KEY, String(Date.now()));
  } catch { }
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [promptMode, setPromptMode] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);
  const snoozeTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || isStandaloneMode()) {
      return undefined;
    }

    let nativePromptAvailable = false;
    let showTimer;

    const iosFallbackTimer = window.setTimeout(() => {
      if (!nativePromptAvailable && isIosDevice() && !isStandaloneMode()) {
        setPromptMode("ios");
        setIsVisible(true);
      }
    }, Math.max(IOS_FALLBACK_DELAY_MS, getSnoozeRemainingMs()));

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      nativePromptAvailable = true;
      window.clearTimeout(iosFallbackTimer);
      setDeferredPrompt(event);
      setPromptMode("native");

      showTimer = window.setTimeout(() => {
        setIsVisible(true);
      }, Math.max(PROMPT_DELAY_MS, getSnoozeRemainingMs()));
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      window.clearTimeout(snoozeTimerRef.current);

      try {
        window.sessionStorage.removeItem(SNOOZE_STORAGE_KEY);
      } catch { }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(iosFallbackTimer);
      window.clearTimeout(snoozeTimerRef.current);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleDismiss = useCallback(() => {
    rememberSnooze();
    setIsVisible(false);

    window.clearTimeout(snoozeTimerRef.current);
    snoozeTimerRef.current = window.setTimeout(() => {
      if (!isStandaloneMode()) {
        setIsVisible(true);
      }
    }, SNOOZE_DURATION_MS);
  }, []);

  const handleInstall = useCallback(async () => {
    if (promptMode === "ios") {
      return;
    }

    if (!deferredPrompt || isPrompting) {
      return;
    }

    setIsPrompting(true);

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice?.outcome === "dismissed") {
        rememberSnooze();
      }

      setDeferredPrompt(null);
      setIsVisible(false);
    } catch (error) {
      console.error("Unable to show install prompt:", error);
    } finally {
      setIsPrompting(false);
    }
  }, [deferredPrompt, isPrompting, promptMode]);

  if (!isVisible || !promptMode) {
    return null;
  }

  const isIosPrompt = promptMode === "ios";

  return (
    <div
      aria-label="Install Santum AI"
      aria-modal="true"
      className="fixed inset-0 z-[9990]"
      role="dialog"
    >
      <button
        type="button"
        aria-label="Dismiss install prompt"
        className="fixed inset-0 z-[9990]"
        style={{
          background:
            "linear-gradient(180deg,rgba(18,18,18,.56) 0%,rgba(18,18,18,.24) 100%)",
          backdropFilter: "blur(2px)",
        }}
        onClick={handleDismiss}
      />

      <div className="theme-surface-elevated fixed bottom-0 left-0 right-0 z-[9991] mx-auto max-w-[1200px] rounded-t-[24px] px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-4 shadow-[0_-18px_48px_rgba(15,15,15,0.18)] sm:px-6 md:px-8 lg:px-10">
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            aria-label="Dismiss install prompt"
            onClick={handleDismiss}
            className="theme-card-soft flex h-8 w-12 items-center justify-center rounded-full text-[#00D061] transition-all active:scale-[0.97]"
          >
            <ChevronDown aria-hidden="true" size={22} strokeWidth={2.4} />
          </button>
        </div>

        <h2 className="theme-text-primary mb-3 text-center text-[20px] font-semibold leading-[30px]">
          Install Santum AI
        </h2>
        <p className="theme-text-secondary mx-auto mb-6 max-w-[420px] text-center text-[16px] font-medium leading-6">
          Add an icon to your apps screen for a faster, app-like experience.
        </p>

        {isIosPrompt ? (
          <div className="mx-auto max-w-[420px]">
            <div className="theme-card-soft mb-5 rounded-[14px] px-4 py-3">
              <p className="theme-text-secondary flex items-center justify-center gap-2 text-center text-[14px] font-semibold leading-6">
                <Share2
                  aria-hidden="true"
                  className="shrink-0 text-[#00A84D]"
                  size={17}
                  strokeWidth={2.3}
                />
                Tap Share, then Add to Home Screen.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="theme-card-soft w-full rounded-[12px] px-8 py-[18px] text-[18px] font-medium text-[#00D061] transition-all duration-300 active:scale-[0.97]"
            >
              Later
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleInstall}
              disabled={isPrompting}
              className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#00D061] px-8 py-[18px] text-[18px] font-medium text-white transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isPrompting ? "Opening..." : "Install Icon"}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="theme-card-soft w-full rounded-[12px] px-8 py-[18px] text-[18px] font-medium text-[#00D061] transition-all duration-300 active:scale-[0.97] sm:w-auto"
            >
              Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
