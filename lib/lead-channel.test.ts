import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DB to avoid real DB calls in unit tests
const mockInsertReturning = vi.fn();
const mockSelect = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          then: (fn: (r: unknown[]) => unknown) => Promise.resolve(fn([])),
        }),
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: () => ({
          then: (fn: (r: unknown[]) => unknown) =>
            Promise.resolve(
              fn([
                {
                  id: "lead-abc",
                  source: "fb_messenger",
                  stage: "new",
                  fb_psid: "psid-123",
                  line_user_id: null,
                  created_at: "2026-05-11 00:00:00",
                  updated_at: "2026-05-11 00:00:00",
                },
              ])
            ),
        }),
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => Promise.resolve(),
      }),
    }),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  leads: { id: "id", fb_psid: "fb_psid", line_user_id: "line_user_id", updated_at: "updated_at" },
}));

describe("getOrCreateLeadFromChannel", () => {
  it("creates a new embryo lead for Messenger", async () => {
    const { getOrCreateLeadFromChannel } = await import("./lead-channel");
    const lead = await getOrCreateLeadFromChannel({
      channel: "fb_messenger",
      channelUserId: "psid-123",
    });
    expect(lead.id).toBe("lead-abc");
    expect(lead.source).toBe("fb_messenger");
    expect(lead.stage).toBe("new");
  });
});
