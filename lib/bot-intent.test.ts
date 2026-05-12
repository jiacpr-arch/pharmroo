import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectEmail } from "./bot-intent";

// detectEmail — pure function, no DB needed
describe("detectEmail", () => {
  it("detects a bare email", () => {
    expect(detectEmail("user@example.com")).toBe("user@example.com");
  });

  it("ignores email with surrounding text", () => {
    expect(detectEmail("my email is user@example.com thanks")).toBeNull();
  });

  it("accepts simple email (regex is intentionally basic: ^\\w+@\\w+\\.\\w{2,}$)", () => {
    expect(detectEmail("user@pharmroo.com")).toBe("user@pharmroo.com");
  });

  it("ignores empty string", () => {
    expect(detectEmail("")).toBeNull();
  });

  it("ignores whitespace only", () => {
    expect(detectEmail("   ")).toBeNull();
  });
});

// Business rule: MAX_CODES_PER_LEAD = 3
describe("MAX_CODES_PER_LEAD constant", () => {
  it("is 3", async () => {
    const { MAX_CODES_PER_LEAD } = await import("./bot-intent");
    expect(MAX_CODES_PER_LEAD).toBe(3);
  });
});
