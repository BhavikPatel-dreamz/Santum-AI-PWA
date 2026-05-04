"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GreenSection from "../../components/UI/GreenSection";
import SocialButtons from "../../components/UI/SocialButtons";
import { useCallback, useEffect } from "react";

export default function LetsYouInPage() {
  const router = useRouter();
  const isFingerprintEnabled =
    typeof window !== "undefined" &&
    localStorage.getItem("fingerprintEnabled") === "true";
  const handleFingerprintLogin = useCallback(async () => {
    try {
      const stored = localStorage.getItem("passkeyId");

      if (!stored) return;

      const rawId = new Uint8Array(JSON.parse(stored));

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [
            {
              id: rawId,
              type: "public-key",
              transports: ["internal"],
            },
          ],
          userVerification: "required",
        },
      });

      console.log("Fingerprint login success:", credential);

      // ✅ Redirect after success
      router.push("/home");
    } catch (err) {
      if (err.name === "NotAllowedError") {
        return;
      }
      console.error("Fingerprint login failed:", err);
    }
  }, [router]);

  useEffect(() => {
    const enabled = localStorage.getItem("fingerprintEnabled");

    if (enabled === "true") {
      const timeoutId = setTimeout(() => {
        handleFingerprintLogin();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [handleFingerprintLogin]);

  return (
    <div className="theme-auth-shell min-h-dvh flex flex-col items-center font-sans transition-colors duration-300">
      <div className="theme-auth-frame theme-border relative flex min-h-dvh w-full max-w-[1200px] flex-col transition-colors duration-300 lg:my-4 lg:min-h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-[36px] lg:border lg:shadow-[0_24px_64px_rgba(15,15,15,0.08)]">
        {/* ── Top green section ── */}
        <GreenSection show={false} />
        {/* ── White card ── */}
        <div className="theme-auth-card relative z-10 mx-3 -mt-20 w-auto rounded-[28px] px-6 pb-9 pt-8 transition-colors duration-300 sm:mx-5 sm:px-7 md:mx-8 lg:mx-auto lg:-mt-24 lg:w-full lg:max-w-[760px] lg:px-10 lg:pb-10">
          <h2 className="theme-text-primary mb-7 text-center text-[24px] font-semibold leading-9">
            Let&apos;s You In
          </h2>

          {/* Sign In With Password */}
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full py-4 rounded-[14px] bg-[#00D061] text-white text-[18px] font-semibold tracking-wide hover:bg-[#24a063] hover:shadow-[0_6px_20px_rgba(43,182,115,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            Sign In With Password
          </button>
          {isFingerprintEnabled && (
            <button
              onClick={handleFingerprintLogin}
              className="w-full mt-3 py-4 rounded-[14px] border border-gray-300 text-[18px]"
            >
              Login with Fingerprint
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
