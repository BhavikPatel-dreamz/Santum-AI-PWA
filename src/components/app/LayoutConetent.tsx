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
      {children}

      {!shouldHideFooter && (
        <div id="global-footer">
          <Footer />
        </div>
      )}
    </div>
  );
}
