import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Create new password",
  description: "Create a new password for your Santum AI account.",
  path: "/new-password",
  index: false,
});

export default function NewPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
