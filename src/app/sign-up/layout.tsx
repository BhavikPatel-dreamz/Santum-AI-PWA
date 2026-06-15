import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Create account",
  description: "Create a Santum AI account for private emotional wellbeing support.",
  path: "/sign-up",
  index: false,
});

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return children;
}
