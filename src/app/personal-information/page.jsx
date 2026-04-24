"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";
import { CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "../../lib/api/client";

/* ── Reusable floating-label input ── */
function FloatingInput({ id, label, value, onChange, type = "text" }) {
  return (
    <div className="relative mb-[15px]">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required
        className="peer block w-full h-[64px] text-[#555] bg-[#F5F5F5] rounded-[12px] outline-none pl-4 pt-5 text-[18px]"
      />
      <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] transition-all peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#00D061] peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:text-xs">
        {label}
      </label>
    </div>
  );
}

function validateForm(form) {
  if (!form.firstName.trim()) return "First name is required";
  if (!form.lastName.trim()) return "Last name is required";
  if (!form.dob) return "Date of birth is required";

  //   const age =
  //     new Date().getFullYear() - new Date(form.dob).getFullYear();

  //   if (age < 13) return "You must be at least 13 years old";

  return null;
}

export default function PersonalInformationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      const errorMsg = validateForm(form);
      if (errorMsg) return toast.error(errorMsg);

      const payload = new FormData();
      payload.append("first_name", form.firstName);
      payload.append("last_name", form.lastName);
      payload.append("dob", form.dob);

      const token = localStorage.getItem("token");
      if (!token) toast.error("User not authenticated");
      const data = await apiFetch("/v1/user/profile/basic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      toast.success("Profile saved");

      router.push("/language");
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-dvh bg-white">
        <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
          <HeaderSection title={"Personal Information"} />

          {/* ── White card section ── */}
          <section className="relative -mt-6 flex flex-1 flex-col items-center rounded-t-[32px] bg-white px-5 pb-28 pt-6 overflow-y-auto">
            {/* Avatar upload — .camera_main */}
            {/* <div className="relative flex items-center justify-center mb-6"> */}
            {/* .circle-img-girl */}
            {/* <div className="w-[120px] h-[120px] rounded-full overflow-hidden mt-[10px]">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                                            stroke="#AAAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                )}
                            </div> */}

            {/* Camera button — .ri-camera-line / upload-button */}
            {/* <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-0 bottom-[22px] cursor-pointer"
                aria-label="Upload profile picture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <circle cx="20" cy="20" r="20" fill="#0F0F0F" />
                  <path
                    d="M13 15H14C14.5304 15 15.0391 14.7893 15.4142 14.4142C15.7893 14.0391 16 13.5304 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12H23C23.2652 12 23.5196 12.1054 23.7071 12.2929C23.8946 12.4804 24 12.7348 24 13C24 13.5304 24.2107 14.0391 24.5858 14.4142C24.9609 14.7893 25.4696 15 26 15H27C27.5304 15 28.0391 15.2107 28.4142 15.5858C28.7893 15.9609 29 16.4696 29 17V26C29 26.5304 28.7893 27.0391 28.4142 27.4142C28.0391 27.7893 27.5304 28 27 28H13C12.4696 28 11.9609 27.7893 11.5858 27.4142C11.2107 27.0391 11 26.5304 11 26V17C11 16.4696 11.2107 15.9609 11.5858 15.5858C11.9609 15.2107 12.4696 15 13 15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 24C21.6569 24 23 22.6569 23 21C23 19.3431 21.6569 18 20 18C18.3431 18 17 19.3431 17 21C17 22.6569 18.3431 24 20 24Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button> */}

            {/* Hidden file input */}
            {/* <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div> */}

            {/* Form fields — .new_password_input */}
            <div className="w-full">
              <FloatingInput
                id="first-name"
                label="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />

              <FloatingInput
                id="last-name"
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />

              {/* Date of Birth — masked text input */}
              <div className="relative mb-[15px]">
                <input
                  type="date"
                  autoComplete="off"
                  required
                  value={form.dob}
                  onChange={(e) => {
                    setForm({ ...form, dob: e.target.value });
                  }}
                  placeholder=" "
                  maxLength={10}
                  inputMode="numeric"
                  className="
                                        peer block w-full h-[64px]
                                        bg-[#F5F5F5] border-none rounded-[12px]
                                        outline-none pl-4 pr-[50px] pt-5 pb-0
                                        text-[#0F0F0F] font-satoshi text-[18px] font-medium leading-6
                                        transition-all duration-300
                                    "
                />
                <label
                  htmlFor="dob"
                  className="
                                        absolute z-10 left-[16px]
                                        text-[#555] font-satoshi font-medium leading-5
                                        transition-all duration-300 cursor-text pointer-events-none
                                        top-1/2 -translate-y-1/2 text-[16px]
                                        peer-focus:top-[14px] peer-focus:-translate-y-0 peer-focus:text-[12px] peer-focus:text-[#00D061]
                                        peer-[&:not(:placeholder-shown)]:top-[14px] peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-[12px] peer-[&:not(:placeholder-shown)]:text-[#00D061]
                                    "
                >
                  Date of Birth (MM/DD/YYYY)
                </label>
                {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <CalendarIcon/>
                                </div> */}
              </div>
            </div>
          </section>

          {/* ── Continue button — fixed bottom ── */}
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-[600px] px-5 z-10">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full max-w-[343px] mx-auto block py-[18px] rounded-[12px] bg-[#00D061] text-white text-[18px] font-medium leading-6 text-center transition-all duration-200 hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
