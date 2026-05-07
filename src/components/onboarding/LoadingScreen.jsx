"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen({ onDone }) {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    setTheme(localStorage.getItem("theme"));
    const t = setTimeout(() => {
      if (typeof onDone === "function") {
        onDone();
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="theme-surface fixed inset-0 flex items-center justify-center overflow-hidden transition-colors duration-300"
      style={{ zIndex: 99999 }}
    >
      {/* Top-left dot pattern */}
      {/* <div className="absolute top-0 left-0 w-full h-1/2 opacity-30">
        <Image
          src="/icons/dots_pattern.png"
          alt=""
          fill
          className="object-cover"
          loading="eager"
        />
      </div> */}

      {/* Center content */}
      <div
        className="flex flex-col items-center text-center z-10"
        style={{ animation: "fadeInUp 0.8s ease-out both" }}
      >
        <div
          className="relative h-[260px] w-[260px] sm:h-[340px] sm:w-[340px] lg:h-[420px] lg:w-[420px]"
          style={{ animation: "logoPulse 2s ease-in-out infinite" }}
        >
          <Image
            src={
              theme === "dark"
                ? "/Logo Source files 21-4/Logo/SVG/Artboard3.svg"
                : "/Logo Source files 21-4/Logo/SVG/Artboard2.svg"
            }
            alt="SantumAI"
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 420px"
            className="object-contain size-10"
            priority
            loading="eager"
          />
        </div>

        <p className="theme-text-secondary text-lg font-medium leading-6 font-poppins">
          Best Viewed on Mobile Phone
        </p>
      </div>

      {/* Bottom-right dot pattern */}
      {/* <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-30">
        <Image
          src="/icons/dots_pattern_bottom.png"
          alt=""
          fill
          className="object-cover"
        />
      </div> */}

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
