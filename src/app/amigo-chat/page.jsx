"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { appFetch } from "@/lib/api/internal";
import { extractCreditBalance, formatCreditAmount } from "@/lib/utills/credit";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    text: "Hi, I’m Amigo. I can help you brainstorm, organize, or explain something fast.",
  },
  {
    id: 2,
    role: "user",
    text: "I want a cleaner routine for work and study this week.",
  },
  {
    id: 3,
    role: "assistant",
    text: "Great. We can build a light plan with focus blocks, recovery time, and a realistic nightly reset.",
  },
];

async function requestCreditBalance() {
  return appFetch("/api/credit/balance", {
    cache: "no-store",
  });
}

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

export default function AmigoChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [composer, setComposer] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [creditBalance, setCreditBalance] = useState(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [purchasePromptMessage, setPurchasePromptMessage] = useState("");
  const nextMessageId = useRef(INITIAL_MESSAGES.length + 1);
  const isCreditDepleted = creditBalance !== null && creditBalance <= 0;

  const createMessage = (role, text) => ({
    id: nextMessageId.current++,
    role,
    text,
  });

  const loadCreditBalance = async ({ silent = false } = {}) => {
    try {
      const response = await requestCreditBalance();

      setCreditBalance(extractCreditBalance(response));
    } catch (error) {
      if (error?.status === 401) {
        router.replace("/sign-in");
        return;
      }

      if (!silent) {
        toast.error(error.message || "Unable to load credit balance");
      }
    } finally {
      setIsBalanceLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initialLoadCreditBalance() {
      try {
        const response = await requestCreditBalance();

        if (!isMounted) {
          return;
        }

        setCreditBalance(extractCreditBalance(response));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error?.status === 401) {
          router.replace("/sign-in");
          return;
        }

        toast.error(error.message || "Unable to load credit balance");
      } finally {
        if (isMounted) {
          setIsBalanceLoading(false);
        }
      }
    }

    initialLoadCreditBalance();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (isCreditDepleted) {
      setPurchasePromptMessage((currentMessage) =>
        currentMessage || CREDIT_LIMIT_MESSAGE,
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

    const userMessage = createMessage("user", text);
    const history = messages.map((msg) => ({
      role: msg.role === "user" ? "human" : "ai",
      content: msg.text,
    }));

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setComposer("");
    setIsReplying(true);

    let typingInterval;

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chat_history: history,
          plan_level: "premium",
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
      const assistantMessage = createMessage("assistant", "");

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);

      let accumulatedText = "";
      let displayedText = "";
      let isStreamDone = false;

      // Start the typing animation loop
      typingInterval = setInterval(() => {
        if (displayedText.length < accumulatedText.length) {
          // Find the next word or character to add
          // We can add one character at a time for smoothness,
          // or chunks of characters if we are falling too far behind.
          const diff = accumulatedText.length - displayedText.length;
          const increment = diff > 50 ? 10 : diff > 20 ? 5 : 2; // Speed up if lagging

          displayedText = accumulatedText.substring(0, displayedText.length + increment);

          setMessages((currentMessages) => {
            const newMessages = [...currentMessages];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex]?.role === "assistant") {
              newMessages[lastIndex] = { ...newMessages[lastIndex], text: displayedText };
            }
            return newMessages;
          });
        } else if (isStreamDone) {
          clearInterval(typingInterval);
        }
      }, 30); // 30ms for smooth character/word flow

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
    } catch (error) {
      console.error("Chat error:", error);

      if (isCreditLimitError(error)) {
        setMessages((currentMessages) =>
          currentMessages.filter((message) => message.id !== userMessage.id),
        );
        await promptPlanPurchase(getCreditLimitMessage(error), text);
        return;
      }

      toast.error(error.message || "Unable to connect to Amigo");
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          "Sorry, I'm having trouble connecting to Amigo right now. Please check your connection and try again.",
        ),
      ]);
    } finally {
      clearInterval(typingInterval);
      setIsReplying(false);
    }
  };

  return (
    <StepPageShell title="Chat With Amigo" contentClassName="overflow-hidden pb-6">
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
          Amigo now reads this balance before each chat and deducts usage from
          the AI response metadata after the reply completes.
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
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.map((message) => (
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
                <p className="font-satoshi text-[15px] leading-6 whitespace-pre-wrap">
                  {message.text}
                </p>
              </div>
            </div>
          ))}

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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
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
              disabled={
                !composer.trim() ||
                isReplying ||
                isCreditDepleted
              }
              className={`rounded-full px-5 py-3 text-[14px] font-semibold transition-all ${
                !composer.trim() ||
                isReplying ||
                isCreditDepleted
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
