import { ThemeProvider } from "@/components/providers/ThemeProvider";
import LoadingScreenWrapper from "@/components/onboarding/LoadingScreenWrapper";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { getThemeInitScript } from "@/lib/theme";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "SantumAI",
  description:
    "A standalone AI counselling PWA for text-based emotional wellbeing support.",
  icons: {
    icon: "/Logo Source files 21-4/Icon/SVG/Artboard1.svg",
  },
};

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
      <body className="min-h-full flex flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {getThemeInitScript()}
        </Script>
        <ReduxProvider>
          <ThemeProvider>
            <LoadingScreenWrapper />
            <PageTransitionProvider>
              <Suspense>
                <main className="flex-1">{children}</main>
                <Toaster
                  position="top-center"
                  toastOptions={{
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
