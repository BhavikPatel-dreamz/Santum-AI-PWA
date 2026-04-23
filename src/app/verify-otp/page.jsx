"use client";

import { useEffect, useRef, useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";

export default function OtpPage() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [resendTimer, setResendTimer] = useState(30);
    const inputRefs = useRef([]);

    const maskedPhone = "*** *** **65";
    const canResend = resendTimer === 0;

    useEffect(() => {
        if (canResend) {
            return;
        }

        const timeoutId = setTimeout(() => {
            setResendTimer((currentValue) => currentValue - 1);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [canResend, resendTimer]);

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

    const handleResend = () => {
        if (!canResend) {
            return;
        }

        setOtp(["", "", "", ""]);
        setResendTimer(30);
        inputRefs.current[0]?.focus();
    };

    const isComplete = otp.every((digit) => digit !== "");

    return (
        <div className="min-h-dvh bg-white">
            <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
                {/* <header className="relative h-[120px] overflow-hidden bg-[#23cf67] px-5 pt-6">
                    <Image
                        src="/icons/let-you-screen-main-img.jpg"
                        alt=""
                        width={480}
                        height={108}
                        priority
                        unoptimized
                        sizes="(max-width: 480px) 100vw, 480px"
                        className="absolute inset-0 top-0 w-[60%] mx-auto object-cover"
                    />

                    <div className="relative z-10 flex items-center gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            aria-label="Go back"
                            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/80 bg-white/10 text-white transition-colors hover:bg-white/15"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="15 18 9 12 15 6" />
                                <line x1="9" y1="12" x2="20" y2="12" />
                            </svg>
                        </button>
                        <h1 className="text-[18px] font-medium leading-6 text-white">
                            Verify Phone Number
                        </h1>
                    </div>
                </header> */}
                <HeaderSection title={"Verify Phone Number"}/>

                <section className="relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white pb-10 pt-3">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-8 mt-2 flex aspect-square w-full max-w-[343px] items-center justify-center bg-[#d9d9d9]">
                            <span className="text-[22px] font-semibold tracking-[0.02em] text-[#616161]">
                                343 x 343
                            </span>
                        </div>

                        <p className="mb-8 font-satoshi text-[18px] leading-6 text-center text-[#555]">
                            Please enter the verification code we sent to your mobile{" "}
                            <span>{maskedPhone}</span>
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

                        <p className="px-4 text-center text-[18px] leading-6 text-[#555] font-satoshi">
                            Not yet get?{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={!canResend}
                                aria-label={
                                    canResend
                                        ? "Resend OTP"
                                        : `Resend OTP available in ${resendTimer} seconds`
                                }
                                className="font-semibold text-[#0F0F0F] disabled:opacity-100"
                            >
                                Resend OTP
                            </button>
                        </p>
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
