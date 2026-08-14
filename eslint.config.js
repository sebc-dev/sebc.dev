import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.strict,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    ignores: [
      "dist/",
      "coverage/",
      ".astro/",
      ".wrangler/",
      "node_modules/",
      "public/pagefind/",
      ".stryker-tmp/",
      ".claude/get-shit-done/",
      ".claude/hooks/",
    ],
  },
];
