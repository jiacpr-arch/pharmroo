export const dynamic = "force-dynamic";

import { getQuestionSets } from "@/lib/db/queries-mcq";
import PricingClient from "@/app/pricing/PricingClient";

export default async function LiffPricingPage() {
  const sets = await getQuestionSets();
  const nursingSets = sets
    .filter((s) => s.exam_type === "NLE")
    .map((s) => ({
      id: s.id,
      name: s.name_th,
      price: s.price,
      highlight: s.is_bundle,
    }));
  return <PricingClient nursingSets={nursingSets} paymentBasePath="/liff/payment" />;
}
