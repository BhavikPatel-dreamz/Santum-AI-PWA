"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";

function PasswordInput({ id, label, value, onChange }) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative mb-[15px]">
            <input
                type={show ? "text" : "password"}
                id={id}
                autoComplete="off"
                required
                value={value}
                onChange={onChange}
                placeholder=" "
                className="
                    peer block w-full h-[64px]
                    bg-[#F5F5F5]
                    border-none
                    rounded-[12px]
                    outline-none
                    pl-4 pr-[50px]
                    pt-5 pb-0
                    text-[#0F0F0F] font-satoshi text-[18px] font-medium leading-6
                    transition-all duration-300
                "
            />
            <label
                htmlFor={id}
                className="
                    absolute z-10 left-[16px]
                    text-[#555] font-satoshi font-medium leading-5
                    transition-all duration-300 cursor-text pointer-events-none
                    top-1/2 -translate-y-1/2 text-[16px]
                    peer-focus:top-[14px] peer-focus:-translate-y-0 peer-focus:text-[12px] peer-focus:text-[#00D061]
                    peer-[&:not(:placeholder-shown)]:top-[14px] peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-[12px] peer-[&:not(:placeholder-shown)]:text-[#00D061]
                "
            >
                {label}
            </label>

            {/* Eye toggle */}
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] focus:outline-none"
                aria-label={show ? "Hide password" : "Show password"}
            >
                {show ? (
                    /* eye-open */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                ) : (
                    /* eye-slash */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default function CreateNewPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isComplete = password.trim() !== "" && confirmPassword.trim() !== "";
    const isMatch = password === confirmPassword;

    const handleSubmit = () => {
        if (!isComplete || !isMatch) return;
        router.push("/personal-information");
    };

    return (
        <div className="min-h-dvh bg-white">
            <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">

                <HeaderSection title={"Create New password"}/>

                {/* ── White card section ── */}
                <section className="relative -mt-6 flex flex-1 flex-col rounded-t-[32px] bg-white px-5 pb-10 pt-6">

                    {/* Illustration */}
                    <div className="mx-auto mb-6 flex w-full max-w-[343px] aspect-square items-center justify-center rounded-[16px] bg-[#d9d9d9]">
                        <span className="text-[22px] font-semibold tracking-[0.02em] text-[#616161]">
                            343 × 343
                        </span>
                    </div>

                    {/* Sub text */}
                    <p className="text-[18px] leading-6 text-[#555] font-satoshi text-center pb-5">
                        Create Your New Password
                    </p>

                    {/* Password inputs */}
                    <div className="w-full">
                        <PasswordInput
                            id="new-password"
                            label="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <PasswordInput
                            id="confirm-password"
                            label="Re Enter New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {/* Mismatch error */}
                        {confirmPassword !== "" && !isMatch && (
                            <p className="mt-1 text-[13px] text-red-500 pl-4">
                                Passwords do not match.
                            </p>
                        )}
                    </div>

                    <div className="flex-1" />

                    {/* Change Password button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isComplete || !isMatch}
                        className={`mt-8 mx-auto w-full max-w-[343px] py-4 rounded-[14px] text-white text-[18px] font-semibold tracking-wide transition-all duration-200
                            ${isComplete && isMatch
                                ? "bg-[#00D061] hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0"
                                : "bg-[#A8F0CB] cursor-not-allowed"
                            }`}
                    >
                        Change Password
                    </button>
                </section>
            </div>
        </div>
    );
}