import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Fingerprint setup",
  description: "Set up fingerprint unlock for Santum AI.",
  path: "/finger-scan",
  index: false,
});

export default function FingerScanLayout({ children }: { children: ReactNode }) {
  return children;
}
