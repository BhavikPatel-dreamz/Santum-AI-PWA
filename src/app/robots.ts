import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/confirm-otp",
        "/finger-scan",
        "/forgot-password",
        "/home",
        "/lets-you-in",
        "/new-password",
        "/notifications",
        "/offline",
        "/personal-information",
        "/plus-subscription",
        "/santumai-chat",
        "/settings/",
        "/sign-in",
        "/sign-up",
        "/verify-otp",
        "/current-plan",
        "/buy-plan"
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
