import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Home",
  description: "Your private Santum AI emotional wellbeing home.",
  path: "/home",
  index: false,
});

export default function HomeLayout({ children }: { children: ReactNode }) {
  return children;
}
