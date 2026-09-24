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
  lineQuotaReserve,
  verifyLineSignature,
} from "./line";

describe("lineQuotaReserve", () => {
  it("uses 5% on a large plan", () => {
    expect(lineQuotaReserve(15000)).toBe(750);
  });

  it("applies the 300 floor on a mid-size plan", () => {
    expect(lineQuotaReserve(5000)).toBe(300);
  });

  it("caps the floor at 20% on a small plan so bulk sends aren't blocked outright", () => {
    // Free OA plan: reserving all 300 would throttle every bulk send forever.
    expect(lineQuotaReserve(300)).toBe(60);
    expect(lineQuotaReserve(1000)).toBe(200);
  });
});

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
    const limit = 15000;
    const usedAtEdge = limit - lineQuotaReserve(limit);

    expect(computeLineQuotaStatus(limit, usedAtEdge - 1).throttled).toBe(false);
    expect(computeLineQuotaStatus(limit, usedAtEdge).throttled).toBe(true);
  });

  it("lets a fresh free plan send in bulk", () => {
    expect(computeLineQuotaStatus(300, 0).throttled).toBe(false);
    expect(computeLineQuotaStatus(300, 239).throttled).toBe(false);
    expect(computeLineQuotaStatus(300, 240).throttled).toBe(true);
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
