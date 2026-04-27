 "use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  appApi,
  useAppDispatch,
  useCreateChatMutation,
  useGetChatQuery,
  useGetChatMessagesQuery,
  useGetCreditBalanceQuery,
  useGetProfileQuery,
} from "@/lib/store";
import { extractCreditBalance, formatCreditAmount } from "@/lib/utills/credit";
import { getProfilePhone } from "@/lib/utills/profile";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

const QUICK_PROMPTS = [
  "Plan my week in 5 steps",
  "Write a friendly pitch intro",
  "Turn notes into flashcards",
  "Summarize a long article",
];

const CREDIT_LIMIT_MESSAGE =
  "You have reached your chat credit limit. Purchase a plan to continue with Amigo.";
const PURCHASE_PLAN_PATH = "/plus-subscription";
const PLAN_LEVEL = "premium";
const STARTER_MESSAGES = [
  {
    id: "starter-assistant",
    role: "assistant",
    text: "Hi, I’m Amigo. I can help you brainstorm, organize, or explain something fast.",
  },
];

function isCreditLimitError(error) {
  if (error?.status === 402 || error?.data?.code === "CREDIT_LIMIT_REACHED") {
    return true;
  }

  const message = [error?.message, error?.data?.message]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    message.includes("token limit") ||
    message.includes("credit limit") ||
    message.includes("not enough credits") ||
    message.includes("insufficient credits")
  );
}

function getCreditLimitMessage(error) {
  return error?.data?.message || error?.message || CREDIT_LIMIT_MESSAGE;
}

function mapStoredMessage(message) {
  return {
    id: String(message?._id ?? message?.id ?? `${message?.role}-${Date.now()}`),
    role: message?.role === "user" ? "user" : "assistant",
    text: String(message?.content ?? message?.text ?? ""),
  };
}

function buildHistory(messages) {
  return messages
    .filter(
      (message) =>
        message?.id !== "starter-assistant" &&
        typeof message?.text === "string" &&
        message.text.trim(),
    )
    .map((message) => ({
      role: message.role === "user" ? "human" : "ai",
      content: message.text,
    }));
}

function buildTempMessageId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function AmigoChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const requestedChatId = searchParams.get("chat");
  const [composer, setComposer] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [purchasePromptMessage, setPurchasePromptMessage] = useState("");
  const [draftMessages, setDraftMessages] = useState([]);
  const [hasDraftMessages, setHasDraftMessages] = useState(false);
  const createChatPromiseRef = useRef(null);

  const { data: profile, error: profileError } = useGetProfileQuery();
  const {
    data: balanceResponse,
    error: balanceError,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useGetCreditBalanceQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const {
    data: activeChat,
    error: chatError,
    isLoading: isChatLoading,
  } = useGetChatQuery(requestedChatId, {
    skip: !requestedChatId,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const {
    data: storedMessagesData,
    error: storedMessagesError,
    isLoading: isMessagesLoading,
  } = useGetChatMessagesQuery(requestedChatId, {
    skip: !requestedChatId || !activeChat,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [createChat] = useCreateChatMutation();

  const profilePhone = getProfilePhone(profile);
  const creditBalance = extractCreditBalance(balanceResponse);
  const isCreditDepleted = creditBalance !== null && creditBalance <= 0;
  const isConversationLoading =
    Boolean(requestedChatId) &&
    !hasDraftMessages &&
    (isChatLoading || isMessagesLoading);
  const activeChatTitle =
    typeof activeChat?.title === "string" && activeChat.title.trim()
      ? activeChat.title.trim()
      : "Stored conversation";

  const persistedMessages = useMemo(() => {
    if (!requestedChatId) {
      return STARTER_MESSAGES;
    }

    if (Array.isArray(storedMessagesData)) {
      if (storedMessagesData.length > 0) {
        return storedMessagesData.map(mapStoredMessage);
      }

      return activeChat?.isEmpty ? STARTER_MESSAGES : [];
    }

    return [];
  }, [activeChat?.isEmpty, requestedChatId, storedMessagesData]);

  const messages = hasDraftMessages ? draftMessages : persistedMessages;

  const loadCreditBalance = async ({ silent = false } = {}) => {
    try {
      const response = await refetchBalance().unwrap();
      return extractCreditBalance(response);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return null;
      }

      if (!silent) {
        toast.error(
          getClientErrorMessage(error, "Unable to load credit balance"),
        );
      }

      return null;
    }
  };

  const ensureChatId = async () => {
    if (requestedChatId) {
      return requestedChatId;
    }

    if (createChatPromiseRef.current) {
      return createChatPromiseRef.current;
    }

    if (!profilePhone) {
      throw { message: "Your profile is still loading. Please try again." };
    }

    createChatPromiseRef.current = createChat({
      user: profilePhone,
      planType: PLAN_LEVEL,
    })
      .unwrap()
      .then((chat) => {
        const nextChatId = String(chat?._id ?? chat?.id ?? "");

        if (!nextChatId) {
          throw { message: "Unable to initialize a new conversation" };
        }

        router.replace(`/amigo-chat?chat=${nextChatId}`);
        return nextChatId;
      })
      .finally(() => {
        createChatPromiseRef.current = null;
      });

    return createChatPromiseRef.current;
  };

  const initializeChat = useEffectEvent(() => {
    ensureChatId().catch((error) => {
      toast.error(getClientErrorMessage(error, "Unable to start a new chat"));
    });
  });

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
    if (!balanceError) {
      return;
    }

    if (isUnauthorizedError(balanceError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(balanceError, "Unable to load credit balance"),
    );
  }, [balanceError, router]);

  useEffect(() => {
    if (!chatError) {
      return;
    }

    if (isUnauthorizedError(chatError)) {
      router.replace("/sign-in");
      return;
    }

    if (chatError?.status === 404) {
      toast.error(
        "This conversation was not found or has already been deleted.",
      );
      router.replace("/settings/history");
      return;
    }

    toast.error(
      getClientErrorMessage(chatError, "Unable to load this conversation"),
    );
  }, [chatError, router]);

  useEffect(() => {
    if (!storedMessagesError) {
      return;
    }

    if (isUnauthorizedError(storedMessagesError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(
        storedMessagesError,
        "Unable to load this conversation",
      ),
    );
  }, [router, storedMessagesError]);

  useEffect(() => {
    if (requestedChatId || !profilePhone) {
      return;
    }

    initializeChat();
  }, [profilePhone, requestedChatId]);

  useEffect(() => {
    if (isCreditDepleted) {
      setPurchasePromptMessage(
        (currentMessage) => currentMessage || CREDIT_LIMIT_MESSAGE,
      );
      return;
    }

    if (creditBalance !== null && creditBalance > 0) {
      setPurchasePromptMessage("");
    }
  }, [creditBalance, isCreditDepleted]);

  const promptPlanPurchase = async (message, draftMessage = "") => {
    const nextMessage = message || CREDIT_LIMIT_MESSAGE;

    setPurchasePromptMessage(nextMessage);

    if (draftMessage) {
      setComposer((currentMessage) =>
        currentMessage.trim() ? currentMessage : draftMessage,
      );
    }

    toast.error(nextMessage);
    await loadCreditBalance({ silent: true });
  };

  const sendMessage = async (nextMessage) => {
    const text = nextMessage.trim();

    if (!text || isReplying) {
      return;
    }

    if (isCreditDepleted) {
      await promptPlanPurchase(CREDIT_LIMIT_MESSAGE, text);
      return;
    }

    setIsReplying(true);

    let typingInterval;

    try {
      const chatId = await ensureChatId();
      const baseMessages = hasDraftMessages ? draftMessages : persistedMessages;
      const userMessage = {
        id: buildTempMessageId("user"),
        role: "user",
        text,
      };
      const history = buildHistory(baseMessages);

      setDraftMessages([...baseMessages, userMessage]);
      setHasDraftMessages(true);
      setComposer("");

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          message: text,
          chat_history: history,
          plan_level: PLAN_LEVEL,
        }),
      });

      if (!response.ok) {
        let errorData = {};

        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

        throw {
          message: errorData?.message || "Failed to connect to Amigo",
          status: response.status,
          data: errorData,
        };
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const assistantMessageId = buildTempMessageId("assistant");

      setDraftMessages((currentMessages) => [
        ...currentMessages,
        { id: assistantMessageId, role: "assistant", text: "" },
      ]);

      let accumulatedText = "";
      let displayedText = "";
      let isStreamDone = false;

      typingInterval = setInterval(() => {
        if (displayedText.length < accumulatedText.length) {
          const diff = accumulatedText.length - displayedText.length;
          const increment = diff > 50 ? 10 : diff > 20 ? 5 : 2;

          displayedText = accumulatedText.substring(
            0,
            displayedText.length + increment,
          );

          setDraftMessages((currentMessages) =>
            currentMessages.map((message) =>
              message.id === assistantMessageId
                ? { ...message, text: displayedText }
                : message,
            ),
          );
        } else if (isStreamDone) {
          clearInterval(typingInterval);
        }
      }, 30);

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          isStreamDone = true;
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
      }

      await loadCreditBalance({ silent: true });

      try {
        await dispatch(
          appApi.endpoints.getChatMessages.initiate(chatId, {
            forceRefetch: true,
          }),
        ).unwrap();
        dispatch(
          appApi.util.invalidateTags([
            "Chats",
            { type: "Chat", id: chatId },
            { type: "Messages", id: chatId },
          ]),
        );
        setHasDraftMessages(false);
        setDraftMessages([]);
      } catch (refetchError) {
        console.error("Unable to refresh stored chat messages:", refetchError);
      }
    } catch (error) {
      console.error("Chat error:", error);

      if (isCreditLimitError(error)) {
        setHasDraftMessages(false);
        setDraftMessages([]);
        await promptPlanPurchase(getCreditLimitMessage(error), text);
        return;
      }

      toast.error(getClientErrorMessage(error, "Unable to connect to Amigo"));
      setHasDraftMessages(true);
      setDraftMessages((currentMessages) => [
        ...(currentMessages.length > 0 ? currentMessages : persistedMessages),
        {
          id: buildTempMessageId("assistant-error"),
          role: "assistant",
          text: "Sorry, I'm having trouble connecting to Amigo right now. Please check your connection and try again.",
        },
      ]);
    } finally {
      clearInterval(typingInterval);
      setIsReplying(false);
    }
  };

  return (
    <StepPageShell
      title="Chat With Amigo"
      contentClassName="overflow-hidden pb-6"
    >
      <FeatureShowcaseCard
        badge="Assistant Live"
        title="A calmer chat space built around quick momentum"
        description="Amigo is ready to help you brainstorm, organize, or explain something fast."
        imageSrc="/icons/robot-slider-img3.png"
        imageAlt="Chat companion"
        className="mb-5"
        compact
      />

      <div className="theme-card-muted mb-4 rounded-[22px] border px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7E8A83]">
              Available Credits
            </p>
            <p className="mt-2 text-[24px] font-semibold leading-8 text-[#0F0F0F]">
              {isBalanceLoading
                ? "Loading..."
                : creditBalance === null
                  ? "Unavailable"
                  : formatCreditAmount(creditBalance)}
            </p>
          </div>
          <div className="rounded-full bg-[#E8FFF1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00A84D]">
            Live
          </div>
        </div>
        <p className="mt-3 font-satoshi text-[14px] leading-6 text-[#555]">
          Amigo now reads this balance before each chat and stores each finished
          reply back into your conversation history.
        </p>
      </div>

      {purchasePromptMessage || isCreditDepleted ? (
        <div className="mb-4 rounded-[24px] border border-[#FFD9B8] bg-[linear-gradient(135deg,#FFF5EA_0%,#FFFFFF_100%)] px-4 py-4 shadow-[0_12px_30px_rgba(15,15,15,0.04)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C56B1F]">
            Purchase Required
          </p>
          <h2 className="mt-2 text-[20px] font-semibold leading-7 text-[#0F0F0F]">
            Your credits are used up
          </h2>
          <p className="mt-2 font-satoshi text-[14px] leading-6 text-[#5F4A33]">
            {purchasePromptMessage || CREDIT_LIMIT_MESSAGE}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(PURCHASE_PLAN_PATH)}
              className="rounded-full bg-[#0F0F0F] px-4 py-2.5 text-[14px] font-semibold text-white"
            >
              View Plans
            </button>
            <button
              type="button"
              onClick={() => loadCreditBalance()}
              className="theme-surface rounded-full px-4 py-2.5 text-[14px] font-semibold text-[#0F0F0F] shadow-[0_10px_24px_rgba(15,15,15,0.05)]"
            >
              Refresh Balance
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={isReplying || isCreditDepleted}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
              isReplying || isCreditDepleted
                ? "bg-[#EDF2EE] text-[#93A099]"
                : "bg-[#F4F7F5] text-[#0F0F0F] hover:bg-[#E8FFF1]"
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-[28px] bg-[#F8FFFB] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7E8A83]">
            {requestedChatId ? activeChatTitle : "Starting a new conversation"}
          </p>
          {isConversationLoading ? (
            <span className="text-[12px] font-medium text-[#7E8A83]">
              Loading history...
            </span>
          ) : null}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {isConversationLoading ? (
            <div className="theme-surface rounded-[22px] px-4 py-4 shadow-[0_10px_24px_rgba(15,15,15,0.05)]">
              <p className="font-satoshi text-[14px] leading-6 text-[#555]">
                Loading your saved conversation...
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[22px] px-4 py-3 ${
                    message.role === "user"
                      ? "rounded-br-[8px] bg-[#00D061] text-white"
                      : "theme-surface rounded-bl-[8px] text-[#0F0F0F] shadow-[0_10px_24px_rgba(15,15,15,0.05)]"
                  }`}
                >
                  <div className="font-satoshi text-[15px] leading-6 whitespace-pre-wrap">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}

          {isReplying ? (
            <div className="flex justify-start">
              <div className="theme-surface rounded-[22px] rounded-bl-[8px] px-4 py-3 shadow-[0_10px_24px_rgba(15,15,15,0.05)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00D061] animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-[#00D061] animate-bounce [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-[#00D061] animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="theme-surface mt-4 rounded-[24px] p-3 shadow-[0_12px_30px_rgba(15,15,15,0.06)]">
          <textarea
            rows={3}
            value={composer}
            disabled={isReplying || isCreditDepleted}
            onChange={(event) => setComposer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(composer);
              }
            }}
            placeholder={
              isCreditDepleted
                ? "Purchase a plan or refresh your balance to keep chatting."
                : "Ask Amigo anything..."
            }
            className="theme-input-surface w-full resize-none rounded-[18px] px-4 py-4 font-satoshi text-[15px] leading-6 outline-none disabled:cursor-not-allowed disabled:bg-[#F1F5F2] disabled:text-[#7E8A83]"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="font-satoshi text-[13px] leading-5 text-[#555]">
              {isCreditDepleted
                ? "Purchase a plan to unlock more Amigo chats."
                : "Powered by Santum AI Counseling service."}
            </p>
            <button
              type="button"
              onClick={() => sendMessage(composer)}
              disabled={!composer.trim() || isReplying || isCreditDepleted}
              className={`rounded-full px-5 py-3 text-[14px] font-semibold transition-all ${
                !composer.trim() || isReplying || isCreditDepleted
                  ? "bg-[#CBEEDB] text-white"
                  : "bg-[#00D061] text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </StepPageShell>
  );
}