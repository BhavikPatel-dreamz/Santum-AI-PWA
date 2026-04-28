import { NextResponse } from "next/server";
import {
  apiFetchWithAuth,
  assertApiSuccess,
  createErrorResponse,
} from "../../../../lib/api/server";
import { clearAuthCookie, getAuthToken } from "../../../../lib/auth/session";
import {
  buildChatCreditReference,
  extractChatCreditDebit,
  extractCreditBalance,
} from "../../../../lib/utills/credit";

const STREAM_METADATA_SEPARATOR = "\n\n{";
const CREDIT_LIMIT_MESSAGE =
  "You have reached your chat credit limit. Purchase a plan to continue with Amigo.";

function createCreditLimitResponse(message = CREDIT_LIMIT_MESSAGE) {
  return NextResponse.json(
    {
      message,
      code: "CREDIT_LIMIT_REACHED",
      action: "purchase_plan",
      cta_href: "/plus-subscription",
      cta_label: "View Plans",
    },
    { status: 402 },
  );
}

function isCreditLimitError(error) {
  if (error?.status === 402) {
    return true;
  }

  const message = [
    error?.message,
    error?.data?.message,
    error?.data?.data?.message,
  ]
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

function createCreditNote(message) {
  if (typeof message !== "string" || !message.trim()) {
    return "Chat credit usage";
  }

  const trimmedMessage = message.trim().replace(/\s+/g, " ");
  return `Chat credit usage for: ${trimmedMessage.slice(0, 80)}`;
}

function parseChatMetadata(rawMetadata) {
  const trimmedMetadata = rawMetadata.trim();

  if (!trimmedMetadata) {
    return null;
  }

  const normalizedMetadata = trimmedMetadata.startsWith("data:")
    ? trimmedMetadata
        .split("\n")
        .map((line) => line.replace(/^data:\s*/, ""))
        .join("")
    : trimmedMetadata;

  const jsonStartIndex = normalizedMetadata.indexOf("{");
  const jsonEndIndex = normalizedMetadata.lastIndexOf("}");

  if (jsonStartIndex === -1 || jsonEndIndex === -1) {
    return null;
  }

  try {
    return JSON.parse(
      normalizedMetadata.slice(jsonStartIndex, jsonEndIndex + 1),
    );
  } catch {
    return null;
  }
}

async function loadCreditBalance() {
  const balanceResponse = assertApiSuccess(
    await apiFetchWithAuth("/v1/credit/balance", {
      method: "GET",
      cache: "no-store",
    }),
    "Unable to load credit balance",
  );

  const balance = extractCreditBalance(balanceResponse?.data ?? balanceResponse);

  if (!Number.isFinite(balance)) {
    throw { status: 502, message: "Credit balance is unavailable" };
  }

  return balance;
}

async function reduceCreditsAfterChat({ amount, message }) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }

  const payload = new FormData();
  payload.append("amount", String(amount));
  payload.append("reference_id", buildChatCreditReference());
  payload.append("note", createCreditNote(message));
  payload.append("source", "chat");

  await assertApiSuccess(
    await apiFetchWithAuth("/v1/credit/reduce", {
      method: "POST",
      body: payload,
    }),
    "Unable to reduce credit",
  );
}

export async function POST(req) {
  try {
    const token = await getAuthToken();
    const body = await req.json();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const availableBalance = await loadCreditBalance();
    const availableTokens = Math.max(Math.floor(availableBalance), 0);

    if (availableTokens <= 0) {
      return createCreditLimitResponse();
    }

    const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
    const aiRes = await fetch(`${aiApiUrl}/api/v1/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        remaining_tokens: availableTokens,
      }),
    });

    if (!aiRes.ok) {
      let errorData = {};
      try {
        errorData = await aiRes.json();
      } catch {
        errorData = {};
      }
      throw {
        status: aiRes.status,
        message: errorData?.message || "AI Chat API failed",
        data: errorData,
      };
    }

    if (!aiRes.body) {
      return NextResponse.json(
        { message: "Chat stream body is missing" },
        { status: 502 },
      );
    }

    const reader = aiRes.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    let textBuffer = "";
    let metadataBuffer = "";
    let isReadingMetadata = false;

    const transformedStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            const chunk = decoder.decode(value, { stream: true });

            if (isReadingMetadata) {
              metadataBuffer += chunk;
              continue;
            }

            textBuffer += chunk;
            const metadataIndex = textBuffer.indexOf(STREAM_METADATA_SEPARATOR);

            if (metadataIndex !== -1) {
              const textPortion = textBuffer.slice(0, metadataIndex);

              if (textPortion) {
                controller.enqueue(encoder.encode(textPortion));
              }

              isReadingMetadata = true;
              metadataBuffer += textBuffer.slice(metadataIndex + 2);
              textBuffer = "";
              continue;
            }

            if (textBuffer.length > 2) {
              const safeText = textBuffer.slice(0, -2);

              if (safeText) {
                controller.enqueue(encoder.encode(safeText));
              }

              textBuffer = textBuffer.slice(-2);
            }
          }

          const lastChunk = decoder.decode();

          if (lastChunk) {
            if (isReadingMetadata) {
              metadataBuffer += lastChunk;
            } else {
              textBuffer += lastChunk;
            }
          }

          if (!isReadingMetadata && textBuffer) {
            controller.enqueue(encoder.encode(textBuffer));
          }

          const metadata = parseChatMetadata(metadataBuffer);
          const debitAmount = extractChatCreditDebit(metadata, availableTokens);

          try {
            await reduceCreditsAfterChat({
              amount: debitAmount,
              message: body?.message,
            });
          } catch (creditError) {
            console.error("Unable to reduce chat credits:", creditError);
          }

          controller.close();
        } catch (streamError) {
          controller.error(streamError);
        } finally {
          reader.releaseLock();
        }
      },
      cancel(reason) {
        reader.cancel(reason).catch(() => {});
      },
    });

    return new Response(transformedStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error?.status === 401) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      return clearAuthCookie(response);
    }

    if (isCreditLimitError(error)) {
      return createCreditLimitResponse(
        error?.data?.message || error?.data?.data?.message || error?.message,
      );
    }

    return createErrorResponse(error, "AI Chat API failed");
  }
}
