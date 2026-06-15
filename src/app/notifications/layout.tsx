import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Notifications",
  description: "Manage Santum AI notification preferences.",
  path: "/notifications",
  index: false,
});

export default function NotificationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
