"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronRightIcon, ReceiptText, Settings, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MoodCheckInCard from "@/components/app/MoodCheckInCard";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  useGetMoodCheckInQuery,
  useGetNotificationsQuery,
  useGetProfileQuery,
  useLogoutMutation,
  useResendOtpMutation,
  useUpsertMoodCheckInMutation,
} from "@/lib/store";
import { getTodayMoodDateKey } from "@/lib/utills/mood";
import {
  buildProfileInitials,
  getProfileEmail,
  getProfileFirstName,
  getProfileFullName,
  getProfileLastName,
  getProfilePhone,
  PAUSED_ACCOUNT_MESSAGE,
  isProfilePaused,
} from "@/lib/utills/profile";
import { useTheme } from "@/components/providers/ThemeProvider";
import { registerPushServiceWorker } from "@/lib/push/client";
import { SETTINGS_PAGE_ROUTES } from "@/lib/content/settings-routes";

const CollapseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="16"
    viewBox="0 0 24 16"
    fill="none"
  >
    <path
      d="M22 8L12 13L2 8"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 2L12 7L2 2"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Settings menu items data ─────────────────────────────────────────────────

const MENU_ITEMS = [
  {
    label: "Chat History",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 20V24L26 26"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.05 23C15.274 20.8 16.3 18.76 17.932 17.268C19.565 15.776 21.69 14.938 23.9 14.913C26.112 14.887 28.255 15.677 29.921 17.131C31.587 18.585 32.66 20.602 32.934 22.796C33.208 24.99 32.665 27.209 31.408 29.028C30.151 30.847 28.268 32.14 26.119 32.66C23.97 33.18 21.704 32.89 19.755 31.846C17.805 30.802 16.308 29.077 15.55 27M15.05 32V27H20.05"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Current Plan",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M23 18C23 18.796 23.527 19.559 24.464 20.121C25.402 20.684 26.674 21 28 21C29.326 21 30.598 20.684 31.536 20.121C32.473 19.559 33 18.796 33 18C33 17.204 32.473 16.441 31.536 15.879C30.598 15.316 29.326 15 28 15C26.674 15 25.402 15.316 24.464 15.879C23.527 16.441 23 17.204 23 18Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 18V22C23 23.657 25.239 25 28 25C30.761 25 33 23.657 33 22V18M23 22V26C23 27.657 25.239 29 28 29C30.761 29 33 27.657 33 26V22M23 26V30C23 31.657 25.239 33 28 33C30.761 33 33 31.657 33 30V26"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 21H16.5C16.102 21 15.721 21.158 15.439 21.439C15.158 21.721 15 22.102 15 22.5C15 22.898 15.158 23.279 15.439 23.561C15.721 23.842 16.102 24 16.5 24H17.5C17.898 24 18.279 24.158 18.561 24.439C18.842 24.721 19 25.102 19 25.5C19 25.898 18.842 26.279 18.561 26.561C18.279 26.842 17.898 27 17.5 27H15M17 27V28M17 20V21"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Billing",
    hint: null,
    danger: false,
    icon: (
      <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#00D061]/10 text-[#00D061]">
        <ReceiptText size={24} strokeWidth={2} />
      </div>
    ),
  },
  {
    label: "Profile Info",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M15 19C15 18.204 15.316 17.441 15.879 16.879C16.441 16.316 17.204 16 18 16H30C30.796 16 31.559 16.316 32.121 16.879C32.684 17.441 33 18.204 33 19V29C33 29.796 32.684 30.559 32.121 31.121C31.559 31.684 30.796 32 30 32H18C17.204 32 16.441 31.684 15.879 31.121C15.316 30.559 15 29.796 15 29V19Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 22C19 22.53 19.211 23.039 19.586 23.414C19.961 23.789 20.47 24 21 24C21.53 24 22.039 23.789 22.414 23.414C22.789 23.039 23 22.53 23 22C23 21.47 22.789 20.961 22.414 20.586C22.039 20.211 21.53 20 21 20C20.47 20 19.961 20.211 19.586 20.586C19.211 20.961 19 21.47 19 22ZM27 20H29M27 24H29M19 28H29"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Protection",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 15C26.335 17.067 29.383 18.143 32.499 18C32.952 19.543 33.091 21.162 32.907 22.759C32.723 24.357 32.219 25.901 31.426 27.3C30.633 28.7 29.567 29.925 28.291 30.905C27.015 31.884 25.556 32.596 24 33C22.442 32.596 20.982 31.884 19.706 30.905C18.43 29.925 17.364 28.7 16.571 27.3C15.779 25.901 15.275 24.357 15.091 22.759C14.906 21.162 15.045 19.543 15.499 18C18.614 18.143 21.663 17.067 24 15Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 23C23 23.265 23.105 23.52 23.293 23.707C23.48 23.895 23.735 24 24 24C24.265 24 24.52 23.895 24.707 23.707C24.895 23.52 25 23.265 25 23C25 22.735 24.895 22.48 24.707 22.293C24.52 22.105 24.265 22 24 22C23.735 22 23.48 22.105 23.293 22.293C23.105 22.48 23 22.735 23 23ZM24 24V26.5"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "FAQ's",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 33C28.971 33 33 28.971 33 24C33 19.029 28.971 15 24 15C19.029 15 15 19.029 15 24C15 28.971 19.029 33 24 33ZM24 29V29.01M24 25.5C23.982 25.175 24.069 24.854 24.25 24.583C24.43 24.313 24.693 24.108 25 24C25.376 23.856 25.713 23.627 25.986 23.331C26.258 23.035 26.458 22.679 26.569 22.293C26.681 21.906 26.701 21.499 26.629 21.103C26.556 20.707 26.393 20.333 26.151 20.012C25.91 19.69 25.597 19.428 25.237 19.248C24.878 19.067 24.481 18.973 24.079 18.972C23.676 18.971 23.279 19.063 22.918 19.241C22.558 19.42 22.243 19.679 22 20"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "System Overview",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 33C28.971 33 33 28.971 33 24C33 19.029 28.971 15 24 15C19.029 15 15 19.029 15 24C15 28.971 19.029 33 24 33ZM24 20H24.01M23 24H24V28H25"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Notifications",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 34C25.1046 34 26 33.1046 26 32H22C22 33.1046 22.8954 34 24 34Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 20C30 16.6863 27.3137 14 24 14C20.6863 14 18 16.6863 18 20V24L16 28H32L30 24V20Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Contact Us",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M16 15H18C18.265 15 18.52 15.105 18.707 15.293C18.895 15.48 19 15.735 19 16V18C19 18.265 18.895 18.52 18.707 18.707C18.52 18.895 18.265 19 18 19H16C15.735 19 15.48 18.895 15.293 18.707C15.105 18.52 15 18.265 15 18V16C15 15.735 15.105 15.48 15.293 15.293C15.48 15.105 15.735 15 16 15ZM30 15H32C32.265 15 32.52 15.105 32.707 15.293C32.895 15.48 33 15.735 33 16V18C33 18.265 32.895 18.52 32.707 18.707C32.52 18.895 32.265 19 32 19H30C29.735 19 29.48 18.895 29.293 18.707C29.105 18.52 29 18.265 29 18V16C29 15.735 29.105 15.48 29.293 15.293C29.48 15.105 29.735 15 30 15ZM23 15H25C25.265 15 25.52 15.105 25.707 15.293C25.895 15.48 26 15.735 26 16V18C26 18.265 25.895 18.52 25.707 18.707C25.52 18.895 25.265 19 25 19H23C22.735 19 22.48 18.895 22.293 18.707C22.105 18.52 22 18.265 22 18V16C22 15.735 22.105 15.48 22.293 15.293C22.48 15.105 22.735 15 23 15ZM16 22H18C18.265 22 18.52 22.105 18.707 22.293C18.895 22.48 19 22.735 19 23V25C19 25.265 18.895 25.52 18.707 25.707C18.52 25.895 18.265 26 18 26H16C15.735 26 15.48 25.895 15.293 25.707C15.105 25.52 15 25.265 15 25V23C15 22.735 15.105 22.48 15.293 22.293C15.48 22.105 15.735 22 16 22ZM30 22H32C32.265 22 32.52 22.105 32.707 22.293C32.895 22.48 33 22.735 33 23V25C33 25.265 32.895 25.52 32.707 25.707C32.52 25.895 32.265 26 32 26H30C29.735 26 29.48 25.895 29.293 25.707C29.105 25.52 29 25.265 29 25V23C29 22.735 29.105 22.48 29.293 22.293C29.48 22.105 29.735 22 30 22ZM23 22H25C25.265 22 25.52 22.105 25.707 22.293C25.895 22.48 26 22.735 26 23V25C26 25.265 25.895 25.52 25.707 25.707C25.52 25.895 25.265 26 25 26H23C22.735 26 22.48 25.895 22.293 25.707C22.105 25.52 22 25.265 22 25V23C22 22.735 22.105 22.48 22.293 22.293C22.48 22.105 22.735 22 23 22ZM23 29H25C25.265 29 25.52 29.105 25.707 29.293C25.895 29.48 26 29.735 26 30V32C26 32.265 25.895 32.52 25.707 32.707C25.52 32.895 25.265 33 25 33H23C22.735 33 22.48 32.895 22.293 32.707C22.105 32.52 22 32.265 22 32V30C22 29.735 22.105 29.48 22.293 29.293C22.48 29.105 22.735 29 23 29Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Legal",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M18 15H27L33 21V33H18V15Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27 15V21H33M22 25H29M22 29H29"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Logout",
    hint: null,
    danger: true,
    isLogout: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#FF484D" />
        <path
          d="M26 20V18C26 17.47 25.789 16.961 25.414 16.586C25.039 16.211 24.53 16 24 16H17C16.47 16 15.961 16.211 15.586 16.586C15.211 16.961 15 17.47 15 18V30C15 30.53 15.211 31.039 15.586 31.414C15.961 31.789 16.47 32 17 32H24C24.53 32 25.039 31.789 25.414 31.414C25.789 31.039 26 30.53 26 30V28M21 24H33L30 21M30 27L33 24"
          stroke="#FF484D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Pause or Delete",
    hint: null,
    danger: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#FF484D" />
        <path
          d="M22 22L26 26M26 22L22 26"
          stroke="#FF484D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 15C31.2 15 33 16.8 33 24C33 31.2 31.2 33 24 33C16.8 33 15 31.2 15 24C15 16.8 16.8 15 24 15Z"
          stroke="#FF484D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const MENU_ROUTES = {
  "Chat History": "/history",
  "Current Plan": SETTINGS_PAGE_ROUTES.subscriptions,
  Billing: "/billing-section",
  "Profile Info": "/personal-information",
  Protection: SETTINGS_PAGE_ROUTES.security,
  "FAQ's": SETTINGS_PAGE_ROUTES.faqs,
  "System Overview": SETTINGS_PAGE_ROUTES["about-santumai"],
  Legal: SETTINGS_PAGE_ROUTES.legal,
  Notifications: "/notifications",
  "Contact Us": SETTINGS_PAGE_ROUTES["contact-us"],
  "Pause or Delete": SETTINGS_PAGE_ROUTES["account-management"],
};

const QUICK_ACCESS_ITEMS = [
  {
    label: "Chat History",
    caption: "Past Sessions",
    value: "View",
    href: "/history",
  },
  {
    label: "Current Plan",
    caption: "Your Subscription",
    value: "Upgrade",
    href: SETTINGS_PAGE_ROUTES.subscriptions,
  },
  {
    label: "Billing",
    caption: "Invoices & Payments",
    value: "View",
    href: "/billing-section",
  },
  {
    label: "FAQ's",
    caption: "Find Out More",
    value: "Learn",
    href: SETTINGS_PAGE_ROUTES.faqs,
  },
  {
    label: "Protection",
    caption: "Add Security",
    value: "Biometrics",
    href: SETTINGS_PAGE_ROUTES.security,
  },
];

// ─── Dark-mode Toggle Switch ──────────────────────────────────────────────────

const DarkModeToggle = ({ dark, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={dark}
    className={`relative w-[50px] h-[28px] rounded-full transition-all duration-300 flex-shrink-0 ${
      dark
        ? "bg-gray-700 border border-gray-600"
        : "bg-gray-300 border border-gray-300"
    }`}
  >
    <span
      className={`absolute top-[3px] w-[22px] h-[22px] rounded-full transition-all duration-300 flex items-center justify-center ${
        dark ? "left-[calc(100%-25px)] bg-gray-900" : "left-[3px] bg-white"
      }`}
    >
      {/* Icon */}
      {dark ? (
        <span className="text-white text-xs">🌙</span>
      ) : (
        <span className="text-yellow-500 text-xs">☀️</span>
      )}
    </span>
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [todayMoodDateKey] = useState(() => getTodayMoodDateKey());
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const moodCheckInRef = useRef(null);
  const floatingButtonRef = useRef(null);
  const { data: profileData, error: profileError } = useGetProfileQuery();
  const { data: notificationsFeed } = useGetNotificationsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [resend] = useResendOtpMutation();
  const [logout] = useLogoutMutation();
  const {
    data: todayMoodCheckIn,
    error: moodCheckInError,
    isLoading: isMoodCheckInLoading,
  } = useGetMoodCheckInQuery(todayMoodDateKey, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [upsertMoodCheckIn, { isLoading: isSavingMoodCheckIn }] =
    useUpsertMoodCheckInMutation();
  const profile = useMemo(() => profileData ?? {}, [profileData]);
  const isAccountPaused = isProfilePaused(profile);
  const profilePhone = getProfilePhone(profile);
  const unreadNotificationCount =
    typeof notificationsFeed?.stats?.unread === "number"
      ? notificationsFeed.stats.unread
      : 0;
  const hasTodayMoodCheckIn =
    Boolean(todayMoodCheckIn) && todayMoodCheckIn?.dateKey === todayMoodDateKey;

  useEffect(() => {
    registerPushServiceWorker().catch((error) => {
      console.error("Unable to register push service worker:", error);
    });
  }, []);
  useEffect(() => {
    if (!profileError) {
      return;
    }

    if (isUnauthorizedError(profileError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(getClientErrorMessage(profileError, "Failed to load profile"));
  }, [profileError, router]);

  useEffect(() => {
    if (profile?.verification?.email === false) {
      const sendOtp = async () => {
        await resend().unwrap();
        router.replace("/verify-otp");
      };

      sendOtp();
    }
  }, [profile, resend, router]);

  useEffect(() => {
    if (!moodCheckInError) {
      return;
    }

    if (isUnauthorizedError(moodCheckInError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(
        moodCheckInError,
        "Unable to load today's mood check-in",
      ),
    );
  }, [moodCheckInError, router]);

  useEffect(() => {
    let ticking = false;

    const updateButtonPosition = () => {
      const footer = document.getElementById("global-footer");
      const button = floatingButtonRef.current;

      if (!footer || !button) {
        ticking = false;
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visibleFooterHeight = Math.max(0, windowHeight - footerRect.top);

      button.style.transform = `translateY(-${visibleFooterHeight}px)`;

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateButtonPosition);
        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      router.replace("/sign-in");
    } catch (error) {
      console.log(error);
      toast.error(getClientErrorMessage(error, "Unable to log out"));
    }
  };

  const focusMoodCheckIn = () => {
    moodCheckInRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleSaveMoodCheckIn = async (values) => {
    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    try {
      await upsertMoodCheckIn({
        dateKey: todayMoodDateKey,
        happiness: values.happiness,
        stress: values.stress,
        energy: values.energy,
      }).unwrap();
      toast.success("Mood check-in saved for today");
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      toast.error(
        getClientErrorMessage(error, "Unable to save your mood check-in"),
      );
    }
  };

  const handleOpenChat = () => {
    setDrawerOpen(false);
    setLogoutOpen(false);

    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    if (!isMoodCheckInLoading && !moodCheckInError && !hasTodayMoodCheckIn) {
      focusMoodCheckIn();
      toast.error("Complete today's mood check-in before starting a chat.");
      return;
    }

    router.push("/santumai-chat");
  };

  const handleOpenNotifications = () => {
    router.push("/notifications");
  };

  const navigateTo = (href) => {
    setDrawerOpen(false);
    setLogoutOpen(false);

    if (href === "/santumai-chat") {
      handleOpenChat();
      return;
    }

    router.push(href);
  };
  const themeLabel = isDark ? "Dark mode" : "Light mode";
  const themeStatus = "Saved for this browser";
  const drawerHoverClass = isDark
    ? "hover:bg-white/5 active:bg-white/10"
    : "hover:bg-[#f9fffe] active:bg-[#E4FFEE]";
  const dangerHoverClass = isDark
    ? "hover:bg-[#35191d] active:bg-[#431f24]"
    : "hover:bg-red-50 active:bg-red-100";

  const displayName = getProfileFullName(profile) || "Anonymous Anonymous";
  const firstName = getProfileFirstName(profile) || "Anonymous";
  const emailAddress = getProfileEmail(profile);
  const contactLine =
    emailAddress || profilePhone || "Managed from your Santum account";
  const profileInitials = buildProfileInitials(
    getProfileFirstName(profile) || displayName.split(" ").filter(Boolean)[0],
    getProfileLastName(profile) || displayName.split(" ").filter(Boolean)[1],
  );

  return (
    <div className="theme-shell min-h-dvh flex justify-center lg:px-4 lg:py-4">
      <div className="theme-surface theme-border relative flex min-h-dvh w-full lg:max-w-3xl flex-col overflow-hidden lg:min-h-[calc(100dvh-2rem)] lg:rounded-[36px] lg:border lg:shadow-[0_24px_64px_rgba(15,15,15,0.08)]">
        {/* ── Green header background ── */}
        <div className="relative overflow-hidden bg-[#323d51] px-4 pb-4 pt-3 sm:px-6 sm:pt-9 lg:px-10 lg:pb-6 lg:pt-10">

          {/* Nav row */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Logo placeholder */}
            <Image
              src="/Logo Source files 21-4/Icon/SVG/Artboard1.svg"
              alt=""
              width={95}
              height={95}
              className="object-contain"
              unoptimized
            />
            <div className="flex items-center gap-3 text-[#dedede]">
              {/* Bell */}
              <button
                type="button"
                className="relative"
                onClick={handleOpenNotifications}
              >
                <Bell />
                {unreadNotificationCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF484D] px-1 text-[10px] font-medium text-white">
                    {unreadNotificationCount > 99
                      ? "99+"
                      : unreadNotificationCount}
                  </span>
                ) : null}
              </button>
              {/* Hex / settings */}
              <button type="button" onClick={() => setDrawerOpen(true)}>
                <Settings />
              </button>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative z-10 mt-2 max-w-[720px] pb-2">
            <h2 className="text-[32px] font-bold leading-[40px] text-[#dedede] sm:text-[38px] sm:leading-[46px] lg:text-[46px] lg:leading-[54px]">
              Hello!{" "}
              <span
                className="inline-block"
                style={{
                  transformOrigin: "70% 70%",
                  animation: "wave 2.5s ease-in-out infinite",
                }}
              >
                👋
              </span>
            </h2>
            <h3 className="mt-3 text-[18px] font-semibold leading-6 text-[#dedede] sm:text-[20px] lg:text-[22px]">
              I&apos;m Sai,
            </h3>
            <p className="mb-3 mt-2 pb-3 font-satoshi text-[16px] font-medium leading-[24px] text-white sm:text-[17px] lg:max-w-[640px] lg:text-[18px] lg:leading-[28px]">
              I&apos;m here to listen and help you make sense of what
              you&apos;re experiencing
            </p>
          </div>
        </div>

        {/* ── White card ── */}
        <section className="theme-surface relative -mt-5 flex-1 overflow-y-auto rounded-t-[32px] px-4 pb-28 pt-6 transition-colors duration-300 sm:px-6 md:px-8 lg:px-10 lg:pb-32 lg:pt-8 lg:rounded-t-[40px]">
          {/* GPT Plus promo card */}
          <div className="theme-card-soft mb-5 flex flex-col overflow-hidden rounded-[20px] transition-colors duration-300 sm:flex-row sm:items-stretch sm:justify-between">
            <div className="flex flex-col justify-between p-4 sm:p-5 lg:p-6">
              <div>
                <h4 className="text-[#0F0F0F] text-[22px] font-semibold leading-[30px]">
                  Santum AI Plans
                </h4>
                <p className="mt-1 text-[14px] font-medium leading-6 text-[#555] lg:text-[15px]">
                  Unlock advanced features for deeper support and faster replies
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/plus-subscription")}
                className="theme-surface mt-4 self-start rounded-[8px] px-4 py-[10px] text-[14px] font-semibold text-[#00D061] transition-all duration-300 active:scale-[0.97]"
              >
                View Plans
              </button>
            </div>
          </div>

          <div ref={moodCheckInRef} className="mb-5">
            {isMoodCheckInLoading && !todayMoodCheckIn ? (
              <div className="theme-card rounded-[24px] border px-4 py-4 shadow-[0_12px_30px_rgba(15,15,15,0.04)]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#00A84D]">
                  Mood Check-In
                </p>
                <p className="mt-3 text-[15px] font-medium text-[#0F0F0F]">
                  Checking whether you&apos;ve already checked in today...
                </p>
              </div>
            ) : (
              <MoodCheckInCard
                key={`home-mood-${todayMoodCheckIn?.updatedAt ?? todayMoodDateKey}-${hasTodayMoodCheckIn ? "saved" : "draft"}`}
                entry={hasTodayMoodCheckIn ? todayMoodCheckIn : null}
                isSaving={isSavingMoodCheckIn}
                onSubmit={handleSaveMoodCheckIn}
              />
            )}
          </div>

          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-[#0F0F0F] text-[20px] font-semibold leading-7">
                  Quick access
                </h4>
                <p className="text-[#555] font-satoshi text-[14px] leading-6">
                  Fast ways to move around the app.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACCESS_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className="theme-card rounded-[22px] border px-4 py-4 text-left transition-all duration-300 hover:-translate-y-[1px]"
                >
                  <span className="inline-flex rounded-full bg-[#E8FFF1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00A84D]">
                    {item.value}
                  </span>
                  <h5 className="mt-3 text-[#0F0F0F] text-[17px] font-semibold leading-6">
                    {item.label}
                  </h5>
                  <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
                    {item.caption}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Start Chat fixed button ── */}
        <div
          ref={floatingButtonRef}
          className="fixed bottom-5 left-0 right-0 z-10 mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 lg:px-10 will-change-transform"
        >
          <button
            type="button"
            onClick={handleOpenChat}
            className="mx-auto flex h-[56px] w-full max-w-[343px] items-center justify-center rounded-[12px] bg-[#00D061] text-[18px] font-medium text-white shadow-[0_4px_20px_rgba(0,208,97,0.4)] transition-all active:scale-[0.98] hover:opacity-92 sm:max-w-[420px]"
          >
            Start Chatting
          </button>
        </div>

        {/* ══════════════════════════════════════════════
            SETTINGS DRAWER (left slide-in)
        ══════════════════════════════════════════════ */}

        {/* Backdrop */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Drawer panel */}
        <div
          className={`theme-surface-elevated fixed left-0 top-0 z-50 flex h-full w-[320px] max-w-[85vw] flex-col transition-transform duration-300 ease-in-out sm:w-[360px] ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="theme-border-strong flex items-center justify-between border-b-2 px-4 py-4">
            <h5 className="theme-text-primary text-[18px] font-medium">
              Settings
            </h5>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="theme-text-primary text-[24px] leading-none"
            >
              <X />
            </button>
          </div>

          {/* Profile row */}
          <div className="theme-border-strong flex items-center justify-between border-b-2 px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="theme-surface-soft flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-[28px] transition-colors duration-300">
                <span className="text-[20px] font-semibold text-[#00A84D]">
                  {profileInitials}
                </span>
              </div>
              <div className="max-w-40">
                <p className="theme-text-primary text-[16px] font-medium">
                  {firstName}
                </p>
                <p className="text-[14px] text-[#555] truncate">
                  {contactLine}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable menu */}
          <div className="flex-1 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#ccc]">
            {MENU_ITEMS.map((item) => {
              if (item.isLogout) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setLogoutOpen(true);
                    }}
                    className={`theme-border-strong w-full flex items-center justify-between border-b-2 px-4 py-2 transition-colors ${dangerHoverClass}`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      <span className="text-[#FF484D] text-[15px] font-medium">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRightIcon />
                  </button>
                );
              }

              // Dark mode row
              if (item.label === "Light Mode" || item.label === "Dark Mode")
                return null;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    const href = MENU_ROUTES[item.label];

                    if (!href) {
                      toast.error("This page is not mapped yet.");
                      return;
                    }

                    navigateTo(href);
                  }}
                  className={`theme-border-strong w-full flex items-center justify-between border-b-2 px-4 py-2 transition-colors ${drawerHoverClass}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {item.icon}
                    <span
                      className={`truncate text-[15px] font-medium ${item.danger ? "text-[#FF484D]" : "theme-text-primary"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {item.hint && (
                      <span className="text-[13px] text-[#555]">
                        {item.hint}
                      </span>
                    )}
                    <ChevronRightIcon className="text-[#00D061]" />
                  </div>
                </button>
              );
            })}

            {/* Dark mode toggle row */}
            <div className="theme-border-strong flex items-center justify-between border-b-2 px-4 py-3">
              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <rect
                    opacity="0.08"
                    width="48"
                    height="48"
                    rx="8"
                    fill="#00D061"
                  />
                  <path
                    d="M24 26C25.105 26 26 25.105 26 24C26 22.895 25.105 22 24 22C22.895 22 22 22.895 22 24C22 25.105 22.895 26 24 26ZM34 24C31.333 28.667 28 31 24 31C20 31 16.667 28.667 14 24C16.667 19.333 20 17 24 17C28 17 31.333 19.333 34 24Z"
                    stroke="#00D061"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className="theme-text-primary text-[15px] font-medium">
                    {themeLabel}
                  </p>
                  <p className="theme-text-secondary text-[12px] leading-5">
                    {themeStatus}
                  </p>
                </div>
              </div>
              <DarkModeToggle dark={isDark} onToggle={toggleTheme} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            LOGOUT BOTTOM SHEET
        ══════════════════════════════════════════════ */}

        {/* Backdrop */}
        {logoutOpen && (
          <div
            className="fixed inset-0 z-40"
            style={{
              background:
                "linear-gradient(180deg,rgba(18,18,18,.56) 0%,rgba(18,18,18,.24) 100%)",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setLogoutOpen(false)}
          />
        )}

        {/* Bottom sheet */}
        <div
          className={`theme-surface-elevated fixed left-0 right-0 z-50 mx-auto max-w-[1200px] rounded-t-[24px] px-4 pb-8 pt-4 transition-all duration-300 ease-in-out sm:px-6 md:px-8 lg:px-10 ${
            logoutOpen
              ? "translate-y-0 bottom-0"
              : "translate-y-full -bottom-full"
          }`}
        >
          {/* Pull handle */}
          <div className="flex justify-center mb-4">
            <button type="button" onClick={() => setLogoutOpen(false)}>
              <CollapseIcon />
            </button>
          </div>
          <h2 className="theme-text-primary mb-3 text-center text-[20px] font-semibold leading-[30px]">
            Logout
          </h2>
          <p className="theme-text-secondary mb-6 text-center text-[16px] font-medium leading-6">
            Are you sure you want to log out?
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setLogoutOpen(false)}
              className="theme-card-soft rounded-[12px] px-13 py-[18px] text-[18px] font-medium text-[#00D061] transition-all duration-300 active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleLogout()}
              className="text-white text-[18px] font-medium px-8 py-[18px] rounded-[12px] bg-[#00D061] transition-all active:scale-[0.97]"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>

      {/* Wave animation keyframes */}
      <style>{`
        @keyframes wave {
          0%   { transform: rotate(0deg); }
          10%  { transform: rotate(14deg); }
          20%  { transform: rotate(-8deg); }
          30%  { transform: rotate(14deg); }
          40%  { transform: rotate(-4deg); }
          50%  { transform: rotate(10deg); }
          60%  { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
