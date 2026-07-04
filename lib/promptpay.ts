/**
 * PromptPay is opt-in: it must be activated in the Stripe dashboard
 * (Settings → Payment methods) BEFORE this flag is turned on, otherwise
 * Stripe rejects checkout-session creation and the whole payment flow fails.
 * NEXT_PUBLIC_ so both the checkout route and client UI read the same flag.
 */
export function promptpayEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_PROMPTPAY_ENABLED;
  return v === "1" || v === "true";
}
