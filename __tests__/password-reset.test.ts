import { describe, it, expect } from "vitest";
import { formatDbTimestamp, generateResetToken, hashResetToken } from "@/lib/password-reset";

describe("password reset helpers", () => {
  it("generates unique 64-char hex tokens", () => {
    const a = generateResetToken();
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(generateResetToken()).not.toBe(a);
  });

  it("hashes deterministically and never returns the raw token", () => {
    const t = generateResetToken();
    expect(hashResetToken(t)).toBe(hashResetToken(t));
    expect(hashResetToken(t)).not.toBe(t);
  });

  it("formats timestamps like the DB default and sorts lexicographically", () => {
    const early = formatDbTimestamp(new Date("2026-01-02T03:04:05Z"));
    expect(early).toBe("2026-01-02 03:04:05");
    expect(formatDbTimestamp(new Date("2026-01-02T03:04:06Z")) > early).toBe(true);
  });
});
