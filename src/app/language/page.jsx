"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";
import toast from "react-hot-toast";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import { useUpdatePreferredLanguageMutation } from "@/lib/store";

const LANGUAGES = [
  "English",
  "Chinese",
  "Hindi",
  "Portuguese",
  "Spanish",
  "Arabic",
  "Bulgarian",
  "French",
  "Russian",
];

const Page = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("English");
  const [updatePreferredLanguage, { isLoading }] =
    useUpdatePreferredLanguageMutation();

  const handleSubmit = async () => {
    try {
      const res = await updatePreferredLanguage({
        preferredLanguage: selected,
      }).unwrap();

      toast.success(res.message || "Language updated");
      router.push("/intrest");
    } catch (error) {
      console.error("Language Error:", error);

      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      toast.error(getClientErrorMessage(error));
    }
  };

  return (
    <div className="theme-shell min-h-dvh transition-colors duration-300">
      <div className="theme-surface mx-auto flex min-h-dvh w-full max-w-[600px] flex-col transition-colors duration-300">
        <HeaderSection title={"Select Language"} />

        <section className="theme-surface relative -mt-10 flex flex-1 flex-col rounded-t-[32px] px-5 pb-10 pt-8 transition-colors duration-300">
          <p className="theme-text-secondary mb-6 font-satoshi text-[18px] leading-6">
            Please select your preferred language to facilitate communication.
          </p>

          <div className="flex flex-wrap gap-[10px]">
            {LANGUAGES.map((lang) => {
              const isSelected = selected === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelected(lang)}
                  className={`rounded-[8px] border-2 px-[16px] py-[11px] text-center font-satoshi text-[14px] font-medium leading-[18px] transition-all active:scale-95 ${
                    isSelected ? "theme-choice-chip-selected" : "theme-choice-chip"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          <div className="flex justify-center gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.push("/intrest")}
              className="theme-secondary-button flex h-[48px] w-[163px] items-center justify-center rounded-[8px] text-[18px] font-medium font-poppins transition-all active:scale-[0.98]"
            >
              Skip
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-[163px] h-[48px] rounded-[8px] flex items-center justify-center text-white text-[18px] font-medium font-poppins transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #23cf67 0%, #1ab856 100%)",
                boxShadow: "0 4px 20px #23cf6740",
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Next"
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
