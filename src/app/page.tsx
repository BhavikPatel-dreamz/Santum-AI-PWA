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

type Direction = "left" | "right";

export default function RootPage() {
  const [theme, setTheme] = useState<string | null>(null);
  const slides = [
    {
      image:
        theme == "dark" ? "/icons/artboard-3.png" : "/icons/artboard-2.jpg",
      title: "Welcome to Amigo, Great Friend to Chat",
      desc: "Proin molestie pulvinar vitae enim erat morbi eu. Malesuada eros nisi augue.",
      btnLabel: "Next",
    },
    {
      image:
        theme == "dark" ? "/icons/artboard-3.png" : "/icons/artboard-2.jpg",
      title: "The Intelligent Way to Get Started",
      desc: "Quisque blandit risus duis odio. In pretium nibh velit a aenean vitae porta euismod.",
      btnLabel: "Next",
    },
    {
      image:
        theme == "dark" ? "/icons/artboard-3.png" : "/icons/artboard-2.jpg",
      title: "Accelerate Your Learning with Amigo",
      desc: "Pulvinar in et eu volutpat mauris viverra ut orci. Lacus placerat volutpat pharetra a.",
      btnLabel: "Get Started",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animClass, setAnimClass] = useState("");
  const isAnimating = useRef(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSlideStopped = useRef(false);

  useEffect(() => {
    if (localStorage.getItem("onboarding_done") === "true")
      router.replace("/lets-you-in");
  }, []);

  useEffect(() => {
    setTheme(localStorage.getItem("amigo-theme"));
  }, []);

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
      const next = prev < slides.length - 1 ? prev + 1 : prev;
      if (next === slides.length - 1 && timerRef.current) {
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
    if (currentSlide < slides.length - 1) {
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
        totalDots={slides.length}
        animClass={animClass}
        onNext={handleNext}
        onDotClick={handleDotClick}
      />
    </>
  );
}
