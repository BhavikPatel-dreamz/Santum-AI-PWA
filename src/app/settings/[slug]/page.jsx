import SettingsDetailPage from "@/components/app/SettingsDetailPage";
import { SETTINGS_PAGE_CONTENT } from "@/lib/content/settings-pages";
import { notFound, redirect } from "next/navigation";

export default async function SettingsSlugPage({ params }) {
  const { slug } = await params;

  if (slug === "notification-options") {
    redirect("/notifications");
  }

  const content = SETTINGS_PAGE_CONTENT[slug];

  if (!content) {
    notFound();
  }

  return <SettingsDetailPage content={content} />;
}
