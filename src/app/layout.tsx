import { ThemeProvider } from "@/components/providers/ThemeProvider";
import LoadingScreenWrapper from "@/components/onboarding/LoadingScreenWrapper";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import OfflineDetector from "@/components/OfflineDetector";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import LayoutContent from "@/components/app/LayoutConetent";
import {
  absoluteUrl,
  createSeoMetadata,
  defaultSeoDescription,
} from "@/lib/seo";

const segoeUi = localFont({
  src: [
    {
      path: "../../public/Logo Source files 21-4/Font/segoeuil.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/seguili.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/segoeuisl.ttf",
      weight: "350",
      style: "normal",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/seguisli.ttf",
      weight: "350",
      style: "italic",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/segoeui.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/segoeuii.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/seguisb.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/seguisbi.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/segoeuib.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/segoeuiz.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/seguibl.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/Logo Source files 21-4/Font/seguibli.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-segoe-ui",
  display: "swap",
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: "Santum AI",
    description: defaultSeoDescription,
  }),
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Santum AI",
    template: "%s | Santum AI",
  },
  manifest: "/manifest.json",
  alternates: undefined,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Santum AI",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

const themeInitScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("theme");
    const theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : "light";

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${segoeUi.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Santum AI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ReduxProvider>
          <ThemeProvider>
            <OfflineDetector />
            <LoadingScreenWrapper />
            <PageTransitionProvider>
              <Suspense>
                <LayoutContent>
                  <main className="flex-1">{children}</main>
                </LayoutContent>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 2000,
                    success: {
                      style: {
                        background: "#00D061",
                        color: "#fff",
                      },
                    },
                    error: {
                      style: {
                        background: "#ffecec",
                        color: "#d32f2f",
                      },
                    },
                  }}
                />
              </Suspense>
            </PageTransitionProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
