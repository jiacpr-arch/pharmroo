import { it } from "vitest";
import { BIOPHARM } from "@/lib/ip1-mock/biopharm";
it("check", () => {
  BIOPHARM.forEach((set, i) => {
    const d = { easy: 0, medium: 0, hard: 0 } as Record<string, number>;
    set.forEach((q) => {
      d[q.d]++;
      if (!q.w[q.a].startsWith("ถูก")) console.log("W mismatch", q.t);
      q.w.forEach((w, j) => { if (j !== q.a && w.startsWith("ถูก")) console.log("extra ถูก", q.t); });
      if (q.o.every((o) => /^\d/.test(o))) {
        const n = q.o.map((o) => parseFloat(o));
        if (n.some((x, j) => j && x < n[j - 1])) console.log("not sorted", q.t);
      }
    });
    console.log(`Set ${i + 1}: n=${set.length}`, JSON.stringify(d), set.filter((q) => q.c).length, "calc");
  });
  console.log(BIOPHARM.flat().map((q) => q.t).join(", "));
});
