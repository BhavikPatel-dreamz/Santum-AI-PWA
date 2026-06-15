import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Credits",
  description: "Review your Santum AI credit balance.",
  path: "/settings/credits",
  index: false,
});

export default function CreditsLayout({ children }: { children: ReactNode }) {
  return children;
}
