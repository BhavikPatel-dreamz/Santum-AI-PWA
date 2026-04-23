"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LANGUAGES = [
    "English", "Chinese", "Hindi", "Portuguese", "Spanish",
    "Arabic", "Bulgarian", "French", "Russian",
];

const Page = () => {
    const router = useRouter();
    const [selected, setSelected] = useState("English");

    return (
        <div className="min-h-dvh bg-white">
            <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
                {/* Header */}
                <header className="relative h-[120px] overflow-hidden bg-[#23cf67] px-5 pt-6">
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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                                <line x1="9" y1="12" x2="20" y2="12" />
                            </svg>
                        </button>
                        <h1 className="text-[18px] font-medium leading-6 text-white">
                            Select Language
                        </h1>
                    </div>
                </header>

                {/* Content card */}
                <section className="relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white pb-10 pt-8 px-5">

                    {/* Greeting */}
                    <h2 className="text-[32px] leading-[40px] font-bold text-[#0F0F0F] font-poppins pt-[10px] pb-[16px]">
                        Hey, Jessica
                    </h2>
                    <p className="text-[18px] leading-6 text-[#555] font-satoshi mb-6">
                        Please select your preferred language to facilitate communication.
                    </p>

                    {/* Language chips */}
                    <div className="flex flex-wrap gap-[10px]">
                        {LANGUAGES.map((lang) => {
                            const isSelected = selected === lang;
                            return (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setSelected(lang)}
                                    className="text-center font-satoshi text-[14px] font-medium leading-[18px] rounded-[8px] border-2 px-[16px] py-[11px] transition-all active:scale-95"
                                    style={{
                                        background: isSelected ? "#111" : "#fff",
                                        borderColor: isSelected ? "#111" : "#F5F5F5",
                                        color: isSelected ? "#fff" : "#0F0F0F",
                                        boxShadow: isSelected ? "0 2px 8px #0002" : "none",
                                    }}
                                >
                                    {lang}
                                </button>
                            );
                        })}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Bottom buttons */}
                    <div className="flex justify-center gap-3 pt-6">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard")}
                            className="w-[163px] h-[48px] flex items-center justify-center rounded-[8px] bg-[#F5F5F5] text-[#0F0F0F] text-[18px] font-medium font-poppins transition-all active:scale-[0.98]"
                        >
                            Skip
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/dashboard")}
                            className="w-[163px] h-[48px] rounded-[8px] text-white text-[18px] font-medium font-poppins transition-all active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, #23cf67 0%, #1ab856 100%)",
                                boxShadow: "0 4px 20px #23cf6740",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Page;