export default function manifest() {
  return {
    name: "SantumAI",
    short_name: "SantumAI",
    description:
      "A standalone AI counselling PWA for text-based emotional wellbeing support.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
