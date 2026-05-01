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
      className={`relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#081f14_0%,#0f4f31_38%,#00D061_100%)] px-5 pb-5 pt-5 text-white shadow-[0_20px_45px_rgba(0,208,97,0.18)] ${className}`}
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

      <div className="relative mt-5 flex items-end gap-4">
        <div className={compact ? "max-w-[240px]" : "max-w-[190px]"}>
          <h2 className="text-[24px] font-semibold leading-[30px]">
            {title}
          </h2>
          <p className="mt-3 font-satoshi text-[15px] leading-6 text-white/80">
            {description}
          </p>
        </div>

        <div
          className={`relative ml-auto shrink-0 ${compact ? "h-[140px] w-[120px]" : "h-[156px] w-[140px]"}`}
        >
          <div className="absolute inset-x-0 bottom-2 h-10 rounded-full bg-black/25 blur-2xl" />
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="140px"
            className="relative object-contain"
          />
        </div>
      </div>
    </div>
  );
}
