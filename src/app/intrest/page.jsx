"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";
import toast from "react-hot-toast";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import { useUpdateInterestsMutation } from "@/lib/store";

const interests = [
  { id: 1, label: "History", checked: false },
  { id: 2, label: "Art", checked: false },
  { id: 3, label: "Booking", checked: false },
  { id: 4, label: "Code", checked: true },
  { id: 5, label: "Content", checked: false },
  { id: 6, label: "Entertainment", checked: false },
  { id: 7, label: "Translator", checked: false },
  { id: 8, label: "Health", checked: false },
  { id: 9, label: "Music", checked: false },
  { id: 10, label: "Books", checked: false },
  { id: 11, label: "Toys", checked: false },
  { id: 12, label: "Handbags", checked: false },
  { id: 13, label: "Mobile Phones", checked: false },
  { id: 14, label: "Games", checked: false },
  { id: 15, label: "Kitchen Ware", checked: false },
  { id: 16, label: "Baby Care", checked: false },
  { id: 17, label: "Household Appliances", checked: false },
  { id: 20, label: "Fitness Equipment", checked: false },
  { id: 21, label: "Sports Goods", checked: false },
  { id: 22, label: "Home Decor", checked: false },
  { id: 23, label: "Computer Accessories", checked: false },
];

const Page = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(
    interests.filter((interest) => interest.checked).map((interest) => interest.id),
  );
  const [updateInterests, { isLoading }] = useUpdateInterestsMutation();

  const handleSubmit = async () => {
    try {
      const selectedInterests = selected
        .map((id) => interests.find((interest) => interest.id === id)?.label)
        .filter(Boolean);

      const res = await updateInterests({
        interests: selectedInterests,
      }).unwrap();

      toast.success(res.message || "Interests saved");
      router.push("/reasons");
    } catch (error) {
      console.error("Interests Error:", error);

      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      toast.error(getClientErrorMessage(error));
    }
  };

  const handleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  return (
    <div className="theme-shell min-h-dvh transition-colors duration-300 lg:px-4 lg:py-4">
      <div className="theme-surface theme-border mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col transition-colors duration-300 lg:min-h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-[36px] lg:border lg:shadow-[0_24px_64px_rgba(15,15,15,0.08)]">
        <HeaderSection title={"Choose Interests"} />

        <section className="theme-surface relative -mt-10 flex flex-1 flex-col rounded-t-[32px] px-5 pb-10 pt-8 transition-colors duration-300 sm:px-6 md:px-8 lg:px-10 lg:pb-12 lg:rounded-t-[40px]">
          <p
            suppressHydrationWarning
            className="theme-text-secondary mb-6 text-center font-satoshi text-[18px] leading-6"
          >
            Choose 3 or more areas you are interested
          </p>

          <div className="flex flex-wrap gap-[10px]">
            {interests.map((interest) => {
              const isSelected = selected.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  onClick={() => handleSelect(interest.id)}
                  className={`rounded-[8px] border-2 px-[16px] py-[11px] text-center font-satoshi text-[14px] font-medium leading-[18px] transition-all active:scale-95 ${
                    isSelected ? "theme-choice-chip-selected" : "theme-choice-chip"
                  }`}
                >
                  {interest.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/reasons")}
              className="theme-secondary-button flex h-[48px] w-full items-center justify-center rounded-[8px] text-[18px] font-medium font-poppins transition-all active:scale-[0.98] sm:w-[180px]"
            >
              Skip
            </button>

            <button
              disabled={selected.length < 3 || isLoading}
              onClick={handleSubmit}
              className="flex h-[48px] w-full items-center justify-center rounded-[8px] text-[18px] font-medium font-poppins text-white transition-all sm:w-[180px]"
              style={{
                background: "linear-gradient(135deg, #23cf67 0%, #1ab856 100%)",
                boxShadow: "0 4px 20px #23cf6740",
                opacity: selected.length < 3 || isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
