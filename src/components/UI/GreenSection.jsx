import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GreenSection = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex min-h-[240px] h-[32vh] max-h-[360px] flex-shrink-0 items-center justify-center overflow-hidden bg-[#323d51] pb-6 sm:min-h-[300px] sm:h-[38vh] sm:pb-10 lg:min-h-[420px] lg:max-h-[460px] lg:pb-16">
        
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-[10px] border-2 border-white/60 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:left-6 sm:top-6 sm:h-11 sm:w-11 lg:left-8 lg:top-8"
          >
            <ArrowLeft size={18} />
          </button>
        <div className="flex items-center justify-center -translate-y-8 sm:-translate-y-10 lg:-translate-y-12">
          <Image
            src="/Logo Source files 21-4/Icon/SVG/Artboard1.svg"
            alt="SantumAI logo"
            width={180}
            height={180}
            priority
            className="h-[144px] w-[144px] object-contain sm:h-[198px] sm:w-[198px] lg:h-[252px] lg:w-[252px]"
          />
        </div>
      </div>
    </div>
  );
};

export default GreenSection;
