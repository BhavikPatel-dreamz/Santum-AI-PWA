import SantumPlatformClient from "./SantumPlatformClient";
import { SETTINGS_PAGE_ROUTES } from "@/lib/content/settings-routes";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Santum Platform",
  description:
    "Learn how the Santum platform connects members with human therapist support and wellness resources.",
  path: SETTINGS_PAGE_ROUTES["santum-platform"],
});

export default function SantumPlatformPage() {
  return <SantumPlatformClient />;
}
