"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

/* ── Reusable floating-label input ── */
function FloatingInput({ id, label, type = "text", inputMode, extraClass = "", rightIcon = null }) {
    const [value, setValue] = useState("");
    return (
        <div className="relative mb-[15px]">
            <input
                type={type}
                id={id}
                inputMode={inputMode}
                autoComplete="off"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder=" "
                className={`peer block w-full h-[64px] bg-[#F5F5F5] border-none rounded-[12px] outline-none pl-4 pr-[50px] pt-5 pb-0 text-[#0F0F0F] font-satoshi text-[18px] font-medium leading-6 transition-all duration-300 ${extraClass}`}
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
            {rightIcon && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {rightIcon}
                </div>
            )}
        </div>
    );
}

/* ── Calendar icon ── */
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3V7" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 3V7" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 11H20" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 15H10V17H8V15Z" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function PersonalInformationPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [dob, setDob] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAvatar(url);
    };

    const handleContinue = () => {
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
            router.push("/finger-print");
        }, 3000);
    };

    return (
        <>
            <div className="min-h-dvh bg-white">
                <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
                    <header className="relative h-[105px] overflow-hidden bg-[#23cf67] px-5 pt-6">
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
                                Personal Information
                            </h1>
                        </div>
                    </header>

                    {/* ── White card section ── */}
                    <section className="relative -mt-6 flex flex-1 flex-col items-center rounded-t-[32px] bg-white px-5 pb-28 pt-6 overflow-y-auto">

                        {/* Avatar upload — .camera_main */}
                        <div className="relative flex items-center justify-center mb-6">
                            {/* .circle-img-girl */}
                            <div className="w-[120px] h-[120px] rounded-full overflow-hidden mt-[10px]">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                                            stroke="#AAAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Camera button — .ri-camera-line / upload-button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute right-0 bottom-[22px] cursor-pointer"
                                aria-label="Upload profile picture"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="20" r="20" fill="#0F0F0F" />
                                    <path d="M13 15H14C14.5304 15 15.0391 14.7893 15.4142 14.4142C15.7893 14.0391 16 13.5304 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12H23C23.2652 12 23.5196 12.1054 23.7071 12.2929C23.8946 12.4804 24 12.7348 24 13C24 13.5304 24.2107 14.0391 24.5858 14.4142C24.9609 14.7893 25.4696 15 26 15H27C27.5304 15 28.0391 15.2107 28.4142 15.5858C28.7893 15.9609 29 16.4696 29 17V26C29 26.5304 28.7893 27.0391 28.4142 27.4142C28.0391 27.7893 27.5304 28 27 28H13C12.4696 28 11.9609 27.7893 11.5858 27.4142C11.2107 27.0391 11 26.5304 11 26V17C11 16.4696 11.2107 15.9609 11.5858 15.5858C11.9609 15.2107 12.4696 15 13 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20 24C21.6569 24 23 22.6569 23 21C23 19.3431 21.6569 18 20 18C18.3431 18 17 19.3431 17 21C17 22.6569 18.3431 24 20 24Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Form fields — .new_password_input */}
                        <div className="w-full">
                            <FloatingInput id="first-name" label="First Name" />
                            <FloatingInput id="last-name" label="Last Name" />
                            <FloatingInput id="email-address" label="Email Address" type="email" />
                            <FloatingInput
                                id="mobile-number"
                                label="Mobile Number"
                                type="tel"
                                inputMode="numeric"
                                extraClass="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />

                            {/* Date of Birth — masked text input */}
                            <div className="relative mb-[15px]">
                                <input
                                    type="text"
                                    id="dob"
                                    autoComplete="off"
                                    required
                                    value={dob}
                                    onChange={(e) => {
                                        let raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                                        let formatted = raw;
                                        if (raw.length > 4) formatted = raw.slice(0, 2) + "/" + raw.slice(2, 4) + "/" + raw.slice(4);
                                        else if (raw.length > 2) formatted = raw.slice(0, 2) + "/" + raw.slice(2);
                                        setDob(formatted);
                                    }}
                                    placeholder=" "
                                    maxLength={10}
                                    inputMode="numeric"
                                    className="
                                        peer block w-full h-[64px]
                                        bg-[#F5F5F5] border-none rounded-[12px]
                                        outline-none pl-4 pr-[50px] pt-5 pb-0
                                        text-[#0F0F0F] font-satoshi text-[18px] font-medium leading-6
                                        transition-all duration-300
                                    "
                                />
                                <label
                                    htmlFor="dob"
                                    className="
                                        absolute z-10 left-[16px]
                                        text-[#555] font-satoshi font-medium leading-5
                                        transition-all duration-300 cursor-text pointer-events-none
                                        top-1/2 -translate-y-1/2 text-[16px]
                                        peer-focus:top-[14px] peer-focus:-translate-y-0 peer-focus:text-[12px] peer-focus:text-[#00D061]
                                        peer-[&:not(:placeholder-shown)]:top-[14px] peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-[12px] peer-[&:not(:placeholder-shown)]:text-[#00D061]
                                    "
                                >
                                    Date of Birth (DD/MM/YYYY)
                                </label>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <CalendarIcon />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Continue button — fixed bottom ── */}
                    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-[600px] px-5 z-10">
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="w-full max-w-[343px] mx-auto block py-[18px] rounded-[12px] bg-[#00D061] text-white text-[18px] font-medium leading-6 text-center transition-all duration-200 hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}