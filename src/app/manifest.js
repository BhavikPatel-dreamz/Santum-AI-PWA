export default function manifest() {
  return {
    id: "/",
    name: "SantumAI",
    short_name: "SantumAI",
    description:
      "A standalone AI counselling PWA for text-based emotional wellbeing support.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#323d51",
    theme_color: "#323d51",
    icons: [
      {
        src: "/favicon/no-mask-web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/no-mask-web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
