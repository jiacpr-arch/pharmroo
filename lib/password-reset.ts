import { createHash, randomBytes } from "crypto";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
export const MIN_PASSWORD_LENGTH = 6;

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Timestamps in this schema are text "YYYY-MM-DD HH24:MI:SS" (UTC). */
export function formatDbTimestamp(d: Date): string {
  return d.toISOString().slice(0, 19).replace("T", " ");
}
