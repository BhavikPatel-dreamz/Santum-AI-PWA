"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";
import toast from "react-hot-toast";
import { appFetch } from "../../lib/api/internal";

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
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(
    interests.filter((interest) => interest.checked).map((interest) => interest.id),
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const selectedInterests = selected
        .map((id) => interests.find((interest) => interest.id === id)?.label)
        .filter(Boolean);

      const res = await appFetch("/api/user/profile/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests: selectedInterests,
        }),
      });

      toast.success(res.message || "Interests saved");
      router.push("/reasons");
    } catch (error) {
      console.error("Interests Error:", error);

      if (error?.status === 401) {
        router.replace("/sign-in");
        return;
      }

      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
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
    <div className="min-h-dvh bg-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
        <HeaderSection title={"Choose Interests"} />

        <section className="relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white pb-10 pt-8 px-5">
          <p
            suppressHydrationWarning
            className="text-[18px] leading-6 text-[#555] font-satoshi mb-6 text-center"
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
                  className="text-center font-satoshi text-[14px] font-medium leading-[18px] rounded-[8px] border-2 px-[16px] py-[11px] transition-all active:scale-95"
                  style={{
                    background: isSelected ? "#111" : "#fff",
                    borderColor: isSelected ? "#111" : "#F5F5F5",
                    color: isSelected ? "#fff" : "#0F0F0F",
                    boxShadow: isSelected ? "0 2px 8px #0002" : "none",
                  }}
                >
                  {interest.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          <div className="flex justify-center gap-3 pt-6">
            <button
              onClick={() => router.push("/reasons")}
              className="w-[163px] h-[48px] flex items-center justify-center rounded-[8px] bg-[#F5F5F5] text-[#0F0F0F] text-[18px] font-medium font-poppins transition-all active:scale-[0.98]"
            >
              Skip
            </button>

            <button
              disabled={selected.length < 3 || loading}
              onClick={handleSubmit}
              className="w-[163px] h-[48px] flex items-center justify-center rounded-[8px] text-white text-[18px] font-medium font-poppins transition-all"
              style={{
                background: "linear-gradient(135deg, #23cf67 0%, #1ab856 100%)",
                boxShadow: "0 4px 20px #23cf6740",
                opacity: selected.length < 3 || loading ? 0.7 : 1,
              }}
            >
              {loading ? (
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
