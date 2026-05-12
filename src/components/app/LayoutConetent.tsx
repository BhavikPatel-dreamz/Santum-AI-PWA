"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/app/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooterRoutes: string[] = [
    "/sign-in",
    "/sign-up",
    "/verify-otp",
    "/finger-scan",
    "/lets-you-in",
    "/",
  ];
  const shouldHideFooter: boolean = hideFooterRoutes.includes(pathname ?? "");
  return (
    <div className="relative">
      {children}

      {!shouldHideFooter && (
        <div id="global-footer">
          <Footer />
        </div>
      )}
    </div>
  );
}
