import Image from "next/image";

export default function OnboardingSlide({
  image,
  title,
  desc,
  btnLabel,
  currentDot,
  totalDots = 3,
  onNext,
  onDotClick,
  animClass = "",
}) {
  return (
    <div
      className={`theme-surface theme-border mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col overflow-hidden transition-colors duration-300 lg:my-4 lg:min-h-[calc(100dvh-2rem)] lg:rounded-[36px] lg:border lg:shadow-[0_24px_64px_rgba(15,15,15,0.08)] ${animClass}`}
    >
      {/* Image area */}
      <div className="flex min-h-[44vh] items-center justify-center px-6 pt-10 sm:min-h-[48vh] sm:px-10 lg:min-h-[52vh] lg:px-16 lg:pt-12">
        <div className="relative h-[260px] w-[260px] sm:h-[340px] sm:w-[340px] lg:h-[420px] lg:w-[420px]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 420px"
            className="object-contain rounded-2xl"
            priority
          />
        </div>
      </div>

      {/* Title + description */}
      <div className="mx-auto w-full max-w-[780px] px-6 text-center sm:px-10 lg:px-16">
        <h2 className="theme-text-primary pb-[15px] text-center text-[28px] font-poppins font-bold leading-[36px] sm:text-[36px] sm:leading-[46px] lg:text-[48px] lg:leading-[58px]">
          {title}
        </h2>
        <p className="theme-text-secondary text-center text-[16px] font-satoshi font-medium leading-[24px] sm:text-[18px] lg:text-[22px] lg:leading-[32px]">
          {desc}
        </p>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="flex flex-col items-center gap-5 px-6 pb-10 sm:px-10 sm:pb-12 lg:px-16 lg:pb-14">
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick?.(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-none p-0 ${
                i === currentDot ? "theme-text-primary w-7 bg-current" : "w-2 bg-[#cccccc]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-full max-w-[420px] rounded-[14px] bg-[#00D061] py-[18px] text-[17px] font-semibold text-white transition-opacity active:opacity-90"
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}
