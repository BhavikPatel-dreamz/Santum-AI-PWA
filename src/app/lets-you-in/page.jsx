"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GreenSection from "../../components/UI/GreenSection";
import SocialButtons from "../../components/UI/SocialButtons";

export default function LetsYouInPage() {
  const router = useRouter();

  return (
    <div className="theme-auth-shell min-h-dvh flex flex-col items-center font-sans transition-colors duration-300">
      <div className="theme-auth-frame relative flex min-h-dvh w-full max-w-[600px] flex-col transition-colors duration-300">
        {/* ── Top green section ── */}
        <GreenSection show={false} />
        {/* ── White card ── */}
        <div className="theme-auth-card relative z-10 mx-3 -mt-20 w-[96%] rounded-[28px] px-7 pb-9 pt-8 transition-colors duration-300">
          <h2 className="theme-text-primary mb-7 text-center text-[24px] font-semibold leading-9">
            Let&apos;s You In
          </h2>

          {/* Social buttons */}
          <SocialButtons />

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="theme-auth-divider h-px flex-1" />
            <span className="theme-text-secondary relative z-1 inline-block px-2 text-center font-satoshi text-[18px] leading-6">
              or
            </span>
            <span className="theme-auth-divider h-px flex-1" />
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
          <p className="theme-text-secondary px-4 text-center text-[18px] leading-6">
            Don&apos;t have an account?
            <Link
              href="/sign-up"
              className="theme-text-primary px-1 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
