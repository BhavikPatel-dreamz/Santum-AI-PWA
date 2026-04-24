"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";
import { apiFetch } from "../../lib/api/client";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("English");
  const handleSubmit = async () => {
    try {
      const resdata = await fetch("/api/auth/me");
      const token = resdata.data.token;

      if (!token) {
        toast.error("User not authenticated");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("preferred_language", selected);

      const res = await apiFetch("/v1/user/profile/language", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.success) {
        // ✅ success
        router.push("/intrest");
      } else {
        toast.error(res.data.message || "Failed to update language");
      }
    } catch (error) {
      console.error("Language Error:", error);
      toast.error(error.data.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
        {/* Header */}

        <HeaderSection title={"Select Language"} />

        {/* Content card */}
        <section className="relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white pb-10 pt-8 px-5">
          <p className="text-[18px] leading-6 text-[#555] font-satoshi mb-6">
            Please select your preferred language to facilitate communication.
          </p>

          {/* Language chips */}
          <div className="flex flex-wrap gap-[10px]">
            {LANGUAGES.map((lang) => {
              const isSelected = selected === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelected(lang)}
                  className="text-center font-satoshi text-[14px] font-medium leading-[18px] rounded-[8px] border-2 px-[16px] py-[11px] transition-all active:scale-95"
                  style={{
                    background: isSelected ? "#111" : "#fff",
                    borderColor: isSelected ? "#111" : "#F5F5F5",
                    color: isSelected ? "#fff" : "#0F0F0F",
                    boxShadow: isSelected ? "0 2px 8px #0002" : "none",
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom buttons */}
          <div className="flex justify-center gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.push("/intrest")}
              className="w-[163px] h-[48px] flex items-center justify-center rounded-[8px] bg-[#F5F5F5] text-[#0F0F0F] text-[18px] font-medium font-poppins transition-all active:scale-[0.98]"
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
              {loading ? (
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
