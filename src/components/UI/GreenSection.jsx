import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const GreenSection = ({show}) => {
   const router = useRouter()
  return (
    <div>
      <div className="relative bg-[#00D061] h-94 flex items-end justify-center pb-12 overflow-hidden flex-shrink-0">
        {/* Circuit SVG background */}
        <Image
          src="/icons/let-you-screen-main-img.jpg"
          alt=""
          width={375}
          height={375}
          priority
          unoptimized
          sizes="(max-width: 600px) 100vw, 600px"
          className="absolute top-0 left-1/2 h-full w-auto max-w-[800px] -translate-x-1/2"
        />

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="absolute top-5 left-5 z-10 w-10 h-10 rounded-[10px] border-2 border-white/60 bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/25 transition-colors"
        >
          <ArrowLeft size={18}/>
        </button>

        {/* Logo */}
        <div className="absolute top-21 z-10 w-[120px] h-[120px] bg-white rounded-[24px] flex items-center justify-center">
          <div className="flex items-center justify-center">
            <Image
              src="/icons/logo.png"
              alt="Amigo logo"
              width={120}
              height={120}
              priority
              className="h-22 w-22 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenSection;
