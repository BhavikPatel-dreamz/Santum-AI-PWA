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
      <div className="flex min-h-[240px] h-[32vh] max-h-[360px] flex-shrink-0 items-center justify-center overflow-hidden bg-[#323d51] pb-6 sm:min-h-[300px] sm:h-[38vh] sm:pb-10 lg:min-h-[420px] lg:max-h-[460px] lg:pb-16">
        {/* Circuit SVG background */}
        {/* <Image
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
        /> */}

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
        <div className="flex items-center justify-center">
          <Image
            src="/Logo Source files 21-4/Icon/SVG/Artboard1.svg"
            alt="SantumAI logo"
            width={180}
            height={180}
            priority
            className="h-[144px] w-[144px] object-contain sm:h-[198px] sm:w-[198px] lg:h-[252px] lg:w-[252px]"
          />
        </div>

        {/* Logo */}
        {/* <div className=" absolute top-20 z-10 flex h-[132px] w-[132px] items-center justify-center sm:top-32 sm:h-[180px] sm:w-[180px] lg:top-44 lg:h-[228px] lg:w-[228px]">
        </div> */}
      </div>
    </div>
  );
};

export default GreenSection;
