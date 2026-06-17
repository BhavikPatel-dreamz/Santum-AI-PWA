import type { MetadataRoute } from "next";
import {
  SEO_SETTINGS_PAGE_KEYS,
  SETTINGS_PAGE_ROUTES,
} from "@/lib/content/settings-routes";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const settingsPages = SEO_SETTINGS_PAGE_KEYS.map((key) => ({
    url: absoluteUrl(SETTINGS_PAGE_ROUTES[key]),
    changeFrequency: "monthly" as const,
    priority: key === "faqs" || key === "legal" ? 0.8 : 0.6,
  }));

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    ...settingsPages,
  ];
}
