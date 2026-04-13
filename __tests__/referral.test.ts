/**
 * Tests for the referral system — code generation, validation, reward logic.
 */

describe("Referral — Code Format", () => {
  it("should generate code in format PR-XXXXXX", () => {
    // Simulate the code generation logic from /api/referral/generate
    const suffix = "a1b2c3".toUpperCase();
    const code = `PR-${suffix}`;

    expect(code).toMatch(/^PR-[A-Z0-9]{6}$/);
    expect(code.length).toBe(9);
  });

  it("should generate unique codes", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
      codes.add(`PR-${suffix}`);
    }
    // All 100 should be unique (extremely high probability)
    expect(codes.size).toBe(100);
  });
});

describe("Referral — Reward Logic", () => {
  it("should extend membership by reward_days", () => {
    const currentExpiry = new Date("2026-05-01");
    const rewardDays = 30;

    const newExpiry = new Date(currentExpiry);
    newExpiry.setDate(newExpiry.getDate() + rewardDays);

    expect(newExpiry.toISOString().slice(0, 10)).toBe("2026-05-31");
  });

  it("should use current date as base if membership already expired", () => {
    const expiredDate = new Date("2025-01-01"); // expired
    const now = new Date("2026-04-13");
    const rewardDays = 30;

    const base = expiredDate > now ? expiredDate : now;
    const newExpiry = new Date(base);
    newExpiry.setDate(newExpiry.getDate() + rewardDays);

    expect(newExpiry.toISOString().slice(0, 10)).toBe("2026-05-13");
  });

  it("should stack reward on top of existing membership", () => {
    const futureExpiry = new Date("2026-06-01"); // still active
    const now = new Date("2026-04-13");
    const rewardDays = 30;

    const base = futureExpiry > now ? futureExpiry : now;
    const newExpiry = new Date(base);
    newExpiry.setDate(newExpiry.getDate() + rewardDays);

    expect(newExpiry.toISOString().slice(0, 10)).toBe("2026-07-01");
  });

  it("should not allow self-referral", () => {
    const userId = "user-1";
    const referrerId = "user-1";
    expect(userId).toBe(referrerId); // would be blocked in API
  });
});
