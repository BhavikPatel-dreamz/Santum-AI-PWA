"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { useRef, useState } from "react";

const QUICK_PROMPTS = [
  "Plan my week in 5 steps",
  "Write a friendly pitch intro",
  "Turn notes into flashcards",
  "Summarize a long article",
];

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

export default function AmigoChatPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [composer, setComposer] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const nextMessageId = useRef(INITIAL_MESSAGES.length + 1);

  const createMessage = (role, text) => ({
    id: nextMessageId.current++,
    role,
    text,
  });

  const sendMessage = (nextMessage) => {
    const text = nextMessage.trim();

    if (!text || isReplying) {
      return;
    }

    const userMessage = createMessage("user", text);

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setComposer("");
    setIsReplying(true);

    setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          `Here is a polished dummy response for "${text}". I can turn this into a checklist, a summary, or a more detailed workflow next.`,
        ),
      ]);
      setIsReplying(false);
    }, 850);
  };

  return (
    <StepPageShell title="Chat With Amigo" contentClassName="overflow-hidden pb-6">
      <FeatureShowcaseCard
        badge="Assistant Ready"
        title="A calmer chat space built around quick momentum"
        description="This dummy conversation surface is ready for prompts, suggestions, and premium interactions."
        imageSrc="/icons/robot-slider-img3.png"
        imageAlt="Chat companion"
        className="mb-5"
        compact
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            className="rounded-full bg-[#F4F7F5] px-4 py-2 text-[13px] font-semibold text-[#0F0F0F] transition-all hover:bg-[#E8FFF1]"
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
                    : "rounded-bl-[8px] bg-white text-[#0F0F0F] shadow-[0_10px_24px_rgba(15,15,15,0.05)]"
                }`}
              >
                <p className="font-satoshi text-[15px] leading-6">
                  {message.text}
                </p>
              </div>
            </div>
          ))}

          {isReplying ? (
            <div className="flex justify-start">
              <div className="rounded-[22px] rounded-bl-[8px] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,15,15,0.05)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00D061] animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-[#00D061] animate-bounce [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-[#00D061] animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-[24px] bg-white p-3 shadow-[0_12px_30px_rgba(15,15,15,0.06)]">
          <textarea
            rows={3}
            value={composer}
            onChange={(event) => setComposer(event.target.value)}
            placeholder="Ask Amigo anything..."
            className="w-full resize-none rounded-[18px] bg-[#F6FBF8] px-4 py-4 font-satoshi text-[15px] leading-6 text-[#0F0F0F] outline-none placeholder:text-[#8A968F]"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="font-satoshi text-[13px] leading-5 text-[#555]">
              Dummy chat for layout and experience testing.
            </p>
            <button
              type="button"
              onClick={() => sendMessage(composer)}
              disabled={!composer.trim() || isReplying}
              className={`rounded-full px-5 py-3 text-[14px] font-semibold transition-all ${
                !composer.trim() || isReplying
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
