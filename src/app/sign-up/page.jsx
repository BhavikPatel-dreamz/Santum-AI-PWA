"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GreenSection from "../../components/UI/GreenSection";
import { Eye, EyeOff, LockIcon, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { getClientErrorMessage } from "@/lib/api/error";
import { useRegisterMutation } from "@/lib/store";
import { OTP_PHONE_STORAGE_KEY } from "../../lib/utills/phone";

const validateEmailAddress = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function SignUpPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  function validatePassword(password) {
    const minLength = 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 6 characters";
    }
    if (!hasUpper) {
      return "Password must include at least one uppercase letter";
    }
    if (!hasLower) {
      return "Password must include at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must include at least one number";
    }
    if (!hasSpecial) {
      return "Password must include at least one special character";
    }

    return null;
  }

  const handleSubmit = async () => {
    try {
      if (!email) return toast.error("Email is required");
      if (!password) return toast.error("Password is required");
      if (!confirmPassword) return toast.error("Confirm password is required");

      if (password !== confirmPassword) {
        return toast.error("Passwords do not match");
      }

      const passwordError = validatePassword(password);
      if (passwordError) return toast.error(passwordError);

      // if (!validateEmailAddress(email)) {
      //   return toast.error("Enter a valid email address");
      // }

      const data = await register({
        mobile: email.trim(),
        password,
      }).unwrap();

      if (data.success) {
        toast.success(data.message || "Account created successfully");
        sessionStorage.setItem(
          OTP_PHONE_STORAGE_KEY,
          JSON.stringify({
            mobile: email.trim(),
            dialCode: "",
          }),
        );
        router.replace("/verify-otp");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(getClientErrorMessage(error));
    }
  };

  return (
    <div className="theme-auth-shell min-h-dvh flex flex-col items-center font-sans transition-colors duration-300">
      <div className="theme-auth-frame theme-border relative flex min-h-dvh w-full max-w-[1200px] flex-col transition-colors duration-300 lg:my-4 lg:min-h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-[36px] lg:border lg:shadow-[0_24px_64px_rgba(15,15,15,0.08)]">
        {/* ── Top green section ── */}
        <GreenSection />

        {/* ── White card ── */}
        <div className="theme-auth-card relative z-10 mx-3 -mt-20 w-auto rounded-[28px] px-6 pb-9 pt-8 transition-colors duration-300 sm:mx-5 sm:px-7 md:mx-8 lg:mx-auto lg:-mt-24 lg:w-full lg:max-w-[760px] lg:px-10 lg:pb-10">
          <h2 className="theme-text-primary mb-6 text-center text-[24px] font-semibold leading-9">
            Sign Up
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
              className="theme-input-field flex-1 text-[16px] outline-none"
            />
          </div>

          <div className="theme-input-group mb-4 flex items-center gap-3 rounded-[14px] px-4 py-3.5">
            <LockIcon className="theme-text-secondary" size={22} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="theme-input-field flex-1 text-[16px] outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="theme-text-secondary"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* confirm password */}
          <div className="theme-input-group mb-4 flex items-center gap-3 rounded-[14px] px-4 py-3.5">
            <LockIcon className="theme-text-secondary" size={22} />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="theme-input-field flex-1 text-[16px] outline-none"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="theme-text-secondary"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="ageCheck"
              checked={isAdult}
              onChange={(e) => setIsAdult(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="ageCheck" className="text-sm cursor-pointer">
              I am over 18 years old
            </label>
          </div>

          {/* Sign Up button */}
          <button
            disabled={isLoading || !isAdult}
            onClick={() => handleSubmit()}
            className={`w-full py-4 rounded-[14px] flex items-center justify-center text-[18px] font-semibold tracking-wide transition-all duration-200 mb-6
              ${
                isAdult
                  ? "bg-[#00D061] text-white hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing up...</span>
              </div>
            ) : (
              "Sign up"
            )}
          </button>

          {/* OR divider */}

          {/* Social buttons */}
          {/* <SocialButtons /> */}
        </div>

        {/* ── Spacer ── */}

        {/* ── Footer ── */}
        {/* <footer className="text-center py-6 pb-8 px-4 font-satoshi">
          <p className="theme-text-secondary px-4 text-center text-[17px] leading-6">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="theme-text-primary font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </footer> */}
      </div>
    </div>
  );
}
