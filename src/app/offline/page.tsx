import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="theme-shell flex min-h-dvh items-center justify-center px-5 py-8 transition-colors duration-300">
      <section className="theme-surface theme-border flex w-full max-w-md flex-col items-center rounded-[28px] border px-6 py-10 text-center shadow-[0_24px_64px_rgba(15,15,15,0.08)] transition-colors duration-300 sm:px-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8FFF1] text-[#00A84D]">
          <WifiOff aria-hidden="true" size={32} strokeWidth={2.2} />
        </div>

        <h1 className="theme-text-primary text-[28px] font-bold leading-tight">
          You are offline
        </h1>
        <p className="theme-text-secondary mt-3 max-w-[280px] text-[16px] leading-6">
          Please reconnect to the internet.
        </p>
      </section>
    </div>
  );
}
