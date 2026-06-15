import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Santum AI plans",
  description: "View Santum AI subscription plan options.",
  path: "/plus-subscription",
  index: false,
});

export default function PlusSubscriptionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
