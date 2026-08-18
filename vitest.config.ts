import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "server-only": resolve(__dirname, "src/test/server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: { reporter: ["text", "html"] },
  },
});
