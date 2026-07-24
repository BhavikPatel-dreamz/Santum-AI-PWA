"use client";

import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  registerPushServiceWorker,
  subscribeCurrentBrowserToPush,
  unsubscribeCurrentBrowserFromPush,
} from "@/lib/push/client";
import {
  useGetNotificationsQuery,
  useGetProfileQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/lib/store";
import { PAUSED_ACCOUNT_MESSAGE, isProfilePaused } from "@/lib/utills/profile";
import {
  Bell,
  CheckCheck,
  CircleUserRound,
  Coins,
  HeartHandshake,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function formatNotificationTime(value) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function getNotifications(feed) {
  return Array.isArray(feed?.notifications) ? feed.notifications : [];
}

function getNotificationStats(feed) {
  if (!feed?.stats || typeof feed.stats !== "object") {
    return {
      priority: 0,
      total: 0,
      unread: 0,
    };
  }

  return {
    priority: typeof feed.stats.priority === "number" ? feed.stats.priority : 0,
    total: typeof feed.stats.total === "number" ? feed.stats.total : 0,
    unread: typeof feed.stats.unread === "number" ? feed.stats.unread : 0,
  };
}

function getNotificationIcon(notification) {
  switch (notification?.category) {
    case "credits":
      return Coins;
    case "wellness":
      return HeartHandshake;
    case "account":
      return CircleUserRound;
    case "billing":
    default:
      return Bell;
  }
}

function getPushPermissionDetails({
  isPushEnabled,
  isPushSupported,
  pushPermission,
}) {
  if (!isPushSupported) {
    return {
      badge: "Unsupported",
      description: "This device does not support push notifications.",
    };
  }

  if (isPushEnabled) {
    return {
      badge: "On",
      description: "Push notifications are enabled.",
    };
  }

  if (pushPermission === "denied") {
    return {
      badge: "Blocked",
      description:
        "Notifications are blocked. Please enable them in site settings.",
    };
  }

  if (pushPermission === "granted") {
    return {
      badge: "Off",
      description: "Push notifications are off.",
    };
  }

  return {
    badge: "Off",
    description: "Turn this on to allow push notifications.",
  };
}

async function getPushPermissionState() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    typeof Notification === "undefined"
  ) {
    return {
      isPushSupported: false,
      isPushEnabled: false,
      pushPermission: "unsupported",
    };
  }

  await registerPushServiceWorker();
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  return {
    isPushSupported: true,
    isPushEnabled:
      Notification.permission === "granted" && Boolean(subscription),
    pushPermission: Notification.permission,
  };
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const isAccountPaused = isProfilePaused(profile);
  const [isPushSupported, setIsPushSupported] = useState(true);
  const [pushPermission, setPushPermission] = useState("default");
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isUpdatingPush, setIsUpdatingPush] = useState(false);
  const {
    data: notificationsFeed,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  const [markAllNotificationsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();
  const [markNotificationRead, { isLoading: isMarkingSingle }] =
    useMarkNotificationReadMutation();
  const notifications = getNotifications(notificationsFeed);
  const stats = getNotificationStats(notificationsFeed);
  const pushPermissionDetails = getPushPermissionDetails({
    isPushEnabled,
    isPushSupported,
    pushPermission,
  });

  const syncPushPermissionState = async () => {
    const nextState = await getPushPermissionState();

    setIsPushSupported(nextState.isPushSupported);
    setPushPermission(nextState.pushPermission);
    setIsPushEnabled(nextState.isPushEnabled);
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    if (isUnauthorizedError(error)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(getClientErrorMessage(error, "Unable to load notifications"));
  }, [error, router]);

  useEffect(() => {
    let isMounted = true;

    const loadPushPermissionState = async () => {
      try {
        const nextState = await getPushPermissionState();

        if (!isMounted) {
          return;
        }

        setIsPushSupported(nextState.isPushSupported);
        setPushPermission(nextState.pushPermission);
        setIsPushEnabled(nextState.isPushEnabled);
      } catch (pushError) {
        console.error("Unable to load push notification state:", pushError);

        if (!isMounted) {
          return;
        }

        setIsPushSupported(false);
        setPushPermission("unsupported");
        setIsPushEnabled(false);
      }
    };

    loadPushPermissionState();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    try {
      await markAllNotificationsRead().unwrap();
      toast.success("All notifications marked as read.");
    } catch (markError) {
      toast.error(
        getClientErrorMessage(
          markError,
          "Unable to mark notifications as read",
        ),
      );
    }
  };

  const handleOpenNotification = async (notification) => {
    if (isAccountPaused) {
      if (notification.actionHref) {
        router.push(notification.actionHref);
        return;
      }

      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    try {
      if (notification.unread) {
        await markNotificationRead(notification.id).unwrap();
      }

      if (notification.actionHref) {
        router.push(notification.actionHref);
      }
    } catch (markError) {
      toast.error(
        getClientErrorMessage(markError, "Unable to update notification"),
      );
    }
  };

  const handleTogglePushNotifications = async () => {
    if (isUpdatingPush) {
      return;
    }

    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    setIsUpdatingPush(true);

    try {
      if (isPushEnabled) {
        await unsubscribeCurrentBrowserFromPush();
        toast.success("Push notifications turned off for this browser.");
      } else {
        const result = await subscribeCurrentBrowserToPush();

        if (result.status === "unsupported") {
          toast.error("Push notifications are not supported on this browser.");
          return;
        }

        if (result.status === "denied") {
          toast.error(
            "Notifications are blocked. Enable them from your browser site settings.",
          );
          return;
        }

        if (result.status !== "granted") {
          toast.error("Push notifications were not enabled.");
          return;
        }

        toast.success("Push notifications turned on for this browser.");
      }
    } catch (pushError) {
      if (isUnauthorizedError(pushError)) {
        router.replace("/sign-in");
        return;
      }

      toast.error(
        getClientErrorMessage(pushError, "Unable to update push notifications"),
      );
    } finally {
      setIsUpdatingPush(false);
      syncPushPermissionState().catch((pushError) => {
        console.error("Unable to refresh push notification state:", pushError);
      });
    }
  };

  return (
    <StepPageShell title="Notifications" contentClassName="overflow-y-auto">
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="theme-card-muted rounded-[22px] border px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            {stats.total}
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Total
          </p>
        </div>
        <div className="theme-card-muted rounded-[22px] border px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            {stats.unread}
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Unread
          </p>
        </div>
        <div className="theme-card-muted rounded-[22px] border px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            {stats.priority}
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Priority
          </p>
        </div>
      </div>

      <div className="theme-card mb-6 rounded-[24px] border px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-semibold leading-7 text-[#0F0F0F]">
                Push notifications
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  isPushEnabled
                    ? "bg-[#E8FFF1] text-[#00A84D]"
                    : pushPermission === "denied"
                      ? "bg-[#FFF3E9] text-[#D46B08]"
                      : "bg-[#F4F7F5] text-[#7E8A83]"
                }`}
              >
                {pushPermissionDetails.badge}
              </span>
            </div>
            <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
              {pushPermissionDetails.description}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isPushEnabled}
            aria-label="Toggle push notifications"
            onClick={handleTogglePushNotifications}
            disabled={!isPushSupported || isUpdatingPush}
            className={`relative h-[30px] w-[54px] shrink-0 rounded-full transition-all duration-300 ${
              isPushEnabled ? "bg-[#00D061]" : "theme-surface-secondary"
            } ${!isPushSupported || isUpdatingPush ? "opacity-60" : ""}`}
          >
            <span
              className={`theme-surface absolute top-[3px] h-6 w-6 rounded-full shadow-sm transition-all duration-300 ${
                isPushEnabled ? "left-[26px]" : "left-[3px]"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            Recent updates
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-full border border-[#D6F5E3] bg-white px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-[13px] font-semibold text-[#0F0F0F] disabled:opacity-60"
          >
            <RefreshCcw
              size={14}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={stats.unread === 0 || isMarkingAll}
            className="inline-flex items-center gap-2 rounded-full bg-[#E8FFF1] px-2 py-1 md:px-4 md:py-2 text-[10px]  md:text-[13px]  font-semibold text-[#00A84D] disabled:opacity-60"
          >
            <CheckCheck size={14} />
            Mark all
          </button>
        </div>
      </div>
      <p className="mb-2  font-satoshi text-[14px] leading-6 text-[#555]">
        Synced from your billing, credits, mood, and account activity.
      </p>

      {isLoading ? (
        <div className="theme-card rounded-[24px] border px-5 py-8 text-center">
          <p className="font-satoshi text-[15px] leading-6 text-[#555]">
            Loading your in-app notifications...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="theme-card rounded-[24px] border px-5 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8FFF1] text-[#00A84D]">
            <Bell size={24} />
          </div>
          <h3 className="mt-4 text-[18px] font-semibold leading-7 text-[#0F0F0F]">
            No notifications yet
          </h3>
          <p className="mt-2 font-satoshi text-[14px] leading-6 text-[#555]">
            New billing, token, mood, and account updates will land here as you
            use the app.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => {
            const NotificationIcon = getNotificationIcon(item);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleOpenNotification(item)}
                disabled={isMarkingSingle}
                className={`w-full rounded-[24px] border px-4 py-4 text-left shadow-[0_12px_30px_rgba(15,15,15,0.04)] transition-all duration-200 ${
                  item.unread ? "border-[#D6F5E3] bg-[#F8FFFB]" : "theme-card"
                } ${isMarkingSingle ? "opacity-70" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      item.unread ? "bg-[#E8FFF1]" : "bg-[#F4F7F5]"
                    }`}
                  >
                    <NotificationIcon size={18} className="text-[#00A84D]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[16px] font-semibold leading-6 text-[#0F0F0F]">
                        {item.title}
                      </h3>
                      {item.priority === "high" ? (
                        <span className="rounded-full bg-[#FFF3E9] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D46B08]">
                          Priority
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
                      {item.description}
                    </p>
                    {item.actionLabel ? (
                      <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#00A84D]">
                        {item.actionLabel}
                      </p>
                    ) : null}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#7E8A83]">
                        {formatNotificationTime(item.createdAt)}
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
            );
          })}
        </div>
      )}
    </StepPageShell>
  );
}
