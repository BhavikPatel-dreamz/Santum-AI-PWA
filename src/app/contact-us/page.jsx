import SettingsDetailPage from "@/components/app/SettingsDetailPage";
import { SETTINGS_PAGE_CONTENT } from "@/lib/content/settings-pages";
import { SETTINGS_PAGE_ROUTES } from "@/lib/content/settings-routes";
import { createSeoMetadata } from "@/lib/seo";

const content = SETTINGS_PAGE_CONTENT["contact-us"];

export const metadata = createSeoMetadata({
  title: content.title,
  description: content.description,
  path: SETTINGS_PAGE_ROUTES["contact-us"],
});

export default function ContactUsPage() {
  return <SettingsDetailPage content={content} />;
}
