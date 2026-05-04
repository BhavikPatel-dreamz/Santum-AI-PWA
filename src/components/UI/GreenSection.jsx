import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const GreenSection = ({ show = true }) => {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <div>
      <div className="relative flex h-[360px] flex-shrink-0 items-end justify-center overflow-hidden bg-[#00D061] pb-12 sm:h-[420px] sm:pb-14 lg:h-[460px] lg:pb-16">
        {/* Circuit SVG background */}
        <Image
          src={
            isDark
              ? "/icons/let-you-screen-main-img-dark.jpg"
              : "/icons/let-you-screen-main-img.jpg"
          }
          alt=""
          width={1120}
          height={560}
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 85vw, 1120px"
          className="absolute left-1/2 top-0 h-full w-full max-w-[1120px] -translate-x-1/2 object-cover object-top"
        />

        {/* Back button */}
        {show && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-[10px] border-2 border-white/60 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:left-6 sm:top-6 sm:h-11 sm:w-11 lg:left-8 lg:top-8"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Logo */}
        <div className="theme-surface absolute top-20 z-10 flex h-[120px] w-[120px] items-center justify-center rounded-[24px] border border-white/15 shadow-[0_18px_42px_rgba(0,0,0,0.14)] transition-colors duration-300 sm:top-24 sm:h-[136px] sm:w-[136px] lg:top-28 lg:h-[152px] lg:w-[152px]">
          <div className="flex items-center justify-center">
            <Image
              src="/icons/logo.png"
              alt="Amigo logo"
              width={120}
              height={120}
              priority
              className="h-[88px] w-[88px] object-contain sm:h-[98px] sm:w-[98px] lg:h-[112px] lg:w-[112px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenSection;
