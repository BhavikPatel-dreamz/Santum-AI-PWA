import Image from "next/image";

export default function FeatureShowcaseCard({
  badge,
  title,
  description,
  imageSrc = "/icons/robot-slider-img3.png",
  imageAlt = "",
  className = "",
  compact = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#081f14_0%,#0f4f31_38%,#00D061_100%)] px-5 pb-5 pt-5 text-white shadow-[0_20px_45px_rgba(0,208,97,0.18)] sm:px-6 sm:pb-6 lg:px-7 lg:pb-7 ${className}`}
    >
      <Image
        src="/icons/dots_pattern.png"
        alt=""
        width={100}
        height={100}
        className="pointer-events-none absolute right-0 top-0 w-full opacity-35"
      />
      <Image
        src="/icons/dots_pattern_bottom.png"
        alt=""
        width={100}
        height={100}
        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-35"
      />

      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
        {badge}
      </span>

      <div className="relative mt-5 flex flex-col gap-5 sm:flex-row sm:items-end">
        <div
          className={
            compact
              ? "sm:max-w-[420px] lg:max-w-[520px]"
              : "sm:max-w-[320px] lg:max-w-[420px]"
          }
        >
          <h2 className="text-[24px] font-semibold leading-[30px] sm:text-[28px] sm:leading-[34px]">
            {title}
          </h2>
          <p className="mt-3 font-satoshi text-[15px] leading-6 text-white/80 sm:text-[16px]">
            {description}
          </p>
        </div>

        <div
          className={`relative mx-auto shrink-0 sm:ml-auto sm:mr-0 ${
            compact
              ? "h-[140px] w-[120px] sm:h-[160px] sm:w-[140px] lg:h-[190px] lg:w-[170px]"
              : "h-[156px] w-[140px] sm:h-[176px] sm:w-[156px] lg:h-[210px] lg:w-[190px]"
          }`}
        >
          <div className="absolute inset-x-0 bottom-2 h-10 rounded-full bg-black/25 blur-2xl" />
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 140px, (max-width: 1024px) 156px, 190px"
            className="relative object-contain"
          />
        </div>
      </div>
    </div>
  );
}
