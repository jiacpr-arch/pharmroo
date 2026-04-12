# Stripe + FlowAccount Self-Healing Checkout Blueprint

## Architecture — 3-Path Defense-in-Depth

```
                    Stripe ตัดเงิน
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    1. Webhook      2. Success Page   3. Daily Cron
    (primary)       (fallback)        (safety net)
         │               │               │
         └───────┬───────┘               │
                 ▼                       ▼
         fulfillCheckoutSession()  ←── same idempotent helper
         (keyed on stripe_session_id)
```

All 3 paths call the same `fulfillCheckoutSession()` — idempotent keyed on `payment_orders.stripe_session_id`.

## Key Design Principles

1. **Idempotent Fulfillment** — keyed on stripe_session_id
2. **Webhook Always Returns 200** — processing errors logged, not propagated
3. **`after()` for Side Effects** — LINE, email, FlowAccount run after response
4. **Lazy Stripe Init** — never instantiate at module top-level
5. **Separate DB Writes from Notifications** — critical inline, non-critical in after()
