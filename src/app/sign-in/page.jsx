"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "../../lib/utills/countries";

export default function SignInPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="min-h-dvh flex flex-col items-center bg-white font-sans">
      <div className="w-full max-w-[600px] flex flex-col min-h-dvh bg-[#E4FFEE] relative">

        {/* ── Top green section ── */}
        <div className="relative bg-[#00D061] h-94 flex items-end justify-center pb-12 overflow-hidden flex-shrink-0">

          {/* Circuit SVG background */}
          <Image
            src="/icons/let-you-screen-main-img.jpg"
            alt=""
            width={375}
            height={375}
            priority
            unoptimized
            sizes="(max-width: 600px) 100vw, 600px"
            className="absolute top-0 left-1/2 h-full w-auto max-w-[800px] -translate-x-1/2"
          />

          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="absolute top-5 left-5 z-10 w-10 h-10 rounded-[10px] border-2 border-white/60 bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Logo */}
          <div className="absolute top-21 z-10 w-[120px] h-[120px] bg-white rounded-[24px] flex items-center justify-center">
            <div className="flex items-center justify-center">
              <Image
                src="/icons/logo.png"
                alt="Amigo logo"
                width={120}
                height={120}
                priority
                className="h-22 w-22 object-contain"
              />
            </div>
          </div>
        </div>

        {/* ── White card ── */}
        <div className="absolute z-10 w-[96%] mx-3 top-59 bg-white rounded-[28px] px-7 pt-8 pb-9">
          <h2 className="text-[24px] font-semibold leading-9 text-[#0F0F0F] text-center mb-6">
            Sign In
          </h2>

          {/* Phone input with country picker */}
          <div className="relative mb-6" ref={dropdownRef}>
            <div className="flex items-center bg-[#F5F5F5] rounded-[14px] px-4 py-3.5">
              {/* Country selector */}
              <button
                type="button"
                onClick={() => { setDropdownOpen(!dropdownOpen); setSearch(""); }}
                className="flex items-center gap-1.5 mr-3 shrink-0"
              >
                <span className="text-[20px] leading-none">{selectedCountry.flag}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                      onClick={() => { setSelectedCountry(c); setDropdownOpen(false); setSearch(""); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F0FFF6] transition-colors ${selectedCountry.code === c.code ? "bg-[#F0FFF6]" : ""}`}
                    >
                      <span className="text-[20px] leading-none">{c.flag}</span>
                      <span className="flex-1 text-[14px] text-[#0F0F0F]">{c.name}</span>
                      <span className="text-[14px] text-[#555] font-medium">{c.dial}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-center text-[14px] text-[#999] py-4">No results</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sign In button */}
          <button className="w-full py-4 rounded-[14px] bg-[#00D061] text-white text-[18px] font-semibold tracking-wide hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 mb-6">
            Sign In
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
          <div className="flex justify-center gap-4">
            {/* Facebook */}
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Continue with Facebook"
              className="w-[60px] h-[60px] rounded-[14px] border border-gray-200 flex items-center justify-center bg-white hover:border-[#00D061] hover:shadow-[0_4px_12px_rgba(0,208,97,0.15)] hover:-translate-y-0.5 transition-all duration-200">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.271h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            </a>

            {/* Google */}
            <a href="https://www.google.com" target="_blank" rel="noreferrer" aria-label="Continue with Google"
              className="w-[60px] h-[60px] rounded-[14px] border border-gray-200 flex items-center justify-center bg-white hover:border-[#00D061] hover:shadow-[0_4px_12px_rgba(0,208,97,0.15)] hover:-translate-y-0.5 transition-all duration-200">
              <svg width="26" height="26" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </a>

            {/* Apple */}
            <a href="https://www.icloud.com" target="_blank" rel="noreferrer" aria-label="Continue with Apple"
              className="w-[60px] h-[60px] rounded-[14px] border border-gray-200 flex items-center justify-center bg-white hover:border-[#00D061] hover:shadow-[0_4px_12px_rgba(0,208,97,0.15)] hover:-translate-y-0.5 transition-all duration-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="Continue with WhatsApp"
              className="w-[60px] h-[60px] rounded-[14px] border border-gray-200 flex items-center justify-center bg-white hover:border-[#00D061] hover:shadow-[0_4px_12px_rgba(0,208,97,0.15)] hover:-translate-y-0.5 transition-all duration-200">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Footer ── */}
        <footer className="text-center py-6 pb-8 px-4 font-satoshi">
          <p className="text-[17px] leading-6 text-[#555] text-center px-4">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-[#0F0F0F] font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
