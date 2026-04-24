import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import LoadingScreenWrapper from "@/components/onboarding/LoadingScreenWrapper"; // ← new wrapper
import { Toaster } from "react-hot-toast";

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
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-poppins">
        <ReduxProvider>
          {/* LoadingScreenWrapper manages its own dismissal via onDone */}
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
        </ReduxProvider>
      </body>
    </html>
  );
}
