import BillingSectionClient from "./BillingSectionClient";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Billing",
  description:
    "Review your Santum AI plan, subscription status, billing amount, invoices, and payment history.",
  path: "/billing-section",
});

export default function BillingSectionPage() {
  return <BillingSectionClient />;
}
