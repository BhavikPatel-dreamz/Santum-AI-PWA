import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Continue to Santum AI",
  description: "Choose how to continue into your Santum AI account.",
  path: "/lets-you-in",
  index: false,
});

export default function LetsYouInLayout({ children }: { children: ReactNode }) {
  return children;
}
