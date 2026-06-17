import SettingsDetailPage from "@/components/app/SettingsDetailPage";
import { SETTINGS_PAGE_CONTENT } from "@/lib/content/settings-pages";
import { SETTINGS_PAGE_ROUTES } from "@/lib/content/settings-routes";
import { createSeoMetadata } from "@/lib/seo";

const content = SETTINGS_PAGE_CONTENT["send-feedback"];

export const metadata = createSeoMetadata({
  title: content.title,
  description: content.description,
  path: SETTINGS_PAGE_ROUTES["send-feedback"],
});

export default function FeedbackPage() {
  return <SettingsDetailPage content={content} />;
}
