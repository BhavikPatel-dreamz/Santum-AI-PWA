"use client";

import { useRouter } from "next/navigation";
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

                <HeaderSection title={"Verify Phone Number"}/>

                <section className="relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white pb-10 pt-3">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-8 mt-2 flex aspect-square w-full max-w-[343px] items-center justify-center bg-[#d9d9d9]">
                            <span className="text-[22px] font-semibold tracking-[0.02em] text-[#616161]">
                                343 x 343
                            </span>
                        </div>

                        <p className="mb-8 text-[18px] text-center leading-6 text-center text-[#555] font-satoshi">
                            Stay notified about new car, offer status and other updates. You can turn off any time from setting.
                        </p>


                    </div>

                    <div className="flex-1" />

                    <button
                        type="button"
                        disabled={!isComplete}
                        className={`w-full max-w-[343px] mx-auto py-4 rounded-[14px] text-white text-[18px] font-semibold tracking-wide transition-all duration-200  bg-[#00D061] hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0`}
                    >
                        Verify
                    </button>
                </section>
            </div >
        </div >
    );
}
