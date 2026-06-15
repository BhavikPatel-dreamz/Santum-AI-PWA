import SettingsDetailPage from "@/components/app/SettingsDetailPage";
import { SETTINGS_PAGE_CONTENT } from "@/lib/content/settings-pages";
import { createSeoMetadata } from "@/lib/seo";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = SETTINGS_PAGE_CONTENT[slug];

  return createSeoMetadata({
    title: content?.title || "Settings",
    description: content?.description || "Manage Santum AI settings.",
    path: `/settings/${slug}`,
    index: false,
  });
}

export default async function SettingsSlugPage({ params }) {
  const { slug } = await params;

  if (slug === "notification-options") {
    redirect("/notifications");
  }

  if (slug === "about-amigo") {
    redirect("/settings/about-santumai");
  }

  const content = SETTINGS_PAGE_CONTENT[slug];

  if (!content) {
    notFound();
  }

  return <SettingsDetailPage content={content} />;
}
