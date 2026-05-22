export default function manifest() {
  return {
    id: "/",
    name: "Santum AI",
    short_name: "Best Viewed on Mobile",
    description:
      "A standalone AI counselling PWA for text-based emotional wellbeing support.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#e4ffee",
    theme_color: "#e4ffee",
    icons: [
      {
        src: "/favicon/no-mask-web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Logo Source files 21-4/Logo/1x/Artboard2.png",
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
        src: "/Logo Source files 21-4/Logo/1x/Artboard2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
