import Stripe from "stripe";

function createStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" });
}

export { createStripe as stripe, createStripe };

export const STRIPE_PRICES = {
  monthly: {
    amount: 24900, // ฿249 in satang (Stripe uses smallest currency unit)
    name: "PharmRoo รายเดือน",
    period: "เดือน",
  },
  yearly: {
    amount: 149000, // ฿1,490
    name: "PharmRoo รายปี",
    period: "ปี",
  },
};
