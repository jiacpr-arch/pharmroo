/**
 * Tests for the pure detectors in lib/bot-intent.ts — the DB-backed
 * handleEmailCapture/handleBotIntent are exercised via the webhook route.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/line-bonus", () => ({
  grantLineBonus: vi.fn(),
  lineBonusMessage: vi.fn(),
  LINE_BONUS_DAYS: 7,
}));

import { detectEmail, detectTrialIntent } from "./bot-intent";

describe("detectEmail", () => {
  it("matches a bare email address", () => {
    expect(detectEmail("student@example.com")).toBe("student@example.com");
    expect(detectEmail("  Student@Example.com  ")).toBe("student@example.com");
  });

  it("rejects text that merely contains an email", () => {
    expect(detectEmail("ติดต่อที่ student@example.com นะครับ")).toBeNull();
  });

  it("rejects non-email text", () => {
    expect(detectEmail("สวัสดีครับ")).toBeNull();
  });
});

describe("detectTrialIntent", () => {
  it("matches clear commercial intent", () => {
    expect(detectTrialIntent("อยากลองใช้ดูครับ")).toBe(true);
    expect(detectTrialIntent("สมัครยังไงครับ")).toBe(true);
    expect(detectTrialIntent("ราคาเท่าไหร่")).toBe(true);
    expect(detectTrialIntent("รายเดือนกี่บาท")).toBe(true);
  });

  it("does not match ordinary clinical questions", () => {
    expect(detectTrialIntent("ลองให้ยาอะไรก่อนดีครับ")).toBe(false);
    expect(detectTrialIntent("อาการปวดหัวเกิดจากอะไร")).toBe(false);
  });

  it("defers to email capture instead of double-handling", () => {
    expect(detectTrialIntent("student@example.com")).toBe(false);
  });

  it("ignores empty input", () => {
    expect(detectTrialIntent("   ")).toBe(false);
  });
});
