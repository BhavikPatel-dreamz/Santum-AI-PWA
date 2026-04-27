"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { Bell, CheckCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Your Plus preview is ready",
    description: "Unlock faster replies and premium workspace features for 14 days.",
    time: "2m ago",
    tag: "Upgrade",
    unread: true,
  },
  {
    id: 2,
    title: "New prompt pack added",
    description: "Fresh templates for ideation, product writing, and study sessions.",
    time: "45m ago",
    tag: "Product",
    unread: true,
  },
  {
    id: 3,
    title: "Security recommendation",
    description: "Add a PIN and biometric unlock to protect access on shared devices.",
    time: "Today",
    tag: "Security",
    unread: false,
  },
  {
    id: 4,
    title: "Weekly wrap is ready",
    description: "See your most-used prompts, active streak, and favorite workflows.",
    time: "Yesterday",
    tag: "Insights",
    unread: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <StepPageShell title="Notifications" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Inbox"
        title="Every important update, all in one calm feed"
        description="This dummy inbox gives product, security, and plan updates a proper home inside the app."
        imageSrc="/icons/robot-slider-img2.png"
        imageAlt="Notification inbox"
        className="mb-6"
      />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-[22px] bg-[#F8FFFB] px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            {notifications.length}
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Total
          </p>
        </div>
        <div className="rounded-[22px] bg-[#F8FFFB] px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            {unreadCount}
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Unread
          </p>
        </div>
        <div className="rounded-[22px] bg-[#F8FFFB] px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            03
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Priority
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            Recent updates
          </h2>
          <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
            Styled with dummy product signals for now.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNotifications((currentItems) =>
              currentItems.map((item) => ({ ...item, unread: false })),
            );
            toast.success("All notifications marked as read.");
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#E8FFF1] px-4 py-2 text-[13px] font-semibold text-[#00A84D]"
        >
          <CheckCheck size={14} />
          Mark all
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setNotifications((currentItems) =>
                currentItems.map((currentItem) =>
                  currentItem.id === item.id
                    ? { ...currentItem, unread: false }
                    : currentItem,
                ),
              )
            }
            className={`w-full rounded-[24px] border px-4 py-4 text-left shadow-[0_12px_30px_rgba(15,15,15,0.04)] transition-all duration-200 ${
              item.unread
                ? "border-[#D6F5E3] bg-[#F8FFFB]"
                : "border-[#EEF6F1] bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  item.unread ? "bg-[#E8FFF1]" : "bg-[#F4F7F5]"
                }`}
              >
                {item.tag === "Security" ? (
                  <Bell size={18} className="text-[#00A84D]" />
                ) : (
                  <Sparkles size={18} className="text-[#00A84D]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[16px] font-semibold leading-6 text-[#0F0F0F]">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-[#0F0F0F] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#7E8A83]">
                    {item.time}
                  </span>
                  {item.unread ? (
                    <span className="rounded-full bg-[#00D061] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                      New
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </StepPageShell>
  );
}
