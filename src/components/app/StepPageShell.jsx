import HeaderSection from "../UI/HeaderSection";

export default function StepPageShell({
  title,
  children,
  contentClassName = "",
}) {
  return (
    <div className="theme-shell min-h-dvh transition-colors duration-300">
      <div className="theme-surface mx-auto flex min-h-dvh w-full max-w-[600px] flex-col transition-colors duration-300">
        <HeaderSection title={title} />

        <section
          className={`theme-surface relative -mt-10 flex flex-1 flex-col rounded-t-[32px] px-5 pb-10 pt-6 transition-colors duration-300 ${contentClassName}`}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
