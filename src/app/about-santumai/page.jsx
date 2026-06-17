import SettingsDetailPage from "@/components/app/SettingsDetailPage";
import { SETTINGS_PAGE_CONTENT } from "@/lib/content/settings-pages";
import { SETTINGS_PAGE_ROUTES } from "@/lib/content/settings-routes";
import { createSeoMetadata } from "@/lib/seo";

const content = SETTINGS_PAGE_CONTENT["about-santumai"];

export const metadata = createSeoMetadata({
  title: content.title,
  description: content.description,
  path: SETTINGS_PAGE_ROUTES["about-santumai"],
});

export default function AboutSantumaiPage() {
  return <SettingsDetailPage content={content} />;
}
