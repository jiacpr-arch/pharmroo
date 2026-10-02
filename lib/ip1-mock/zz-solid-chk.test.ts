import { it } from "vitest";
import { SOLID } from "@/lib/ip1-mock/solid";
it("x", () => {
  SOLID.forEach((s, i) => {
    const d = { easy: 0, medium: 0, hard: 0 } as Record<string, number>;
    s.forEach((q) => { d[q.d]++; const num = q.o.every((o) => /^\d/.test(o)); if (num) { const v = q.o.map((o) => parseFloat(o)); if (v.some((x, j) => j && x < v[j - 1])) console.log("ORDER", q.t); } });
    console.log(i + 1, s.length, JSON.stringify(d), s.map((q) => q.t).join(", "));
  });
});
