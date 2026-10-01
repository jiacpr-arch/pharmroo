/**
 * Test mode of /api/line/exam-countdown: `?test=<email>&days=N` sends one
 * sample to that user and never writes to line_messages_sent.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const sendLineMessage = vi.fn();
const sendEmail = vi.fn();
const insert = vi.fn();
let userRow: Record<string, unknown> | undefined;

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({ from: () => ({ where: () => Promise.resolve(userRow ? [userRow] : []) }) }),
    insert: (...args: unknown[]) => insert(...args),
  },
}));
vi.mock("@/lib/line", () => ({
  sendLineMessage: (...args: unknown[]) => sendLineMessage(...args),
  checkLineQuota: vi.fn(),
}));
vi.mock("@/lib/email/resend", () => ({
  getResend: () => ({ emails: { send: (...args: unknown[]) => sendEmail(...args) } }),
  fromEmail: "test@pharmru.com",
}));

import { GET } from "@/app/api/line/exam-countdown/route";

function req(query: string) {
  return new NextRequest(`https://www.pharmru.com/api/line/exam-countdown?secret=s&${query}`);
}

beforeEach(() => {
  process.env.CRON_SECRET = "s";
  vi.clearAllMocks();
  userRow = { id: "u1", email: "me@example.com", line_user_id: "Uabc", target_exam: "PLE-PC" };
});

describe("exam-countdown test mode", () => {
  it("pushes one LINE message to the user and records nothing", async () => {
    const res = await GET(req("test=Me@Example.com&days=14"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({ ok: true, test: true, channel: "line", days: 14 });
    expect(body.round).toMatch(/^pc1-/);
    expect(sendLineMessage).toHaveBeenCalledTimes(1);
    expect(sendLineMessage.mock.calls[0][0]).toBe("Uabc");
    expect(insert).not.toHaveBeenCalled();
  });

  it("falls back to email for users without LINE, and honors exam=", async () => {
    userRow = { ...userRow, line_user_id: null };
    const body = await (await GET(req("test=me@example.com&days=1&exam=PLE-CC1"))).json();

    expect(body).toMatchObject({ channel: "email", days: 1 });
    expect(body.round).toMatch(/^cc1-/);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendLineMessage).not.toHaveBeenCalled();
  });

  it("rejects non-milestone days and unknown users", async () => {
    expect((await GET(req("test=me@example.com&days=5"))).status).toBe(400);
    userRow = undefined;
    expect((await GET(req("test=nobody@example.com&days=7"))).status).toBe(404);
    expect(sendLineMessage).not.toHaveBeenCalled();
  });

  it("still requires CRON_SECRET", async () => {
    const res = await GET(new NextRequest("https://www.pharmru.com/api/line/exam-countdown?test=me@example.com"));
    expect(res.status).toBe(401);
  });
});
