export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { getCreditPacks, getUserCreditBalance } from "@/lib/db/queries-credits";
import CreditsClient from "./CreditsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เติมเครดิต",
  description: "เติมเครดิตเพื่อปลดล็อกเฉลยละเอียดของข้อสอบทีละข้อ",
};

export default async function CreditsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;

  const [packs, balance] = await Promise.all([
    getCreditPacks(),
    userId ? getUserCreditBalance(userId) : Promise.resolve(0),
  ]);

  return (
    <CreditsClient
      packs={packs.map((p) => ({
        id: p.id,
        name_th: p.name_th,
        amount_credits: p.amount_credits,
        price: p.price,
      }))}
      balance={balance}
      loggedIn={!!userId}
    />
  );
}
