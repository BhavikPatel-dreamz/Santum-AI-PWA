"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { useRouter } from "next/navigation";

export default function NotificationSetupPage() {
  const router = useRouter();

  return (
    <StepPageShell title="Notifications" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="In-App Inbox"
        title="Updates appear automatically inside your Amigo inbox"
        description="This app no longer asks people to manage notification switches. Billing, token, and account updates are shown in the in-app notifications feed when they matter."
        imageSrc="/icons/robot-slider-img3.png"
        imageAlt="Notification inbox"
        className="mb-6"
      />

      <div className="theme-card rounded-[24px] border px-5 py-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
          How it works
        </p>
        <h2 className="mt-3 text-[22px] font-semibold leading-8 text-[#0F0F0F]">
          Important updates are handled automatically.
        </h2>
        <p className="mt-3 font-satoshi text-[15px] leading-6 text-[#555]">
          If a payment fails, a subscription renews, tokens reset, or your
          account activity changes, the update is saved to the in-app inbox for
          you to review later.
        </p>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/notifications")}
          className="theme-secondary-button rounded-[14px] px-5 py-4 text-[16px] font-semibold"
        >
          Open Inbox
        </button>
        <button
          type="button"
          onClick={() => router.push("/create-pin")}
          className="rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
        >
          Continue
        </button>
      </div>
    </StepPageShell>
  );
}
