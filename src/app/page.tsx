import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Santum AI | Start your private emotional wellbeing journey",
  description:
    "Santum AI is a private PWA for guided text-based emotional wellbeing support, built to help users feel calm, heard, and understood.",
  path: "/",
});

export default function RootPage() {
  return <HomeClient />;
}
