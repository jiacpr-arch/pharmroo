/**
 * Tests for lib/line.ts — quota math (pure) and signature verification.
 */
import { createHmac } from "crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/email/resend", () => ({
  getResend: () => ({ emails: { send: vi.fn() } }),
  fromEmail: "test@example.com",
}));

import {
  computeLineQuotaStatus,
  LINE_QUOTA_RESERVE_MIN,
  LINE_QUOTA_RESERVE_FRACTION,
  verifyLineSignature,
} from "./line";

describe("computeLineQuotaStatus", () => {
  it("never throttles an unlimited or unknown plan", () => {
    expect(computeLineQuotaStatus(null, null)).toEqual({
      limit: null,
      used: null,
      remaining: null,
      throttled: false,
    });
  });

  it("throttles once remaining drops to the reserve", () => {
    const limit = 1000;
    const reserve = Math.max(LINE_QUOTA_RESERVE_MIN, Math.ceil(limit * LINE_QUOTA_RESERVE_FRACTION));
    const usedAtEdge = limit - reserve;

    expect(computeLineQuotaStatus(limit, usedAtEdge - 1).throttled).toBe(false);
    expect(computeLineQuotaStatus(limit, usedAtEdge).throttled).toBe(true);
  });

  it("applies the minimum reserve floor on a small quota", () => {
    // 5% of 1000 = 50, below LINE_QUOTA_RESERVE_MIN (300) — the floor wins.
    const status = computeLineQuotaStatus(1000, 1000 - LINE_QUOTA_RESERVE_MIN);
    expect(status.throttled).toBe(true);
  });
});

describe("verifyLineSignature", () => {
  const SECRET = "test-channel-secret";
  const originalSecret = process.env.LINE_CHANNEL_SECRET;

  function computeSignature(body: string, secret: string): string {
    return createHmac("SHA256", secret).update(body).digest("base64");
  }

  beforeAll(() => {
    process.env.LINE_CHANNEL_SECRET = SECRET;
  });

  afterAll(() => {
    process.env.LINE_CHANNEL_SECRET = originalSecret;
  });

  it("accepts a valid signature", () => {
    const body = JSON.stringify({ events: [] });
    expect(verifyLineSignature(body, computeSignature(body, SECRET))).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = JSON.stringify({ events: [] });
    const sig = computeSignature(body, SECRET);
    const tampered = JSON.stringify({ events: [{ type: "hack" }] });
    expect(verifyLineSignature(tampered, sig)).toBe(false);
  });

  it("rejects a signature computed with the wrong secret", () => {
    const body = JSON.stringify({ events: [] });
    expect(verifyLineSignature(body, computeSignature(body, "wrong-secret"))).toBe(false);
  });

  it("rejects malformed base64 without throwing", () => {
    expect(verifyLineSignature("{}", "not-valid-base64!!")).toBe(false);
  });
});
