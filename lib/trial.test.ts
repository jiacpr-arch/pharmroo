import { describe, expect, it, vi } from "vitest";
import { isTrialActive } from "@/lib/trial";

vi.mock("@/lib/db/queries-credits", () => ({
  getUserCreditBalance: vi.fn(),
  getUserUnlockedQuestionIds: vi.fn(),
}));

const NOW = new Date("2026-09-24T12:00:00.000Z");

describe("isTrialActive", () => {
  it("is false when no trial was claimed", () => {
    expect(isTrialActive(null, NOW)).toBe(false);
    expect(isTrialActive(undefined, NOW)).toBe(false);
  });

  it("is true before the trial ends and false after", () => {
    expect(isTrialActive("2026-09-25T00:00:00.000Z", NOW)).toBe(true);
    expect(isTrialActive("2026-09-24T11:59:59.000Z", NOW)).toBe(false);
  });

  it("is false for an unparseable date", () => {
    expect(isTrialActive("not-a-date", NOW)).toBe(false);
  });
});

describe("getViewerGate with the link-LINE trial", () => {
  it("treats an active trial as paid and an expired one as free", async () => {
    const { getViewerGate } = await import("@/lib/credits-gate");
    const future = new Date(Date.now() + 86_400_000).toISOString();
    const past = new Date(Date.now() - 86_400_000).toISOString();

    expect(
      getViewerGate({
        user: { id: "u1", membership_type: "free", line_trial_expires_at: future },
      }).isPaid
    ).toBe(true);
    expect(
      getViewerGate({
        user: { id: "u1", membership_type: "free", line_trial_expires_at: past },
      }).isPaid
    ).toBe(false);
    expect(
      getViewerGate({ user: { id: "u1", membership_type: "monthly" } }).isPaid
    ).toBe(true);
  });
});
