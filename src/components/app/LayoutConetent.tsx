"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/app/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const hideFooterRoutes: string[] = [
    "/sign-in",
    "/sign-up",
    "/verify-otp",
    "/finger-scan",
    "/lets-you-in",
    "/offline",
    "/",
  ];
  const shouldHideFooter: boolean = hideFooterRoutes.includes(currentPath);

  return (
    <div className="relative">
      {/* {shouldShowPausedBanner && (
        <div className="sticky top-0 z-[80] border-b border-[#BFEFD2] bg-[#F4FFF8]/95 px-4 py-2 shadow-[0_8px_24px_rgba(15,15,15,0.06)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3">
            <p className="min-w-0 font-satoshi text-[13px] font-medium leading-5 text-[#0F0F0F]">
              <span className="font-semibold">Your account is paused.</span>{" "}
              {PAUSED_ACCOUNT_MESSAGE}
            </p>
            <button
              type="button"
              onClick={() => router.push("/account-management")}
              className="shrink-0 rounded-full bg-[#00D061] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(0,208,97,0.22)]"
            >
              Resume
            </button>
          </div>
        </div>
      )} */}

      {children}

      {!shouldHideFooter && (
        <div id="global-footer">
          <Footer />
        </div>
      )}
    </div>
  );
}
