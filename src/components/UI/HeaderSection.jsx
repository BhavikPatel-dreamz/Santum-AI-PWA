import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderSection = ({ title }) => {
  const router = useRouter();
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    setTheme(localStorage.getItem("amigo-theme"));
  }, []);
  return (
    <header className="relative h-[120px] overflow-hidden bg-[#23cf67] px-5 pt-6">
      <Image
        src={
          theme === "dark"
            ? "/icons/let-you-screen-main-img-dark.jpg"
            : "/icons/let-you-screen-main-img.jpg"
        }
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
        <h1 className="text-[18px] font-medium leading-6 text-white">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default HeaderSection;
