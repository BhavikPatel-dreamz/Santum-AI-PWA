"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "../../lib/utills/countries";
import GreenSection from "../../components/UI/GreenSection";
import SocialButtons from "../../components/UI/SocialButtons";
import { Eye, EyeOff, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getClientErrorMessage } from "@/lib/api/error";
import { useLoginMutation } from "@/lib/store";

export const validateInternationalPhone = (number) => {
  const cleaned = number.trim().replace(/[^\d+]/g, "");
  const formatRegex = /^\+?[1-9]\d{4,15}$/;
  if (!formatRegex.test(cleaned)) return false;
  return true;
};

export default function SignInPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    try {
      if (!phone) return toast.error("PhoneNo is required");
      if (!password) return toast.error("Password is required");
      const isNumberVerify = validateInternationalPhone(`${phone}`);

      if (!isNumberVerify) return toast.error("Enter valid number");

      const data = await login({
        mobile: `${selectedCountry.dial}${phone}`,
        password,
      }).unwrap();

      toast.success(data.message || "Signed in successfully");
      router.replace("/home");
    } catch (error) {
      console.log("Error:", error);
      toast.error(getClientErrorMessage(error));
    } finally {
      setDropdownOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="theme-auth-shell min-h-dvh flex flex-col items-center font-sans transition-colors duration-300">
      <div className="theme-auth-frame relative flex min-h-dvh w-full max-w-[600px] flex-col transition-colors duration-300">
        {/* ─ Top green section ── */}
        <GreenSection />
        {/* ── White card ── */}
        <div className="theme-auth-card relative z-10 mx-3 -mt-20 w-[96%] rounded-[28px] px-7 pb-9 pt-8 transition-colors duration-300">
          <h2 className="theme-text-primary mb-6 text-center text-[24px] font-semibold leading-9">
            Sign In
          </h2>

          {/* Phone input with country picker */}
          <div className="relative mb-6" ref={dropdownRef}>
            <div className="theme-input-group mb-4 flex items-center rounded-[14px] px-4 py-3.5">
              {/* Country selector */}
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setSearch("");
                }}
                className="theme-text-primary mr-3 flex shrink-0 items-center gap-1.5"
              >
                <span className="theme-text-secondary text-[20px] leading-none">
                  {selectedCountry.flag}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="w-px h-5 bg-gray-300 mr-3" />
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="theme-input-field flex-1 text-[16px] outline-none"
              />
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="theme-auth-dropdown absolute left-0 right-0 top-full z-[999] mt-1 overflow-hidden rounded-[14px] border transition-colors duration-300">
                {/* Search box */}
                <div className="px-3 pt-3 pb-2">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="theme-input-surface w-full rounded-[10px] px-3 py-2 text-[14px] outline-none"
                    autoFocus
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filtered.map((c) => (
                    <button
                      key={c.code + c.dial}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(c);
                        setDropdownOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[rgba(0,208,97,0.08)] ${selectedCountry.code === c.code ? "theme-surface-soft" : ""}`}
                    >
                      <span className="theme-text-secondary text-[20px] leading-none">
                        {c.flag}
                      </span>
                      <span className="theme-text-primary flex-1 text-[14px]">
                        {c.name}
                      </span>
                      <span className="theme-text-secondary text-[14px] font-medium">
                        {c.dial}
                      </span>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="theme-text-muted py-4 text-center text-[14px]">
                      No results
                    </p>
                  )}
                </div>
              </div>
            )}
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

          <div className="mb-5 flex justify-end">
            <Link
              href="/forgot-password"
              className="theme-text-primary font-satoshi text-[14px] font-semibold hover:text-[#00A84D]"
            >
              Forgot password?
            </Link>
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

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="theme-auth-divider h-px flex-1" />
            <span className="theme-text-secondary relative z-1 inline-block px-2 text-center font-satoshi text-[18px] leading-6">
              or continue with
            </span>
            <span className="theme-auth-divider h-px flex-1" />
          </div>

          {/* Social buttons */}
          <SocialButtons />
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Footer ── */}
        <footer className="text-center py-6 pb-8 px-4 font-satoshi">
          <p className="theme-text-secondary px-4 text-center text-[17px] leading-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="theme-text-primary font-bold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
