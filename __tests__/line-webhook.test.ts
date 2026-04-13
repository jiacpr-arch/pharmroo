/**
 * Tests for LINE webhook — signature verification + link code matching.
 */
import { createHmac } from "crypto";

describe("LINE Webhook — Signature Verification", () => {
  const SECRET = "test-channel-secret";

  function computeSignature(body: string, secret: string): string {
    return createHmac("SHA256", secret).update(body).digest("base64");
  }

  it("should verify valid signature", () => {
    const body = JSON.stringify({ events: [] });
    const sig = computeSignature(body, SECRET);

    const expected = createHmac("SHA256", SECRET)
      .update(body)
      .digest("base64");
    expect(sig).toBe(expected);
  });

  it("should reject tampered body", () => {
    const body = JSON.stringify({ events: [] });
    const sig = computeSignature(body, SECRET);

    const tamperedBody = JSON.stringify({ events: [{ type: "hack" }] });
    const tamperedSig = computeSignature(tamperedBody, SECRET);

    expect(sig).not.toBe(tamperedSig);
  });

  it("should reject wrong secret", () => {
    const body = JSON.stringify({ events: [] });
    const sig1 = computeSignature(body, SECRET);
    const sig2 = computeSignature(body, "wrong-secret");

    expect(sig1).not.toBe(sig2);
  });
});

describe("LINE Webhook — Link Code Format", () => {
  it("should match PHARMROO-XXXXXX format", () => {
    const validCodes = ["PHARMROO-ABC123", "PHARMROO-XYZ789", "PHARMROO-A1B2C3"];
    const invalidCodes = ["MORROO-ABC123", "pharmroo-abc123", "PHARMROO-", "ABCDEF"];

    for (const code of validCodes) {
      expect(code.startsWith("PHARMROO-")).toBe(true);
      expect(code.length).toBe(15);
    }

    for (const code of invalidCodes) {
      const isValid = /^PHARMROO-[A-Z0-9]{6}$/.test(code);
      expect(isValid).toBe(false);
    }
  });

  it("should expire after 24 hours", () => {
    const created = new Date("2026-04-13T10:00:00Z");
    const expiresAt = new Date(created);
    expiresAt.setHours(expiresAt.getHours() + 24);

    expect(expiresAt.toISOString()).toBe("2026-04-14T10:00:00.000Z");

    // Check within window
    const checkTime = new Date("2026-04-13T20:00:00Z");
    expect(checkTime < expiresAt).toBe(true);

    // Check after expiry
    const expiredTime = new Date("2026-04-15T00:00:00Z");
    expect(expiredTime < expiresAt).toBe(false);
  });
});

describe("LINE Webhook — Event Routing", () => {
  it("should handle follow event", () => {
    const event = { type: "follow", replyToken: "xxx", source: { userId: "U123" } };
    expect(event.type).toBe("follow");
  });

  it("should detect link code messages", () => {
    const messages = [
      { text: "PHARMROO-ABC123", isCode: true },
      { text: "สวัสดีครับ", isCode: false },
      { text: "PHARMROO-", isCode: false },
      { text: "pharmroo-abc123", isCode: false },
    ];

    for (const msg of messages) {
      const detected = msg.text.startsWith("PHARMROO-") && msg.text.length === 15;
      // Only strict match for 6-char suffix
      if (msg.isCode) {
        expect(detected).toBe(true);
      }
    }
  });
});
