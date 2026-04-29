"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  useDeleteChatMutation,
  useGetChatsQuery,
  useGetProfileQuery,
} from "@/lib/store";
import { MessageSquare, RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

function formatChatTimestamp(value) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);
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

function getChatTitle(chat) {
  if (typeof chat?.title === "string" && chat.title.trim()) {
    return chat.title.trim();
  }

  if (typeof chat?.lastMessage === "string" && chat.lastMessage.trim()) {
    return chat.lastMessage.trim().slice(0, 60);
  }

  return "Untitled conversation";
}

export default function ChatHistoryPage() {
  const router = useRouter();
  const { data: profile, error: profileError } = useGetProfileQuery();
  const profilePhone =
    profile?.phone || profile?.mobile || profile?.user_phone || "";
  const {
    data: chats = [],
    error: chatsError,
    isLoading,
    isFetching,
    refetch,
  } = useGetChatsQuery(profilePhone, {
    skip: !profilePhone,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [deleteChat, { isLoading: isDeletingChat }] = useDeleteChatMutation();

  useEffect(() => {
    if (!profileError) {
      return;
    }

    if (isUnauthorizedError(profileError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(getClientErrorMessage(profileError, "Unable to load profile"));
  }, [profileError, router]);

  useEffect(() => {
    if (!chatsError) {
      return;
    }

    if (isUnauthorizedError(chatsError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(chatsError, "Unable to load chat history"),
    );
  }, [chatsError, router]);

  const latestChat = chats[0] ?? null;

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Delete this conversation and its saved messages?")) {
      return;
    }

    try {
      await deleteChat(chatId).unwrap();
      toast.success("Conversation deleted");
    } catch (error) {
      toast.error(getClientErrorMessage(error, "Unable to delete conversation"));
    }
  };

  return (
    <StepPageShell title="History" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Conversation Memory"
        title="Return to any real conversation in seconds"
        description="Your finished Amigo chats are now saved in MongoDB and can be reopened from this history screen."
        imageSrc="/icons/robot-slider-img2.png"
        imageAlt="Chat history preview"
        className="mb-6"
      />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="theme-card-muted rounded-[22px] border px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            {chats.length}
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Chats
          </p>
        </div>
        <div className="theme-card-muted rounded-[22px] border px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            {latestChat ? formatChatTimestamp(latestChat.updatedAt) : "--"}
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Latest
          </p>
        </div>
        <div className="theme-card-muted rounded-[22px] border px-3 py-4 text-center">
          <p className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            {isFetching ? "Sync" : "Live"}
          </p>
          <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
            Status
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            Recent sessions
          </h2>
          <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
            Open any saved thread and keep going where you left off.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-full bg-[#E8FFF1] px-4 py-2 text-[13px] font-semibold text-[#00A84D] disabled:opacity-60"
        >
          <RefreshCcw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="theme-card rounded-[24px] border px-5 py-8 text-center">
          <p className="font-satoshi text-[15px] leading-6 text-[#555]">
            Loading your saved conversations...
          </p>
        </div>
      ) : chats.length === 0 ? (
        <div className="theme-card rounded-[24px] border px-5 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8FFF1] text-[#00A84D]">
            <MessageSquare size={24} />
          </div>
          <h3 className="mt-4 text-[18px] font-semibold leading-7 text-[#0F0F0F]">
            No saved chats yet
          </h3>
          <p className="mt-2 font-satoshi text-[14px] leading-6 text-[#555]">
            Start a conversation with Amigo and it will appear here once the
            reply is finished and stored.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <div
              key={String(chat._id)}
              className="theme-card rounded-[24px] border px-4 py-4 shadow-[0_12px_30px_rgba(15,15,15,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/amigo-chat?chat=${chat._id}`)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[16px] font-semibold leading-6 text-[#0F0F0F]">
                      {getChatTitle(chat)}
                    </h3>
                    <span className="rounded-full bg-[#E8FFF1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00A84D]">
                      {formatChatTimestamp(chat.updatedAt)}
                    </span>
                  </div>
                  <p className="mt-2 font-satoshi text-[14px] leading-6 text-[#555] truncate">
                    {chat.lastMessage || "This conversation is ready to reopen."}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteChat(String(chat._id))}
                  disabled={isDeletingChat}
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF3F3] text-[#D94B4B] transition-colors hover:bg-[#FFE7E7] disabled:opacity-60"
                  aria-label="Delete conversation"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/amigo-chat")}
          className="rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
        >
          Start Fresh Chat
        </button>
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="theme-secondary-button rounded-[14px] px-5 py-4 text-[16px] font-semibold"
        >
          Back To Home
        </button>
      </div>
    </StepPageShell>
  );
}
