"use client";
import { useState } from "react";
import GreenSection from "../../components/UI/GreenSection";
import { Eye, EyeOff, LockIcon, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getClientErrorMessage } from "@/lib/api/error";
import { useLoginMutation } from "@/lib/store";

const validateEmailAddress = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async () => {
    try {
      if (!email) return toast.error("Email is required");
      if (!password) return toast.error("Password is required");

      // if (!validateEmailAddress(email)) {
      //   return toast.error("Enter a valid email address");
      // }

      const data = await login({
        mobile: email.trim(),
        password,
      }).unwrap();

      toast.success(data.message || "Signed in successfully");
      router.replace("/home");
    } catch (error) {
      console.log("Error:", error);
      toast.error(getClientErrorMessage(error));
    }
  };

  return (
    <div className="theme-auth-shell min-h-dvh flex flex-col items-center font-sans transition-colors duration-300">
      <div className="theme-auth-frame theme-border relative flex min-h-dvh w-full max-w-[1200px] flex-col transition-colors duration-300 lg:my-4 lg:min-h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-[36px] lg:border lg:shadow-[0_24px_64px_rgba(15,15,15,0.08)]">
        {/* ─ Top green section ── */}
        <GreenSection />
        {/* ── White card ── */}
        <div className="theme-auth-card relative z-10 mx-3 -mt-26 w-auto rounded-[28px] px-6 pb-9 pt-8 transition-colors duration-300 sm:mx-5 sm:px-7 md:mx-8 lg:mx-auto lg:-mt-36 lg:w-full lg:max-w-[760px] lg:px-10 lg:pb-10">
          <h2 className="theme-text-primary mb-6 text-center text-[24px] font-semibold leading-9">
            Sign in
          </h2>

          <div className="theme-input-group mb-4 flex items-center gap-3 rounded-[14px] px-4 py-3.5">
            <Mail className="theme-text-secondary" size={22} />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="theme-input-field min-w-0 flex-1 text-[16px] outline-none"
            />
          </div>

          <div className="theme-input-group mb-4 flex items-center gap-3 rounded-[14px] px-4 py-3.5">
            <LockIcon className="theme-text-secondary" size={22} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="theme-input-field min-w-0 flex-1 text-[16px] outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="theme-text-secondary shrink-0 p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mb-5 flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="theme-text-primary font-satoshi text-[14px] font-semibold"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In button */}
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full py-4 rounded-[14px] flex items-center justify-center bg-[#00D061] text-white text-[18px] font-semibold tracking-wide hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 mb-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </button>
          <p className="theme-text-primary font-semibold font-satoshi px-4 text-center text-[14px]">
            Don&apos;t have an account?
          </p>

          <button
            disabled={isLoading}
            onClick={() => router.push("/sign-up")}
            className="w-full py-4 rounded-[14px] flex items-center justify-center bg-orange-400 text-white text-[18px] font-semibold tracking-wide hover:bg-orange-500 hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0 transition-all duration-200"
          >
            Get Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
