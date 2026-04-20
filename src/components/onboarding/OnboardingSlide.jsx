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
    <div className={`flex flex-col h-screen bg-white max-w-[570px] mx-auto overflow-hidden ${animClass}`}>

      {/* Image area */}
      <div className="h-[55vh] flex items-center justify-center px-8 pt-10">
        <div className="relative w-[300px] h-[300px]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="300px"
            className="object-contain rounded-2xl"
            priority
          />
        </div>
      </div>

      {/* Title + description */}
      <div className="text-center px-6">
        <h2 className="text-[30px] font-poppins font-bold leading-[40px] text-center pb-[15px] text-[#0f0f0f]">
          {title}
        </h2>
        <p className="text-[18px] font-satoshi font-medium leading-[24px] text-center text-[#555]">
          {desc}
        </p>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="flex flex-col items-center gap-5 px-7 pb-10">
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick?.(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-none p-0 ${
                i === currentDot ? "w-7 bg-[#0f0f0f]" : "w-2 bg-[#cccccc]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-full bg-[#00D061] text-white rounded-[14px] py-[18px] text-[17px] font-semibold active:opacity-90 transition-opacity"
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}