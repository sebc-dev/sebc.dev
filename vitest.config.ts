/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,astro}"],
      exclude: ["**/*.config.*", "src/content.config.ts", "src/env.d.ts"],
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);
