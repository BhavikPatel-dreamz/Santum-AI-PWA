"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function LoadingScreen({ onDone }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof onDoneRef.current === "function") {
        onDoneRef.current();
      }
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center overflow-hidden" style={{ zIndex: 99999 }}>
      {/* Top-left dot pattern */}
      <div className="absolute top-0 left-0 w-36 h-36 opacity-20">
        <Image
          src="/icons/dots_pattern.png"
          alt=""
          fill
          sizes="144px"
          className="object-contain"
          loading="eager"
        />
      </div>

      {/* Center content */}
      <div
        className="flex flex-col items-center text-center z-10"
        style={{ animation: "fadeInUp 0.8s ease-out both" }}
      >
        <div
          className="relative w-28 h-28"
          style={{ animation: "logoPulse 2s ease-in-out infinite" }}
        >
          <Image
            src="/icons/logo.png"
            alt="Amigo GPT"
            fill
            sizes="112px"
            className="object-contain"
            priority
            loading="eager"
          />
        </div>

        <h1 className="text-5xl font-bold leading-[60px] text-[#0f0f0f] pt-4 pb-2 font-[Poppins]">
          Amigo GPT
        </h1>
        <p className="text-lg font-medium text-[#555555] leading-6 font-[Poppins]">
          Where Intelligence Meets Innovation
        </p>
      </div>

      {/* Bottom-right dot pattern */}
      <div className="absolute bottom-0 right-0 w-36 h-36 opacity-20">
        <Image
          src="/icons/dots_pattern_bottom.png"
          alt=""
          fill
          sizes="144px"
          className="object-contain"
        />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}