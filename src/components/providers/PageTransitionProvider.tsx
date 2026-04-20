"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

const PageTransitionContext = createContext({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <PageTransitionContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      <PageTransitionLoader isLoading={isLoading} />
    </PageTransitionContext.Provider>
  );
}

function PageTransitionLoader({ isLoading }: { isLoading: boolean }) {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <>
      <style>{`
        @keyframes fingerprint-loader {
          33% {
            inset: -11.2px;
            transform: rotate(0deg);
          }

          66% {
            inset: -11.2px;
            transform: rotate(90deg);
          }

          100% {
            inset: 0;
            transform: rotate(90deg);
          }
        }

        .fingerprint-loader-shape {
          width: 44.8px;
          height: 44.8px;
          color: #2aeb84;
          position: relative;
          background: radial-gradient(11.2px, currentColor 94%, transparent);
        }

        .fingerprint-loader-shape::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(10.08px at bottom right, transparent 94%, currentColor) top left,
            radial-gradient(10.08px at bottom left, transparent 94%, currentColor) top right,
            radial-gradient(10.08px at top right, transparent 94%, currentColor) bottom left,
            radial-gradient(10.08px at top left, transparent 94%, currentColor) bottom right;
          background-size: 22.4px 22.4px;
          background-repeat: no-repeat;
          animation: fingerprint-loader 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
        }
      `}</style>

      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-[2500ms]"
        style={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? "auto" : "none" }}
      >
        <div className="fingerprint-loader-shape" />
      </div>
    </>
  );
}