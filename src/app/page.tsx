"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Loading = dynamic(() => import("../components/onboarding/Loading"), { ssr: false });
const OnboardingSlide = dynamic(() => import("../components/onboarding/OnboardingSlide"), { ssr: false });

const slides = [
  {
    image: "/icons/Image.png",
    title: "Welcome to Amigo, Great Friend to Chat",
    desc: "Proin molestie pulvinar vitae enim erat morbi eu. Malesuada eros nisi augue.",
    btnLabel: "Next",
  },
  {
    image: "/icons/robot-slider-img2.png",
    title: "The Intelligent Way to Get Started",
    desc: "Quisque blandit risus duis odio. In pretium nibh velit a aenean vitae porta euismod.",
    btnLabel: "Next",
  },
  {
    image: "/icons/robot-slider-img3.png",
    title: "Accelerate Your Learning with Amigo",
    desc: "Pulvinar in et eu volutpat mauris viverra ut orci. Lacus placerat volutpat pharetra a.",
    btnLabel: "Get Started",
  },
];

const AUTO_SLIDE_INTERVAL = 4000;

export default function RootPage() {
  // ✅ Removed useIsClient — ssr:false on the dynamic imports already handles this
  const [showLoader, setShowLoader] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, AUTO_SLIDE_INTERVAL);
  }, [goNext]);

  useEffect(() => {
    if (showLoader) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [showLoader, resetTimer]); // ✅ Removed isClient dependency

  useEffect(() => {
    if (currentSlide === slides.length - 1 && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [currentSlide]);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      resetTimer();
      setCurrentSlide((prev) => prev + 1);
    } else {
      localStorage.setItem("onboarding_done", "true");
      router.push("/lets-you-in");
    }
  }, [currentSlide, router, resetTimer]);

  const handleLoaderDone = useCallback(() => setShowLoader(false), []);

  // ✅ No more if (!isClient) return null — server and client render the same thing.
  //    The dynamic components render null on SSR themselves, so no mismatch.
  if (showLoader) return <Loading onDone={handleLoaderDone} />;

  return (
    <OnboardingSlide
      {...slides[currentSlide]}
      currentDot={currentSlide}
      onNext={handleNext}
    />
  );
}