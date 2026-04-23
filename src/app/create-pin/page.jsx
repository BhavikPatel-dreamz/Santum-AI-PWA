"use client";

import { useEffect, useRef, useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";

export default function OtpPage() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);


    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const nextOtp = [...otp];
        nextOtp[index] = value;
        setOtp(nextOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        const pastedValue = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, otp.length);

        if (!pastedValue) {
            return;
        }

        const nextOtp = Array(otp.length).fill("");
        pastedValue.split("").forEach((character, index) => {
            nextOtp[index] = character;
        });

        setOtp(nextOtp);
        inputRefs.current[Math.min(pastedValue.length, otp.length - 1)]?.focus();
        event.preventDefault();
    };


    const isComplete = otp.every((digit) => digit !== "");

    return (
        <div className="min-h-dvh bg-white">
            <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
                <HeaderSection title={"Create New PIN"}/>

                <section className="relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white pb-10 pt-3">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-8 mt-2 flex aspect-square w-full max-w-[343px] items-center justify-center bg-[#d9d9d9]">
                            <span className="text-[22px] font-semibold tracking-[0.02em] text-[#616161]">
                                343 x 343
                            </span>
                        </div>

                        <p className="mb-8 font-satoshi text-[18px] leading-6 text-center text-[#555]">
                          Add a PIN Number to make your account more secure.
                        </p>

                        <div
                            className="mb-7 flex items-center justify-center gap-[10px]"
                            onPaste={handlePaste}
                        >
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(element) => {
                                        inputRefs.current[index] = element;
                                    }}
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(event) => handleChange(index, event.target.value)}
                                    onKeyDown={(event) => handleKeyDown(index, event)}
                                    aria-label={`OTP digit ${index + 1}`}
                                    className={`h-[52px] w-[52px] rounded-full border text-center text-[22px] font-semibold text-[#1a2d21] outline-none transition-all duration-200 ${digit
                                        ? "border-[#23cf67] bg-[#dffbec]"
                                        : "border-transparent bg-[#e5fff1] focus:border-[#23cf67] focus:bg-[#f2fff8]"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1" />

                    <button
                        type="button"
                        disabled={!isComplete}
                        className={`w-full max-w-[343px] mx-auto py-4 rounded-[14px] text-white text-[18px] font-semibold tracking-wide transition-all duration-200
              ${isComplete
                                ? "bg-[#00D061] hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0"
                                : "bg-[#A8F0CB] cursor-not-allowed"
                            }`}
                    >
                        Verify
                    </button>
                </section>
            </div >
        </div >
    );
}
