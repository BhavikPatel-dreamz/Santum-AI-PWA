"use client";

import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import { useGetBillingOrdersQuery } from "@/lib/store";
import {
  CalendarClock,
  CreditCard,
  Download,
  FileText,
  History,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";

const logoUrl = "/web-app-manifest-192x192.png";
const ORDER_STATUS_LABELS = {
  success: "Active",
  pending: "Pending",
  cancelled: "Cancelled",
  canceled: "Cancelled",
  failed: "Failed",
};

async function loadImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = reject;
    img.src = url;
  });
}

function normalizeText(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function normalizeStatus(value) {
  return normalizeText(value).toLowerCase();
}

function parseAmount(value) {
  const parsed = Number(normalizeText(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseOrderDate(value) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  const date = new Date(normalizedValue.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value, fallback = "Not available") {
  const date = value instanceof Date ? value : parseOrderDate(value);

  if (!date) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(value) {
  const amount = parseAmount(value);
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatStatus(value) {
  const status = normalizeStatus(value);

  if (ORDER_STATUS_LABELS[status]) {
    return ORDER_STATUS_LABELS[status];
  }

  return status
    ? status
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
      .join(" ")
    : "Unknown";
}

function getStatusClasses(value) {
  const status = normalizeStatus(value);

  if (status === "success") {
    return "bg-[#E8FFF1] text-[#00A84D]";
  }

  if (status === "pending") {
    return "bg-[#FFF3E9] text-[#D46B08]";
  }

  if (status === "cancelled" || status === "canceled" || status === "failed") {
    return "bg-[#FFF7F7] text-[#D92D20]";
  }

  return "theme-surface-secondary theme-text-secondary";
}

function getPlanName(order) {
  return (
    normalizeText(order?.membership_title) ||
    normalizeText(order?.membership_name) ||
    "No active plan"
  );
}

function getPaymentMethod(order) {
  const cardType = normalizeText(order?.cardtype);
  const accountNumber = normalizeText(order?.accountnumber);
  const gateway = normalizeText(order?.gateway);
  const environment = normalizeText(order?.gateway_environment);

  if (cardType || accountNumber) {
    return [cardType || "Card", accountNumber ? `ending ${accountNumber}` : ""]
      .filter(Boolean)
      .join(" ");
  }

  return [gateway || "Payment gateway", environment ? `(${environment})` : ""]
    .filter(Boolean)
    .join(" ");
}

function addOneMonth(date) {
  if (!(date instanceof Date)) {
    return null;
  }

  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return nextDate;
}

function sortOrdersByDate(orders) {
  return [...orders].sort((left, right) => {
    const leftTime = parseOrderDate(left?.timestamp)?.getTime() ?? 0;
    const rightTime = parseOrderDate(right?.timestamp)?.getTime() ?? 0;
    return rightTime - leftTime;
  });
}

function addPdfRow(doc, label, value, y, options = {}) {
  const left = options.left ?? 20;
  const right = options.right ?? 190;
  const labelWidth = options.labelWidth ?? 52;
  const isStrong = options.strong === true;

  doc.setFont("helvetica", isStrong ? "bold" : "normal");
  doc.setFontSize(options.fontSize ?? 10);
  doc.setTextColor(options.labelColor ?? 92, options.labelColor ?? 92, options.labelColor ?? 92);
  doc.text(label, left, y);
  doc.setTextColor(options.valueColor ?? 20, options.valueColor ?? 20, options.valueColor ?? 20);
  doc.text(String(value || "N/A"), left + labelWidth, y, {
    maxWidth: right - left - labelWidth,
  });
}

function addPdfSectionTitle(doc, title, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 15, 15);
  doc.text(title, 20, y);
  doc.setDrawColor(232, 255, 241);
  doc.setLineWidth(0.8);
  doc.line(20, y + 4, 190, y + 4);
}

async function downloadInvoice(order) {
  const fileCode = normalizeText(order?.code) || normalizeText(order?.id) || "order";
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFillColor(50, 61, 81);
  doc.rect(0, 0, 210, 42, "F");

  // Add logo
  const logo = await loadImageAsBase64(logoUrl); // Change to your logo path

  doc.addImage(logo, "PNG", 20, 11, 14, 14);

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Santum AI", 40, 20);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Johannesburg, South Africa", 40, 27);

  doc.setFillColor(248, 255, 251);
  doc.roundedRect(20, 54, 170, 34, 4, 4, "F");
  doc.setDrawColor(214, 245, 228);
  doc.roundedRect(20, 54, 170, 34, 4, 4, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 15, 15);
  doc.text(`Invoice No.${fileCode}`, 28, 66);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(85, 85, 85);
  doc.text(`Issued ${formatDate(order?.timestamp)}`, 28, 74);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 168, 77);
  doc.text(formatStatus(order?.status), 160, 66, { align: "right" });

  addPdfSectionTitle(doc, "Plan details", 105);
  addPdfRow(doc, "Plan", getPlanName(order), 119);
  addPdfRow(doc, "Payment method", `Bank card - ${getPaymentMethod(order)}`, 129);
  addPdfRow(
    doc,
    "Transaction ID",
    normalizeText(order?.payment_transaction_id) || "N/A",
    139,
  );
  addPdfRow(doc, "Facilitator", `${normalizeText(order?.gateway)} by Network` || "N/A", 149);

  addPdfSectionTitle(doc, "Amount", 170);
  addPdfRow(doc, "Subtotal", formatAmount(order?.subtotal), 184);

  doc.setFillColor(232, 255, 241);
  doc.roundedRect(20, 205, 170, 18, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 15, 15);
  doc.text("Total paid", 28, 216);
  doc.setTextColor(0, 168, 77);
  doc.text(formatAmount(order?.total), 182, 216, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(126, 138, 131);
  doc.text(
    "Generated from your Santum AI billing history.",
    20,
    276,
  );

  doc.save(`santum-ai-invoice-${fileCode}.pdf`);
}

function SummaryCard({ icon: Icon, label, value, caption }) {
  return (
    <div className="theme-card-muted rounded-[22px] border px-4 py-4">
      <div className="flex items-start gap-3">
        <span className="theme-pill flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#00A84D]">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="theme-text-secondary font-satoshi text-[13px] leading-5">
            {label}
          </p>
          <p className="theme-text-primary mt-1 break-words text-[17px] font-semibold leading-6">
            {value}
          </p>
          {caption ? (
            <p className="theme-text-muted mt-1 font-satoshi text-[12px] leading-5">
              {caption}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="theme-card rounded-[24px] border px-5 py-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8FFF1] text-[#00A84D]">
        <ReceiptText size={24} />
      </div>
      <h3 className="theme-text-primary mt-4 text-[18px] font-semibold leading-7">
        No billing records yet
      </h3>
      <p className="theme-text-secondary mt-2 font-satoshi text-[14px] leading-6">
        Your plan purchases and invoices will appear here once transactions
        are available.
      </p>
    </div>
  );
}

export default function BillingSectionClient() {
  const router = useRouter();
  const {
    data: billingData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetBillingOrdersQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
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

    toast.error(getClientErrorMessage(error, "Unable to load billing details"));
  }, [error, router]);

  const orders = useMemo(
    () =>
      sortOrdersByDate(
        Array.isArray(billingData?.orders) ? billingData.orders : [],
      ),
    [billingData],
  );
  const activeOrder =
    orders.find((order) => normalizeStatus(order?.status) === "success") ??
    orders[0] ??
    null;
  const latestOrder = orders[0] ?? null;
  const activeOrderDate = parseOrderDate(activeOrder?.timestamp);
  const nextBillingDate = addOneMonth(activeOrderDate);
  const monthlyAmountSource = activeOrder ?? latestOrder;
  const successfulPaymentCount = orders.filter(
    (order) => normalizeStatus(order?.status) === "success",
  ).length;

  return (
    <StepPageShell title="Billing" contentClassName="overflow-y-auto pb-24">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="theme-text-primary text-[22px] font-semibold leading-7">
            Billing overview
          </h2>
          <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
            Plan, renewal, payments, invoices, and saved payment details.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8FFF1] text-[#00A84D] transition-opacity disabled:opacity-60"
          aria-label="Refresh billing details"
          title="Refresh billing details"
        >
          <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {isLoading ? (
        <div className="theme-card rounded-[24px] border px-5 py-8 text-center">
          <p className="theme-text-primary text-[16px] font-semibold">
            Loading billing details...
          </p>
          <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
            Please wait a moment.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SummaryCard
              icon={ShieldCheck}
              label="Current plan"
              value={getPlanName(activeOrder)}
            />
            <div className="theme-card-muted rounded-[22px] border px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="theme-pill flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#00A84D]">
                  <WalletCards size={18} />
                </span>
                <div>
                  <p className="theme-text-secondary font-satoshi text-[13px] leading-5">
                    Subscription status
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusClasses(
                      activeOrder?.status,
                    )}`}
                  >
                    {formatStatus(activeOrder?.status)}
                  </span>
                </div>
              </div>
            </div>
            <SummaryCard
              icon={CreditCard}
              label="Billing amount"
              value={formatAmount(monthlyAmountSource?.total)}
              caption="Billed monthly"
            />
            <SummaryCard
              icon={CalendarClock}
              label="Next billing date"
              value={formatDate(nextBillingDate)}
              caption={nextBillingDate ? "Estimated from last payment date" : ""}
            />
          </div>

          <div className="theme-card mt-5 rounded-[24px] border px-4 py-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="theme-pill flex h-10 w-10 items-center justify-center rounded-full text-[#00A84D]">
                <WalletCards size={18} />
              </span>
              <div>
                <h3 className="theme-text-primary text-[18px] font-semibold leading-6">
                  Payment method details
                </h3>
                <p className="theme-text-secondary font-satoshi text-[13px] leading-5">
                  Bank card - {getPaymentMethod(activeOrder)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="theme-static-panel rounded-[18px] border px-3 py-3">
                <p className="theme-text-muted text-[12px] leading-5">Facilitator</p>
                <p className="theme-text-primary mt-1 text-[15px] font-semibold capitalize">
                  {normalizeText(activeOrder?.gateway) + " by Network" || "Not available"}
                </p>
              </div>
              <div className="theme-static-panel rounded-[18px] border px-3 py-3">
                <p className="theme-text-muted text-[12px] leading-5">
                  Transaction
                </p>
                <p className="theme-text-primary mt-1 truncate text-[15px] font-semibold">
                  {normalizeText(activeOrder?.payment_transaction_id) || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="theme-text-primary text-[20px] font-semibold leading-7">
                  Payment history
                </h3>
                <p className="theme-text-secondary font-satoshi text-[14px] leading-6">
                  {successfulPaymentCount} successful payment
                  {successfulPaymentCount === 1 ? "" : "s"} recorded.
                </p>
              </div>
              <History size={20} className="shrink-0 text-[#00A84D]" />
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <article
                  key={normalizeText(order.id) || normalizeText(order.code)}
                  className="theme-card rounded-[22px] border px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="theme-text-primary text-[16px] font-semibold leading-6">
                          {getPlanName(order)}
                        </h4>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                            order.status,
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </div>
                      <p className="theme-text-secondary mt-1 font-satoshi text-[13px] leading-5">
                        {formatDate(order.timestamp)} · Invoice No.
                        {normalizeText(order.code) || normalizeText(order.id)}
                      </p>
                    </div>
                    <p className="theme-text-primary shrink-0 text-[16px] font-semibold leading-6">
                      {formatAmount(order.total)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="theme-text-secondary flex min-w-0 items-center gap-2 font-satoshi text-[13px] leading-5">
                      <FileText size={15} className="shrink-0 text-[#00A84D]" />
                      <span className="truncate">
                        {normalizeText(order.payment_transaction_id) ||
                          "No transaction ID"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={async () => { await downloadInvoice(order) }}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8FFF1] text-[#00A84D] transition-opacity hover:opacity-85"
                      aria-label={`Download invoice ${normalizeText(order.code) || normalizeText(order.id)}`}
                      title="Download invoice"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </StepPageShell>
  );
}
