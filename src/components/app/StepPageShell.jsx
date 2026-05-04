import HeaderSection from "../UI/HeaderSection";

export default function StepPageShell({
  title,
  children,
  contentClassName = "",
}) {
  return (
    <div className="theme-shell min-h-dvh transition-colors duration-300 lg:px-4 lg:py-4">
      <div className="theme-surface theme-border mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col transition-colors duration-300 lg:min-h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-[36px] lg:border lg:shadow-[0_24px_64px_rgba(15,15,15,0.08)]">
        <HeaderSection title={title} />

        <section
          className={`theme-surface relative -mt-10 flex flex-1 flex-col rounded-t-[32px] px-5 pb-10 pt-6 transition-colors duration-300 sm:px-6 md:px-8 md:pt-7 lg:px-10 lg:pb-12 lg:pt-8 lg:rounded-t-[40px] ${contentClassName}`}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
