import { describe, it, expect } from "vitest";
import { verifyWebhookSignature, mapFieldData, rewardForForm } from "./facebook-leads";
import { createHmac } from "crypto";

describe("verifyWebhookSignature", () => {
  const APP_SECRET = "test-secret";

  beforeEach(() => {
    process.env.FACEBOOK_APP_SECRET = APP_SECRET;
  });

  function sign(body: string): string {
    return "sha256=" + createHmac("sha256", APP_SECRET).update(body).digest("hex");
  }

  it("accepts a valid signature", () => {
    const body = '{"test":true}';
    expect(verifyWebhookSignature(body, sign(body))).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = '{"test":true}';
    const tamperedBody = '{"test":false}';
    expect(verifyWebhookSignature(tamperedBody, sign(body))).toBe(false);
  });

  it("rejects missing algo prefix", () => {
    const body = '{"test":true}';
    const hexOnly = createHmac("sha256", APP_SECRET).update(body).digest("hex");
    expect(verifyWebhookSignature(body, hexOnly)).toBe(false);
  });
});

describe("mapFieldData", () => {
  it("maps English field names", () => {
    const result = mapFieldData([
      { name: "email", values: ["test@example.com"] },
      { name: "full_name", values: ["John Doe"] },
      { name: "phone_number", values: ["0812345678"] },
    ]);
    expect(result.email).toBe("test@example.com");
    expect(result.name).toBe("John Doe");
    expect(result.phone).toBe("0812345678");
  });

  it("maps Thai alias fields", () => {
    const result = mapFieldData([
      { name: "อีเมล", values: ["thai@example.com"] },
      { name: "ชื่อ", values: ["สมชาย ใจดี"] },
      { name: "เบอร์โทร", values: ["0898765432"] },
      { name: "ชั้นปี", values: ["5"] },
    ]);
    expect(result.email).toBe("thai@example.com");
    expect(result.name).toBe("สมชาย ใจดี");
    expect(result.phone).toBe("0898765432");
    expect(result.status_year).toBe("5");
  });

  it("skips unknown fields", () => {
    const result = mapFieldData([{ name: "unknown_field", values: ["x"] }]);
    expect(Object.keys(result)).toHaveLength(0);
  });
});

describe("rewardForForm", () => {
  it("returns mapped reward for known form", () => {
    process.env.FACEBOOK_LEAD_FORM_REWARDS = "form123=monthly_1m,form456=bundle_10q";
    expect(rewardForForm("form456")).toBe("bundle_10q");
  });

  it("defaults to monthly_1m for unknown form", () => {
    process.env.FACEBOOK_LEAD_FORM_REWARDS = "form123=monthly_1m";
    expect(rewardForForm("unknown")).toBe("monthly_1m");
  });
});
