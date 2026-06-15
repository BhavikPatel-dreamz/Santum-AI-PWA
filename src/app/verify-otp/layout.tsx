import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Verify email",
  description: "Verify your Santum AI account email.",
  path: "/verify-otp",
  index: false,
});

export default function VerifyOtpLayout({ children }: { children: ReactNode }) {
  return children;
}
