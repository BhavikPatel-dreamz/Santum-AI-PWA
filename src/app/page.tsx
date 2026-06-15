import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "Santum AI | Start your private emotional wellbeing journey",
  description:
    "Santum AI is a private PWA for guided text-based emotional wellbeing support, built to help users feel calm, heard, and understood.",
  openGraph: {
    title: "Santum AI | Start your private emotional wellbeing journey",
    description:
      "Santum AI is a private PWA for guided text-based emotional wellbeing support, built to help users feel calm, heard, and understood.",
    type: "website",
    images: [
      {
        url: "/icons/logo.png",
        width: 1200,
        height: 630,
        alt: "Santum AI logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Santum AI | Start your private emotional wellbeing journey",
    description:
      "Santum AI is a private PWA for guided text-based emotional wellbeing support, built to help users feel calm, heard, and understood.",
    images: ["/icons/logo.png"],
  },
};

export default function RootPage() {
  return <HomeClient />;
}
