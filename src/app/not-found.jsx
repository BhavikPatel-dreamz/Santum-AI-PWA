import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "Page Not Found | Santum AI",
};

export default function NotFound() {
  return (
    <div className="theme-surface flex min-h-dvh items-center justify-center px-5 py-8 text-[#323d51] transition-colors duration-300 sm:px-8 md:px-10">
      <section className="flex w-full max-w-[680px] flex-col items-center text-center">
        <div className="flex w-full items-center justify-center">
          <Image
            src="/Logo Source files 21-4/Icon/SVG/Artboard1.svg"
            alt="Santum AI"
            width={280}
            height={280}
            className="h-auto w-[170px] object-contain sm:w-[220px] md:w-[260px] lg:w-[280px]"
            priority
          />
        </div>

        <p className="mt-3 max-w-full text-center text-[96px] font-bold leading-none tracking-[0.06em] sm:text-[128px] md:text-[156px] lg:text-[172px]">
          404
        </p>
        <h1 className="mt-4 text-[30px] font-bold leading-tight sm:text-[36px] md:text-[42px]">
          Page not found
        </h1>
        <p className="theme-text-secondary mt-4 max-w-[420px] text-[17px] leading-7 sm:text-[18px]">
          This page is not available.
        </p>

        <div className="mt-9 flex w-full max-w-[430px] flex-col gap-3 sm:mt-10">
          <Link
            href="/home"
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#00D061] px-5 text-[16px] font-semibold text-white shadow-[0_16px_32px_rgba(0,208,97,0.22)] transition-opacity duration-200 hover:opacity-90 sm:min-h-16 sm:text-[17px]"
          >
            <Home aria-hidden="true" size={20} strokeWidth={2.3} />
            Go to home
          </Link>
          <Link
            href="/santumai-chat"
            className="theme-secondary-button flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 text-[16px] font-semibold transition-opacity duration-200 hover:opacity-90 sm:min-h-16 sm:text-[17px]"
          >
            <ArrowLeft aria-hidden="true" size={20} strokeWidth={2.3} />
            Back to chat
          </Link>
        </div>
      </section>
    </div>
  );
}
