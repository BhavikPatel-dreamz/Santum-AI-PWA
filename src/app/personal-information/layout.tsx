import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Personal information",
  description: "Manage your Santum AI profile information.",
  path: "/personal-information",
  index: false,
});

export default function PersonalInformationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
