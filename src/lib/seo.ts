import type { Metadata } from "next";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://santum-ai-pwa.vercel.app",
);

export const defaultSeoDescription =
  "A standalone AI counselling PWA for text-based emotional wellbeing support.";

export const defaultSeoKeywords = [
  "Santum AI",
  "AI counselling",
  "emotional wellbeing",
  "mental health app",
  "PWA",
  "chat support",
];

export const seoImage = {
  path: "/Logo Source files 21-4/Icon/4x/Artboard 1@4x.png",
  width: 2400,
  height: 1600,
  alt: "Santum AI logo",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

type SeoMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  index?: boolean;
};

export function createSeoMetadata({
  title,
  description = defaultSeoDescription,
  path,
  index = true,
}: SeoMetadataOptions): Metadata {
  const pageUrl = path ? absoluteUrl(path) : undefined;
  const imageUrl = absoluteUrl(seoImage.path);

  return {
    title,
    description,
    keywords: defaultSeoKeywords,
    alternates: pageUrl
      ? {
          canonical: pageUrl,
        }
      : undefined,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Santum AI",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: seoImage.width,
          height: seoImage.height,
          alt: seoImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: index
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
  };
}
