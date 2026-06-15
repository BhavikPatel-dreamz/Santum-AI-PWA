import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Chat with Sai",
  description: "Chat privately with Sai in Santum AI.",
  path: "/santumai-chat",
  index: false,
});

export default function SantumAIChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
