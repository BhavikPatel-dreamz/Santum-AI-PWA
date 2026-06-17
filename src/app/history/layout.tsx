import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Chat history",
  description: "Review your private Santum AI chat history.",
  path: "/history",
  index: false,
});

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return children;
}
