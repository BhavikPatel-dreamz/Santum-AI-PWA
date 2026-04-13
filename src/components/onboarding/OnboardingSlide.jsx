import Image from "next/image";

export default function OnboardingSlide({ image, title, desc, btnLabel, currentDot, onNext }) {
    return (
        <div className="flex flex-col h-screen bg-white max-w-[570px] mx-auto overflow-hidden">

            {/* Image area — fixed 55% of screen height */}
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

            {/* Title + description — sits right below image, no gap */}
            <div className="text-center">
                <h2 className="text-[30px] font-poppins font-bold leading-[40px] text-center pb-[15px] text-[#0f0f0f]">
                    {title}
                </h2>
                <p className="text-[18px] font-satoshi font-medium leading-[24px] text-center text-[#555]">
                    {desc}
                </p>
            </div>

            {/* Spacer pushes footer to bottom */}
            <div className="flex-1" />

            {/* Footer */}
            <div className="flex flex-col items-center gap-5 px-7 pb-10">
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === currentDot ? "w-7 bg-[#0f0f0f]" : "w-2 bg-[#cccccc]"
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
