/**
 * Tests for the new-member LINE bonus (7 days free premium) and expiry-aware
 * paid check.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/db/queries-credits", () => ({}));

import { computeBonusExpiry, isNewMember } from "./line-bonus";
import { isPaidMember } from "./credits-gate";

const NOW = new Date("2026-09-24T12:00:00Z");

describe("LINE bonus — new member window", () => {
  it("accepts accounts created within 7 days", () => {
    expect(isNewMember("2026-09-24 11:00:00", NOW)).toBe(true);
    expect(isNewMember("2026-09-17 12:00:00", NOW)).toBe(true);
  });

  it("rejects older or unparseable accounts", () => {
    expect(isNewMember("2026-09-17 11:59:59", NOW)).toBe(false);
    expect(isNewMember("garbage", NOW)).toBe(false);
  });
});

describe("LINE bonus — expiry", () => {
  it("starts from now for free / lapsed members", () => {
    expect(computeBonusExpiry(null, NOW).toISOString()).toBe("2026-10-01T12:00:00.000Z");
    expect(computeBonusExpiry("2026-01-01T00:00:00.000Z", NOW).toISOString()).toBe(
      "2026-10-01T12:00:00.000Z"
    );
  });

  it("extends an active membership", () => {
    expect(computeBonusExpiry("2026-10-10T00:00:00.000Z", NOW).toISOString()).toBe(
      "2026-10-17T00:00:00.000Z"
    );
  });
});

describe("isPaidMember — expiry", () => {
  it("treats free as unpaid", () => {
    expect(isPaidMember("free", "2099-01-01T00:00:00.000Z")).toBe(false);
  });

  it("treats paid with no or future expiry as paid", () => {
    expect(isPaidMember("monthly")).toBe(true);
    expect(isPaidMember("yearly", null)).toBe(true);
    expect(isPaidMember("monthly", "2099-01-01T00:00:00.000Z")).toBe(true);
  });

  it("treats a lapsed membership as unpaid", () => {
    expect(isPaidMember("monthly", "2020-01-01T00:00:00.000Z")).toBe(false);
  });
});
