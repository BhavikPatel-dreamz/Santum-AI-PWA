import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Sign in",
  description: "Sign in to continue your private Santum AI support journey.",
  path: "/sign-in",
  index: false,
});

export default function SignInLayout({ children }: { children: ReactNode }) {
  return children;
}
