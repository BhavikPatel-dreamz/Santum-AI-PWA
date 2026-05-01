"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const OnboardingSlide = dynamic(
  () => import("../components/onboarding/OnboardingSlide"),
  { ssr: false },
);

const AUTO_SLIDE_INTERVAL = 4000;
const ANIM_DURATION = 320;
const ONBOARDING_SLIDES = [
  {
    darkImage: "/icons/artboard-3.png",
    lightImage: "/icons/artboard-2.jpg",
    title: "Welcome to Amigo, your calm space to talk",
    desc: "Text-based support for emotional wellbeing, reflection, and everyday moments that feel hard to carry alone.",
    btnLabel: "Next",
  },
  {
    darkImage: "/icons/artboard-3.png",
    lightImage: "/icons/artboard-2.jpg",
    title: "Support that adapts to how today feels",
    desc: "Mood check-ins help Amigo respond with steadier tone, gentler pacing, and more relevant encouragement.",
    btnLabel: "Next",
  },
  {
    darkImage: "/icons/artboard-3.png",
    lightImage: "/icons/artboard-2.jpg",
    title: "Build healthier reflection habits with Amigo",
    desc: "Save conversations, return to past sessions, and create a private routine for emotional check-ins and support.",
    btnLabel: "Get Started",
  },
];

type Direction = "left" | "right";

export default function RootPage() {
  const [theme] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("amigo-theme"),
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSlideStopped = useRef(false);

  useEffect(() => {
    if (localStorage.getItem("onboarding_done") === "true")
      router.replace("/lets-you-in");
  }, [router]);

  const stopAutoSlide = useCallback(() => {
    autoSlideStopped.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
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
    setCurrentSlide((prev: number) => {
      const next = prev < ONBOARDING_SLIDES.length - 1 ? prev + 1 : prev;
      if (next === ONBOARDING_SLIDES.length - 1 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setAnimClass("slide-enter-left");
      setTimeout(() => setAnimClass(""), ANIM_DURATION);
      return next;
    });
  }, []);

  const resetTimer = useCallback(() => {
    if (autoSlideStopped.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, AUTO_SLIDE_INTERVAL);
  }, [goNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

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
