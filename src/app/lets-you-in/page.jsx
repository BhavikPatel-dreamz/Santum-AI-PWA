"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import Image from "next/image";
import { useLoginWithPasskeyMutation } from "@/lib/store";
import toast from "react-hot-toast";
import { getClientErrorMessage } from "@/lib/api/error";

export default function LetsYouInPage() {
  const router = useRouter();
  const [loginWithPasskey] = useLoginWithPasskeyMutation();
  const handleFingerprintLogin = useCallback(async () => {
    try {
      const stored = localStorage.getItem("passkeyId");

      if (!stored) return;

      const rawId = new Uint8Array(JSON.parse(stored));

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      await navigator.credentials.get({
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

      const data = await loginWithPasskey({
        passkey: stored,
      }).unwrap();

      toast.success(data.message || "Signed in successfully");

      //Redirect after success
      router.replace("/home");
    } catch (err) {
      if (err.name === "NotAllowedError") {
        return;
      }
      console.log("Fingerprint Sigh In failed:", err);
      toast.error(getClientErrorMessage(err, "Invalid Fingerprint"));
    }
  }, [loginWithPasskey, router]);

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
      <div className="bg-[#323d51] theme-border relative flex min-h-dvh w-full lg:max-w-3xl flex-col transition-colors duration-300 lg:my-4 lg:min-h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-[36px] lg:border lg:shadow-[0_24px_64px_rgba(15,15,15,0.08)]">
        {/* ── Top green section ── */}
        {/* <GreenSection show={false} /> */}
        <div>
          <div className="flex min-h-[200px] h-[32vh] max-h-[360px] flex-shrink-0 items-center justify-center overflow-hidden bg-[#323d51] pb-6 sm:min-h-[300px] sm:h-[38vh] sm:pb-10 lg:min-h-[420px] lg:max-h-[460px] lg:pb-16">
            <div className="flex items-center justify-center">
              <Image
                src="/Logo Source files 21-4/Logo/1x/Artboard3.png"
                alt="SantumAI logo"
                width={180}
                height={180}
                priority
                className="h-[173px] w-[173px] object-contain sm:h-[238px] sm:w-[238px] lg:h-[302px] lg:w-[302px]"
              />
            </div>
          </div>
        </div>
        {/* ── White card ── */}
        <div className="theme-auth-card-bg relative z-10 mx-3 -mt-13 w-auto rounded-[28px] px-6 pb-9 pt-8 transition-colors duration-300 sm:mx-5 sm:px-7 md:mx-8">
          <div className="text-center mb-6">
            <h2 className="text-gray-600 text-[38px] font-bold leading-[1.1] tracking-[5px] mb-3">
              WELCOME
            </h2>
            <p className="theme-text-primary text-[20px] font-semibold ">
              Try it for free
            </p>
          </div>

          {/* Sign In With Password */}
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full py-4 rounded-[14px] bg-[#00D061] text-white text-[18px] font-semibold tracking-wide hover:bg-[#24a063] hover:shadow-[0_6px_20px_rgba(43,182,115,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            Get Started
          </button>
        </div>
        <p className="text-center text-[10px] text-[#dedede] pt-12 p-5">
          Powered by: <br /> Advanced AI Counselling System
        </p>
      </div>
    </div>
  );
}
