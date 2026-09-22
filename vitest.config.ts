import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    // เริ่มจากเทสต์ของเกมก่อน — __tests__/ เดิมยังไม่เคยมี runner จึงยังไม่รวมเข้ามา
    include: ["lib/game/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
