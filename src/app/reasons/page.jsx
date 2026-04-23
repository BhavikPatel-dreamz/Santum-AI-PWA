"use client";

import { useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";

const REASONS = [
    { id: 1, label: "Generate creative text formats" },
    { id: 2, label: "Access to real-time data" },
    { id: 3, label: "User-friendly interface" },
    { id: 4, label: "Google Workspace integration" },
    { id: 5, label: "Free to use" },
    { id: 6, label: "Others reason" },
];

const BackIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
        <line x1="9" y1="12" x2="20" y2="12" />
    </svg>
);

const CheckIcon = () => (
    <svg width="11" height="9" viewBox="0 0 12 10" fill="none">
        <polyline
            points="1 5 4.5 8.5 11 1.5"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function ReasonScreen() {
    const [checked, setChecked] = useState({ 1: true, 4: true });

    const toggle = (id) =>
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

    const anyChecked = Object.values(checked).some(Boolean);

    return (
        <div className="min-h-dvh bg-white">
            <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
                {/* Header */}
                <HeaderSection title={"Reason For Using Amigo GPT"}/>

                {/* Content card */}
                <section className="relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white pb-10 pt-8 px-5">

                    <p className="text-[18px] leading-[24px] text-[#555] mb-7 font-satoshi">
                        We want to provide the best experience according to your needs.
                    </p>

                    {/* ── Reason list ── */}
                    <ul
                        className="border-t-2 border-[#F5F5F5]"
                        role="group"
                        aria-label="Reason options"
                    >
                        {REASONS.map((item) => {
                            const isChecked = !!checked[item.id];
                            return (
                                <li
                                    key={item.id}
                                    role="checkbox"
                                    aria-checked={isChecked}
                                    tabIndex={0}
                                    onClick={() => toggle(item.id)}
                                    onKeyDown={(e) => e.key === " " && toggle(item.id)}
                                    className="flex items-center justify-between py-[17px] border-b-2 border-[#F5F5F5] cursor-pointer select-none transition-colors active:bg-green-50"
                                >
                                    {/* Label */}
                                    <span
                                        className={`flex items-center text-[16px] leading-[24px] font-medium cursor-pointer transition-colors ${isChecked ? "text-[#0F0F0F]" : "text-[#555]"
                                            }`}
                                    >
                                        {item.label}
                                    </span>

                                    {/* Custom checkbox */}
                                    <div
                                        className={`w-5 h-5 rounded-[5px] flex items-center justify-center flex-shrink-0 border-2 transition-all duration-150 ${isChecked
                                            ? "bg-[#00D061] border-[#00D061] scale-105"
                                            : "bg-white border-[#00D061]"
                                            }`}
                                    >
                                        {isChecked && <CheckIcon />}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                {/* ── Fixed bottom buttons ── */}
                <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[600px] px-5 pb-7 pt-4 bg-white flex items-center justify-center gap-3 z-10">
                    <button
                        type="button"
                        onClick={() => alert("Navigate to /dashboard")}
                        className="w-[163px] h-12 rounded-[8px] bg-[#F5F5F5] text-[#0F0F0F] text-[17px] font-medium font-[Poppins] transition-all active:scale-[0.97] hover:opacity-80"
                    >
                        Skip
                    </button>

                    <button
                        type="button"
                        disabled={!anyChecked}
                        onClick={() => alert("Navigate to /dashboard")}
                        className={`w-[163px] h-12 rounded-[8px] text-white text-[17px] font-medium font-[Poppins] transition-all active:scale-[0.97] ${anyChecked
                            ? "bg-[#00D061] shadow-[0_4px_20px_rgba(0,208,97,0.35)] hover:opacity-90"
                            : "bg-[#ccc] cursor-not-allowed opacity-60"
                            }`}
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
}