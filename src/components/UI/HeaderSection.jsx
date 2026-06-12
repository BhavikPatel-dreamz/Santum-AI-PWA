import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderSection = ({ title, showImage = true }) => {
  const router = useRouter();

  return (
    <header className=" h-[120px] overflow-hidden bg-[#323d51] px-5 pt-3 sm:h-[136px] sm:px-6 sm:pt-7 lg:h-[156px] lg:px-10 lg:pt-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/80 bg-white/10 text-white transition-colors hover:bg-white/15 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
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
        <div className=" w-full flex items-center justify-between">
          <h1 className="text-[18px] font-medium leading-6 text-[#dedede] sm:text-[20px] lg:text-[24px] lg:leading-8">
            {title}
          </h1>
          <div className="flex items-center justify-end w-[95px] h-[63.33px]">
            {showImage ? <Image
              src="/Logo Source files 21-4/Icon/SVG/Artboard1.svg"
              alt=""
              width={95}
              height={95}
              className=""
            /> : <Image
              src="/message.png"
              alt=""
              width={64}
              height={64}
              className=""
            />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
