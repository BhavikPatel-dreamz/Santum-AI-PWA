"use client";
import { useRouter } from "next/navigation";
import GreenSection from "../../components/UI/GreenSection";
import SocialButtons from "../../components/UI/SocialButtons";

export default function LetsYouInPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col items-center bg-white font-sans">
      <div className="w-full max-w-[600px] flex flex-col min-h-dvh bg-[#E4FFEE] relative">
        {/* ── Top green section ── */}
        <GreenSection show={false} />
        {/* ── White card ── */}
        <div className="relative z-10 w-[96%] mx-3 -mt-20 bg-white rounded-[28px] px-7 pt-8 pb-9 shadow-md">
          <h2 className="text-[24px] font-semibold leading-9 text-[#0F0F0F] text-center mb-7">
            Let's You In
          </h2>

          {/* Social buttons */}
          <SocialButtons />

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex-1 h-px bg-[#F5F5F5]" />
            <span
              className=" font-satoshi
  inline-block 
  text-[18px] 
  leading-6 
  text-center 
text-[#555]
  px-2 
  relative 
  z-1
"
            >
              or
            </span>
            <span className="flex-1 h-px bg-[#F5F5F5]" />
          </div>

          {/* Sign In With Password */}
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full py-4 rounded-[14px] bg-[#00D061] text-white text-[18px] font-semibold tracking-wide hover:bg-[#24a063] hover:shadow-[0_6px_20px_rgba(43,182,115,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            Sign In With Password
          </button>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Footer ── */}
        <footer className="text-center py-6 pb-8 px-4 font-satoshi">
          <p className="text-[18px] leading-6 text-[#555] text-center px-4">
            Don't have an account?
            <a
              href="/sign-up"
              className="text-[#0F0F0F] font-semibold hover:underline px-1"
            >
              Sign up
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
