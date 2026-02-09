/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: "vitest",
  reporters: ["clear-text", "html"],
  mutate: [
    "src/utils/**/*.ts",
    "src/lib/**/*.ts",
    "src/i18n/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.astro",
    "!src/**/*.d.ts",
  ],
  mutator: {
    excludedMutations: ["StringLiteral"],
  },
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
};
