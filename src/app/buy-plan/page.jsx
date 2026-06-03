import { Suspense } from "react";
import BuyPlanClient from "./BuyPlanClient";

export default function BuyPlanPage() {
  return (
    <Suspense fallback={null}>
      <BuyPlanClient />
    </Suspense>
  );
}
