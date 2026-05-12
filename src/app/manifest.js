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
      // {
      //   src: "/Logo Source files 21-4/Icon/0.25x/Artboard-1.png",
      //   sizes: "192x192",
      //   type: "image/png",
      // },
      {
        src: "/Logo Source files 21-4/Icon/1x/1234567.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
