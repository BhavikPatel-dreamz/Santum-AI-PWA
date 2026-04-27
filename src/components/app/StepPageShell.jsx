import HeaderSection from "../UI/HeaderSection";

export default function StepPageShell({
  title,
  children,
  contentClassName = "",
}) {
  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
        <HeaderSection title={title} />

        <section
          className={`relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white px-5 pb-10 pt-6 ${contentClassName}`}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
