import { describe, expect, it } from "vitest";
import { IP1_MOCK_DOMAINS, IP1_MOCK_PER_DOMAIN } from "@/lib/ip1-mock/domains";
import { buildIp1Mock, isIp1MockSetReady } from "@/lib/ip1-mock/builder";
import { IP1_MOCK_PLANNED_SETS, IP1_MOCK_SETS } from "@/lib/ip1-mock/sets";

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

describe("IP1 Mock content", () => {
  for (const dom of IP1_MOCK_DOMAINS) {
    it(`${dom.key}: well-formed items, at most ${IP1_MOCK_PLANNED_SETS} sets of ${IP1_MOCK_PER_DOMAIN}`, () => {
      expect(dom.sets.length).toBeLessThanOrEqual(IP1_MOCK_PLANNED_SETS);
      dom.sets.forEach((set, si) => {
        expect(set.length, `${dom.key} set ${si + 1}`).toBeLessThanOrEqual(IP1_MOCK_PER_DOMAIN);
        for (const q of set) {
          const where = `${dom.key} set ${si + 1} "${q.t}"`;
          expect(q.o, where).toHaveLength(5);
          expect(q.w, where).toHaveLength(5);
          expect(Number.isInteger(q.a) && q.a >= 0 && q.a <= 4, where).toBe(true);
          expect(new Set(q.o.map(norm)).size, `${where}: duplicate options`).toBe(5);
          for (const s of [q.t, q.p, q.r, q.k, q.ref, ...q.o, ...q.w]) expect(s.trim().length, where).toBeGreaterThan(0);
        }
      });
    });

    it(`${dom.key}: no topic repeated across sets`, () => {
      const topics = dom.sets.flat().map((q) => norm(q.t));
      const dup = topics.filter((t, i) => topics.indexOf(t) !== i);
      expect(dup).toEqual([]);
    });
  }

  it("no question appears twice anywhere (within or across sets)", () => {
    const prompts = IP1_MOCK_DOMAINS.flatMap((d) => d.sets.flat()).map((q) => norm(q.p));
    const dup = prompts.filter((p, i) => prompts.indexOf(p) !== i);
    expect(dup).toEqual([]);
  });

  it("ready sets are 120 questions with unique ids and 10 per domain", () => {
    const ids = new Set<string>();
    for (const [no, qs] of Object.entries(IP1_MOCK_SETS)) {
      expect(isIp1MockSetReady(Number(no))).toBe(true);
      expect(qs).toHaveLength(IP1_MOCK_DOMAINS.length * IP1_MOCK_PER_DOMAIN);
      for (const dom of IP1_MOCK_DOMAINS) {
        expect(qs.filter((q) => q.mcq_subjects?.id === `ip1-${dom.key}`)).toHaveLength(IP1_MOCK_PER_DOMAIN);
      }
      for (const q of qs) {
        expect(ids.has(q.id)).toBe(false);
        ids.add(q.id);
        const correct = q.detailed_explanation!.choices.filter((c) => c.is_correct);
        expect(correct).toHaveLength(1);
        expect(correct[0].label).toBe(q.correct_answer);
      }
    }
  });

  it("builder keeps the correct option text for every item", () => {
    for (let no = 1; no <= IP1_MOCK_PLANNED_SETS; no++) {
      const domains = IP1_MOCK_DOMAINS.filter((d) => d.sets[no - 1]?.length);
      const built = buildIp1Mock(no, domains);
      const src = domains.flatMap((d) => d.sets[no - 1].slice(0, IP1_MOCK_PER_DOMAIN));
      built.forEach((q, i) => {
        const ans = q.choices.find((c) => c.label === q.correct_answer)!;
        expect(ans.text).toBe(src[i].o[src[i].a]);
      });
    }
  });
});
