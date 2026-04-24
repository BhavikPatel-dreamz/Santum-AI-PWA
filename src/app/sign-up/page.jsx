"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "../../lib/utills/countries";
import GreenSection from "../../components/UI/GreenSection";
import SocialButtons from "../../components/UI/SocialButtons";
import { validateInternationalPhone } from "../sign-in/page";
import { Eye, EyeOff, LockIcon } from "lucide-react";
import { apiFetch } from "../../lib/api/client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

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
      setLoading(true);

      if (!phone) return toast.error("Phone number is required");
      if (!password) return toast.error("Password is required");
      if (!confirmPassword) return toast.error("Confirm password is required");

      if (password !== confirmPassword) {
        return toast.error("Passwords do not match");
      }

      const passwordError = validatePassword(password);
      if (passwordError) return toast.error(passwordError);

      const isNumberVerify = validateInternationalPhone(
        `${selectedCountry.dial}${phone}`,
      );

      if (!isNumberVerify) {
        return toast.error("Enter valid number");
      }

      const data = await apiFetch("/v1/register", {
        method: "POST",

        body: (() => {
          const formData = new FormData();
          formData.append("mobile", `${selectedCountry.dial}${phone}`);
          formData.append("password", password);
          return formData;
        })(),
      });

      if (data.success) {
        toast.success("Account created successfully");

        localStorage.setItem("token", data.data.token);

        setTimeout(() => {
          router.push("/verify-otp");
        }, 800);
      } else {
        toast.error(data.data.message || "Registration failed");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(error.data.data.message || "Something went wrong");
    } finally {
      setLoading(false);
      setDropdownOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center bg-white font-sans">
      <div className="w-full max-w-[600px] flex flex-col min-h-dvh bg-[#E4FFEE] relative">
        {/* ── Top green section ── */}
        <GreenSection />

        {/* ── White card ── */}
        <div className="absolute z-10 w-[96%] mx-3 top-59 bg-white rounded-[28px] px-7 pt-8 pb-9">
          <h2 className="text-[24px] font-semibold leading-9 text-[#0F0F0F] text-center mb-6">
            Sign Up
          </h2>

          {/* Phone input with country picker */}
          <div className="relative mb-6" ref={dropdownRef}>
            <div className="flex items-center bg-[#F5F5F5] rounded-[14px] px-4 py-3.5 mb-4">
              {/* Country selector */}
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setSearch("");
                }}
                className="flex items-center gap-1.5 mr-3 shrink-0"
              >
                <span className="text-[20px] text-[#555] leading-none">
                  {selectedCountry.flag}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0F0F0F"
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
                className="flex-1 bg-transparent outline-none text-[16px] text-[#0F0F0F] placeholder-[#AAAAAA]"
              />
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[14px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 overflow-hidden border border-gray-100">
                {/* Search box */}
                <div className="px-3 pt-3 pb-2">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#F5F5F5] rounded-[10px] px-3 py-2 text-[14px] outline-none placeholder-[#AAAAAA]"
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
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F0FFF6] transition-colors ${selectedCountry.code === c.code ? "bg-[#F0FFF6]" : ""}`}
                    >
                      <span className="text-[20px] text-[#555] leading-none">
                        {c.flag}
                      </span>
                      <span className="flex-1 text-[14px] text-[#0F0F0F]">
                        {c.name}
                      </span>
                      <span className="text-[14px] text-[#555] font-medium">
                        {c.dial}
                      </span>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-center text-[14px] text-[#999] py-4">
                      No results
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* password input */}
            <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-[14px] px-4 py-3.5 mb-4">
              <LockIcon className="text-[#555]" size={22} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[16px] text-[#0F0F0F] placeholder-[#AAAAAA]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#555]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* confirm password */}
            <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-[14px] px-4 py-3.5">
              <LockIcon className="text-[#555]" size={22} />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[16px] text-[#0F0F0F] placeholder-[#AAAAAA]"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[#555]"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Sign Up button */}
          <button
            onClick={() => handleSubmit()}
            className="w-full py-4 rounded-[14px] bg-[#00D061] text-white text-[18px] font-semibold tracking-wide hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 mb-6"
          >
            Sign Up
          </button>

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex-1 h-px bg-[#F5F5F5]" />
            <span className=" font-satoshi  inline-block text-[18px] leading-6 text-center text-[#555] px-2 relative z-1">
              or continue with
            </span>
            <span className="flex-1 h-px bg-[#F5F5F5]" />
          </div>

          {/* Social buttons */}
          <SocialButtons />
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Footer ── */}
        <footer className="text-center py-6 pb-8 px-4 font-satoshi">
          <p className="text-[17px] leading-6 text-[#555] text-center px-4">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#0F0F0F] font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
