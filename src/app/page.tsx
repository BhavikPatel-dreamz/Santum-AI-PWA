"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { registerPushServiceWorker } from "@/lib/push/client";

const OnboardingSlide = dynamic(
  () => import("../components/onboarding/OnboardingSlide"),
  { ssr: false },
);

const AUTO_SLIDE_INTERVAL = 4000;
const ANIM_DURATION = 320;
const ONBOARDING_SLIDES = [
  {
    darkImage: "/Logo Source files 21-4/Logo/SVG/Artboard3.svg",
    lightImage: "/Logo Source files 21-4/Logo/SVG/Artboard2.svg",
    title: "Find your calm, your quiet space to talk",
    desc: "A private companion for self-reflection and psychological support, try it at your own pace",
    btnLabel: "Try it for free",
  },
  {
    darkImage: "/Logo Source files 21-4/Logo/SVG/Artboard3.svg",
    lightImage: "/Logo Source files 21-4/Logo/SVG/Artboard2.svg",
    title: "Advanced assistance, when you need it",
    desc: "Whether it's stress, anxiety, or just a heavy day... this is your space to talk",
    btnLabel: "Try it for free",
  },
  {
    darkImage: "/Logo Source files 21-4/Logo/SVG/Artboard3.svg",
    lightImage: "/Logo Source files 21-4/Logo/SVG/Artboard2.svg",
    title: "Get started and meet Sai (SantumAI)",
    desc: "Create an account to start structured, confidential conversations.",
    btnLabel: "Try it for free",
  },
];

type Direction = "left" | "right";

export default function RootPage() {
  const [theme] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("theme"),
  );
  const slides = ONBOARDING_SLIDES.map(
    ({ darkImage, lightImage, ...slideContent }) => ({
      ...slideContent,
      image: theme === "dark" ? darkImage : lightImage,
    }),
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animClass, setAnimClass] = useState("");
  const isAnimating = useRef(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSlideStopped = useRef(false);
  const firstLoadRef = useRef(true);

  useEffect(() => {
    registerPushServiceWorker().catch((error) => {
      console.log("SW error", error);
    });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("onboarding_done") === "true")
      router.replace("/lets-you-in");
  }, [router]);

  const stopAutoSlide = useCallback(() => {
    autoSlideStopped.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (next: number, direction: Direction) => {
      if (isAnimating.current || next === currentSlide) return;
      isAnimating.current = true;

      const exitClass =
        direction === "left" ? "slide-exit-left" : "slide-exit-right";
      setAnimClass(exitClass);

      setTimeout(() => {
        setCurrentSlide(next);
        const enterClass =
          direction === "left" ? "slide-enter-left" : "slide-enter-right";
        setAnimClass(enterClass);

        setTimeout(() => {
          setAnimClass("");
          isAnimating.current = false;
        }, ANIM_DURATION);
      }, ANIM_DURATION);
    },
    [currentSlide],
  );

  const goNext = useCallback(() => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      goToSlide(currentSlide + 1, "left");
    }
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    if (autoSlideStopped.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const delay = firstLoadRef.current
      ? AUTO_SLIDE_INTERVAL + 2000
      : AUTO_SLIDE_INTERVAL;

    firstLoadRef.current = false;

    timerRef.current = setTimeout(() => {
      goNext();
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentSlide, goNext]);

  const handleDotClick = useCallback(
    (index: number) => {
      stopAutoSlide();
      const dir: Direction = index > currentSlide ? "left" : "right";
      goToSlide(index, dir);
    },
    [currentSlide, stopAutoSlide, goToSlide],
  );

  const handleNext = useCallback(() => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      stopAutoSlide();
      goToSlide(currentSlide + 1, "left");
    } else {
      localStorage.setItem("onboarding_done", "true");
      router.push("/lets-you-in");
    }
  }, [currentSlide, router, stopAutoSlide, goToSlide]);

  return (
    <>
      <style>{`
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(56px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-56px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes slideOutToLeft {
          from { opacity: 1; transform: translateX(0);     }
          to   { opacity: 0; transform: translateX(-56px); }
        }
        @keyframes slideOutToRight {
          from { opacity: 1; transform: translateX(0);    }
          to   { opacity: 0; transform: translateX(56px); }
        }
        .slide-enter-left  { animation: slideInFromRight ${ANIM_DURATION}ms ease both; }
        .slide-enter-right { animation: slideInFromLeft  ${ANIM_DURATION}ms ease both; }
        .slide-exit-left   { animation: slideOutToLeft   ${ANIM_DURATION}ms ease both; }
        .slide-exit-right  { animation: slideOutToRight  ${ANIM_DURATION}ms ease both; }
      `}</style>

      <OnboardingSlide
        {...slides[currentSlide]}
        currentDot={currentSlide}
        totalDots={ONBOARDING_SLIDES.length}
        animClass={animClass}
        onNext={handleNext}
        onDotClick={handleDotClick}
      />
    </>
  );
}
