import { Suspense } from "react";
import BuyPlanClient from "./BuyPlanClient";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Buy Santum AI plan",
  description:
    "Choose a Santum AI plan for private text-based emotional wellbeing support.",
  path: "/buy-plan",
});

export default function BuyPlanPage() {
  return (
    <Suspense fallback={null}>
      <BuyPlanClient />
    </Suspense>
  );
}
