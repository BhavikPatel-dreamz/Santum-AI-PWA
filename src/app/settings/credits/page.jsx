"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import { useGetCreditBalanceQuery } from "@/lib/store";
import { extractCreditBalance, formatCreditAmount } from "@/lib/utills/credit";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

function formatSyncTime(date) {
  if (!date) {
    return "Not synced";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function CreditsSettingsPage() {
  const router = useRouter();
  const {
    data: balanceResponse,
    error,
    isLoading,
    isFetching,
    fulfilledTimeStamp,
    refetch,
  } = useGetCreditBalanceQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!error) {
      return;
    }

    if (isUnauthorizedError(error)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(getClientErrorMessage(error, "Unable to load credit balance"));
  }, [error, router]);

  const creditBalance = extractCreditBalance(balanceResponse);
  const lastUpdatedAt = fulfilledTimeStamp ? new Date(fulfilledTimeStamp) : null;
  const isBalanceLoading = isLoading || isFetching;

  const refreshBalance = async () => {
    try {
      await refetch().unwrap();
      toast.success("Credit balance refreshed");
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      toast.error(
        getClientErrorMessage(error, "Unable to refresh credit balance"),
      );
    }
  };

  return (
    <StepPageShell title="Credits" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Live Balance"
        title="Track the balance behind your Amigo support chats"
        description="Credits are read from the authenticated account API and used automatically whenever you chat with Amigo."
        imageSrc="/icons/plus-robort.png"
        imageAlt="Credit balance illustration"
        className="mb-6"
        compact
      />

      <div className="rounded-[28px] bg-[#0F0F0F] px-5 py-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Available balance
            </p>
            <h2 className="mt-3 text-[32px] font-semibold leading-10">
              {isBalanceLoading
                ? "Loading..."
                : creditBalance === null
                  ? "Unavailable"
                  : formatCreditAmount(creditBalance)}
            </h2>
            <p className="mt-3 max-w-[320px] font-satoshi text-[14px] leading-6 text-white/75">
              Live credit data is fetched through your signed-in session so the
              balance shown here matches your real account state.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshBalance}
            disabled={isBalanceLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Refresh credit balance"
          >
            <RefreshCcw
              size={18}
              className={isBalanceLoading ? "animate-spin" : ""}
            />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-[18px] bg-white/8 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Status
            </p>
            <p className="mt-2 text-[15px] font-semibold text-white">
              {creditBalance === null && balanceResponse ? "Review" : "Live"}
            </p>
          </div>
          <div className="rounded-[18px] bg-white/8 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Last sync
            </p>
            <p className="mt-2 text-[15px] font-semibold text-white">
              {formatSyncTime(lastUpdatedAt)}
            </p>
          </div>
          <div className="rounded-[18px] bg-white/8 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Source
            </p>
            <p className="mt-2 text-[15px] font-semibold text-white">api</p>
          </div>
        </div>
      </div>

      {balanceResponse && creditBalance === null ? (
        <div className="mt-4 rounded-[22px] border border-[#FFE9B6] bg-[#FFF8E6] px-4 py-4">
          <p className="text-[14px] font-medium leading-6 text-[#6D5200]">
            The balance request is connected, but the response did not expose a
            numeric balance field in one of the common keys this page checks.
          </p>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <div className="theme-card rounded-[24px] border px-5 py-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
            How credits work
          </p>
          <h3 className="mt-2 text-[22px] font-semibold leading-8 text-[#0F0F0F]">
            Chat spends credits automatically
          </h3>
          <p className="mt-3 font-satoshi text-[15px] leading-6 text-[#555]">
            Before a reply starts, Amigo reads your current balance. After the
            AI reply finishes, the app deducts usage from the token data
            returned by the AI service.
          </p>
          <p className="mt-3 font-satoshi text-[15px] leading-6 text-[#555]">
            Membership checkout happens on Santum.net. When you return to the
            PWA, this balance refreshes from the authenticated API.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push("/amigo-chat")}
            className="rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
          >
            Open Chat
          </button>
          <button
            type="button"
            onClick={() => router.push("/plus-subscription")}
            className="theme-secondary-button rounded-[14px] px-5 py-4 text-[16px] font-semibold"
          >
            View Plans
          </button>
        </div>
      </div>
    </StepPageShell>
  );
}
