import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Confirm OTP",
  description: "Confirm your Santum AI verification code.",
  path: "/confirm-otp",
  index: false,
});

export default function ConfirmOtpLayout({ children }: { children: ReactNode }) {
  return children;
}
