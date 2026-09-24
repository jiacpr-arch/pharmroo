import { afterEach, describe, expect, it } from "vitest";
import { liffDeepLink, resolveLiffNext, toLiffUri } from "./line-links";

const ORIGINAL_LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;
const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  process.env.NEXT_PUBLIC_LIFF_ID = ORIGINAL_LIFF_ID;
  process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL;
});

describe("liffDeepLink", () => {
  it("falls back to a plain site URL when no LIFF id is configured", () => {
    delete process.env.NEXT_PUBLIC_LIFF_ID;
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.pharmru.com";
    expect(liffDeepLink("/pricing")).toBe("https://www.pharmru.com/pricing");
  });

  it("builds a liff.line.me link when a LIFF id is configured", () => {
    process.env.NEXT_PUBLIC_LIFF_ID = "1234567890-abcdefgh";
    expect(liffDeepLink("/pricing")).toBe("https://liff.line.me/1234567890-abcdefgh/pricing");
    expect(liffDeepLink("pricing")).toBe("https://liff.line.me/1234567890-abcdefgh/pricing");
  });
});

describe("toLiffUri", () => {
  it("leaves the URL unchanged when no LIFF id is configured", () => {
    delete process.env.NEXT_PUBLIC_LIFF_ID;
    expect(toLiffUri("https://www.pharmru.com/pricing")).toBe("https://www.pharmru.com/pricing");
  });

  it("converts a same-site URL to its liff.line.me equivalent", () => {
    process.env.NEXT_PUBLIC_LIFF_ID = "1234567890-abcdefgh";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.pharmru.com";
    expect(toLiffUri("https://www.pharmru.com/pricing?ref=line")).toBe(
      "https://liff.line.me/1234567890-abcdefgh/pricing?ref=line"
    );
  });

  it("leaves a foreign URL unchanged", () => {
    process.env.NEXT_PUBLIC_LIFF_ID = "1234567890-abcdefgh";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.pharmru.com";
    expect(toLiffUri("https://example.com/other")).toBe("https://example.com/other");
  });

  it("leaves an unparseable URL unchanged", () => {
    process.env.NEXT_PUBLIC_LIFF_ID = "1234567890-abcdefgh";
    expect(toLiffUri("not a url")).toBe("not a url");
  });
});

describe("resolveLiffNext", () => {
  it("prefers an explicit same-site ?next=", () => {
    expect(resolveLiffNext("/pricing", ["ple"])).toBe("/pricing");
  });

  it("falls back to the LIFF deep-link path", () => {
    expect(resolveLiffNext(null, ["ple", "practice"])).toBe("/ple/practice");
    expect(resolveLiffNext(null, "pricing")).toBe("/pricing");
  });

  it("defaults to /profile", () => {
    expect(resolveLiffNext(null, undefined)).toBe("/profile");
    expect(resolveLiffNext("", [])).toBe("/profile");
  });

  it("rejects open-redirect attempts", () => {
    expect(resolveLiffNext("https://evil.example", undefined)).toBe("/profile");
    expect(resolveLiffNext("//evil.example", undefined)).toBe("/profile");
    expect(resolveLiffNext("/\\evil.example", undefined)).toBe("/profile");
    // A path segment can't smuggle in a second slash or scheme.
    expect(resolveLiffNext(null, ["", "evil.example"])).not.toMatch(/^\/\//);
  });
});
