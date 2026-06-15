import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Reset password",
  description: "Recover access to your Santum AI account.",
  path: "/forgot-password",
  index: false,
});

export default function ForgotPasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
