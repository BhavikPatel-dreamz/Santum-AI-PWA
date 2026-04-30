import { ThemeProvider } from "@/components/providers/ThemeProvider";
import LoadingScreenWrapper from "@/components/onboarding/LoadingScreenWrapper";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { getThemeInitScript } from "@/lib/theme";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import LoadingScreenWrapper from "@/components/onboarding/LoadingScreenWrapper"; // ← new wrapper

const poppins = Poppins({
  variable: "--font-poppins-ui",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amigo App",
  description: "A PWA with RTK Query",
  manifest: "/manifest.json",
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
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-poppins">
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
