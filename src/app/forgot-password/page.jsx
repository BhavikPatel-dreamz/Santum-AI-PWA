"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";

export default function ForgetPasswordPage() {
    const router = useRouter();
    const [smsValue, setSmsValue] = useState("");
    const [emailValue, setEmailValue] = useState("");

    const isComplete = smsValue.trim() !== "" || emailValue.trim() !== "";

    const handleContinue = () => {
        if (!isComplete) return;
        router.push("/confirm-otp");
    };

    return (
        <div className="min-h-dvh bg-white">
            <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">

                <HeaderSection title={"Verify Phone Number"}/>

                {/* ── White card section ── */}
                <section className="relative -mt-6 flex flex-1 flex-col rounded-t-[32px] bg-white px-5 pb-10 pt-6">

                    {/* Illustration */}
                    <div className="mx-auto mb-4 flex w-full max-w-[343px] aspect-square items-center justify-center rounded-[16px] bg-[#d9d9d9]">
                        <span className="text-[22px] font-semibold tracking-[0.02em] text-[#616161]">
                            343 × 343
                        </span>
                    </div>

                    {/* Description */}
                    <p className="pb-6 font-satoshi text-[18px] leading-[24px] text-[#555] text-center">
                        Select which contact details should we use to reset your password.
                    </p>

                    {/* Form */}
                    <div className="w-full max-w-[600px] mx-auto">

                        {/* via SMS input */}
                        <div className="relative mb-[15px]">
                            <input
                                type="text"
                                id="via-sms"
                                autoComplete="off"
                                required
                                value={smsValue}
                                onChange={(e) => setSmsValue(e.target.value)}
                                className="
                                    peer block w-full h-[64px]
                                    bg-transparent
                                    border-2 border-[#EBEBEB]
                                    rounded-[30px]
                                    outline-none
                                    pl-[80px] pr-4
                                    pt-5 pb-0
                                    text-[#0F0F0F] font-satoshi text-[18px] font-medium leading-6
                                    transition-all duration-300
                                    focus:border-[#00D061]
                                    placeholder-transparent
                                "
                                placeholder=" "
                            />
                            <label
                                htmlFor="via-sms"
                                className="
                                    absolute z-10 left-[80px]
                                    text-[#AAAAAA] font-satoshi font-medium leading-5
                                    transition-all duration-300 cursor-text pointer-events-none
                                    top-1/2 -translate-y-1/2 text-[16px]
                                    peer-focus:top-[14px] peer-focus:-translate-y-0 peer-focus:text-[12px] peer-focus:text-[#00D061]
                                    peer-[&:not(:placeholder-shown)]:top-[14px] peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-[12px] peer-[&:not(:placeholder-shown)]:text-[#00D061]
                                "
                            >
                                via SMS
                            </label>
                            {/* Icon circle */}
                            <div className="absolute top-[8px] left-[8px] w-[48px] h-[48px] bg-[#F0F0F0] rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <mask id="mask-sms" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="white" />
                                    </mask>
                                    <g mask="url(#mask-sms)">
                                        <path d="M11 3H21V11H18L14 13V11H11V3Z" stroke="#00D061" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15 16V20C15 20.2652 14.8946 20.5196 14.7071 20.7071C14.5196 20.8946 14.2652 21 14 21H6C5.73478 21 5.48043 20.8946 5.29289 20.7071C5.10536 20.5196 5 20.2652 5 20V6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5H8" stroke="#00D061" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10 18V18.01" stroke="#00D061" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>
                            </div>
                        </div>

                        {/* via Email input */}
                        <div className="relative mb-[15px]">
                            <input
                                type="text"
                                id="via-email"
                                autoComplete="off"
                                required
                                value={emailValue}
                                onChange={(e) => setEmailValue(e.target.value)}
                                className="
                                    peer block w-full h-[64px]
                                    bg-transparent
                                    border-2 border-[#EBEBEB]
                                    rounded-[30px]
                                    outline-none
                                    pl-[80px] pr-4
                                    pt-5 pb-0
                                    text-[#0F0F0F] font-satoshi text-[18px] font-medium leading-6
                                    transition-all duration-300
                                    focus:border-[#00D061]
                                    placeholder-transparent
                                "
                                placeholder=" "
                            />
                            <label
                                htmlFor="via-email"
                                className="
                                    absolute z-10 left-[80px]
                                    text-[#AAAAAA] font-satoshi font-medium leading-5
                                    transition-all duration-300 cursor-text pointer-events-none
                                    top-1/2 -translate-y-1/2 text-[16px]
                                    peer-focus:top-[14px] peer-focus:-translate-y-0 peer-focus:text-[12px] peer-focus:text-[#00D061]
                                    peer-[&:not(:placeholder-shown)]:top-[14px] peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-[12px] peer-[&:not(:placeholder-shown)]:text-[#00D061]
                                "
                            >
                                via Email
                            </label>
                            {/* Icon circle */}
                            <div className="absolute top-[8px] left-[8px] w-[48px] h-[48px] bg-[#F0F0F0] rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <mask id="mask-email" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="white" />
                                    </mask>
                                    <g mask="url(#mask-email)">
                                        <path d="M3 7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7Z" stroke="#00D061" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 7L12 13L21 7" stroke="#00D061" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>
                            </div>
                        </div>

                    </div>

                    <div className="flex-1" />

                    {/* Continue button */}
                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!isComplete}
                        className={`mt-8 mx-auto w-full max-w-[343px] py-4 rounded-[14px] text-white text-[18px] font-semibold tracking-wide transition-all duration-200
                            ${isComplete
                                ? "bg-[#00D061] hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0"
                                : "bg-[#A8F0CB] cursor-not-allowed"
                            }`}
                    >
                        Continue
                    </button>
                </section>
            </div >
        </div >
    );
}
