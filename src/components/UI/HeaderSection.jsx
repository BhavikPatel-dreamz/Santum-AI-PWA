import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";

const HeaderSection = ({ title }) => {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <header className="relative h-[120px] overflow-hidden bg-[#23cf67] px-5 pt-6 sm:h-[136px] sm:px-6 sm:pt-7 lg:h-[156px] lg:px-10 lg:pt-8">
      <Image
        src={
          isDark
            ? "/icons/let-you-screen-main-img-dark.jpg"
            : "/icons/let-you-screen-main-img.jpg"
        }
        alt=""
        width={960}
        height={220}
        priority
        unoptimized
        sizes="(max-width: 768px) 100vw, 960px"
        className="absolute inset-0 mx-auto h-full w-full max-w-[960px] object-cover object-top"
      />

      <div className="relative z-10 flex items-center gap-3 pt-1 sm:pt-2">
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
        <h1 className="text-[18px] font-medium leading-6 text-white sm:text-[20px] lg:text-[24px] lg:leading-8">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default HeaderSection;
