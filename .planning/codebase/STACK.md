# Technology Stack

**Analysis Date:** 2026-02-09

## Languages

**Primary:**
- TypeScript 5.9.3 - Used for all configuration files, page logic, and utilities
- JavaScript (ES modules) - Astro config and minor build scripts
- HTML/CSS - Templates and styling via Tailwind CSS

**Secondary:**
- MDX (Markdown with JSX) - Content articles via `@astrojs/mdx`

## Runtime

**Environment:**
- Node.js 22 (pinned in GitHub Actions)
- ES modules (`"type": "module"` in `package.json`)

**Package Manager:**
- npm (no pnpm detected)
- Lockfile: `package-lock.json`

## Frameworks

**Core:**
- Astro 5.17.1 - Static site generator with i18n support
  - Config: `astro.config.mjs`
  - Static output mode (`output: "static"`)
  - Adapter: Cloudflare Pages via `@astrojs/cloudflare` 12.6.12
  - MDX integration: `@astrojs/mdx` 4.3.13
  - Sitemap generation: `@astrojs/sitemap` 3.7.0

**Styling:**
- Tailwind CSS v4.1.18 - Vite plugin approach via `@tailwindcss/vite` 4.1.18 (NOT `@astrojs/tailwind`)
  - Custom theme defined in `src/styles/global.css` using `@theme`
  - Configuration: Vite plugin in `astro.config.mjs`
  - Dark theme with teal accent (#0D9488) and multi-level color system

**Testing:**
- Vitest ~3.2.4 (pinned at 3.x - noted incompatible with Astro 5.x at 4.x)
  - Config: `vitest.config.ts`
  - Environment: Node
  - Coverage provider: V8
  - Include patterns: `src/**/*.{test,spec}.ts`
- Playwright 1.58.2 - E2E testing
  - Config: `playwright.config.ts`
  - Target: Chromium only
  - Web server: `wrangler pages dev ./dist --port 4321`
- Stryker 9.5.1 - Mutation testing (local development only)
  - Runner: `@stryker-mutator/vitest-runner` 9.5.1
  - Not run in CI

**Linting & Formatting:**
- ESLint 9.39.2 - Code linting
  - Config: `eslint.config.js` (flat config format)
  - Extends: `typescript-eslint` strict + `eslint-plugin-astro` recommended
  - Ignores: `dist/`, `.astro/`, `.wrangler/`, `node_modules/`, `public/pagefind/`, `.stryker-tmp/`, `worker-configuration.d.ts`
- Prettier 3.8.1 - Code formatting
  - Config: `prettier.config.mjs`
  - Plugin: `prettier-plugin-astro` 0.14.1
  - Ignores: `dist/`, `.astro/`, `node_modules/`, `.wrangler/`, `public/pagefind/`, lock files, `.stryker-tmp/`, `.claude/`, `design-research/`, `*.md`
- markdownlint-cli2 0.20.0 - Markdown content linting
  - Target: `src/content/**/*.{md,mdx}`

**Build & Dev Tools:**
- Wrangler 4.63.0 - Cloudflare Pages CLI
  - Command: `wrangler types` generates `worker-configuration.d.ts` (auto-generated, ignored by ESLint)
  - Pages deployment: `wrangler pages deploy dist`
  - Dev server: `wrangler pages dev dist --port 4321`
- Knip 5.83.1 - Unused code detection
  - Runs in CI quality gate
- Pagefind 1.4.0 - Client-side search indexing
  - Post-build: `pagefind --site dist`
  - Output: `public/pagefind/`
- lefthook 2.1.0 - Git pre-commit hooks
  - Config: `lefthook.yml`
  - Parallel execution of: prettier, eslint, markdownlint-cli2

**Quality & Observability:**
- Lighthouse CI via treosh/lighthouse-ci-action
  - Config: `lighthouserc.json`
  - Targets: `/en/`, `/fr/`, `/en/search`
  - Assertions: 0.9 minimum score for performance, accessibility, SEO (error level)
  - Best practices: 0.9 minimum (warning level)
- @lhci/cli 0.15.1 - Local Lighthouse CI runner

**Type Checking:**
- TypeScript 5.9.3 strict mode
  - Config: `tsconfig.json` extends `astro/tsconfigs/strict`
  - Includes: `.astro/types.d.ts`, all files
  - Excludes: `dist`, `node_modules`, `.wrangler`
  - Path aliases: `@/*` → `src/*`
- @astrojs/check 0.9.6 - Astro-specific type checking
  - Runs: `astro check` and `astro sync`

## Configuration

**Environment:**
- Env var handling: `src/env.d.ts` extends Cloudflare Runtime type
- Runtime type: `import("@astrojs/cloudflare").Runtime<Env>`
- Platform proxy enabled in Cloudflare adapter
- Compatibility date: 2025-01-01 in `wrangler.jsonc`
- Compatibility flag: `nodejs_compat` for Node.js runtime compatibility

**Build:**
- Build scripts in `package.json`:
  - `dev`: `wrangler types && astro dev`
  - `build`: `wrangler types && astro check && astro build && pagefind --site dist`
  - `preview`: `astro build && wrangler pages dev dist`
  - `typecheck`: `astro sync && astro check && tsc --noEmit`
  - `lint`: `eslint .`
  - `lint:content`: `markdownlint-cli2` on content
  - `test`: `vitest run`
  - `test:watch`: `vitest`
  - `test:coverage`: `vitest run --coverage`
  - `test:mutation`: `npx stryker run`
  - `test:e2e`: `playwright test`
  - `deploy`: `npm run build && wrangler pages deploy dist --project-name=sebc-dev`

- Build optimization: `NODE_OPTIONS: "--max-old-space-size=4096"` in CI

**i18n Configuration:**
- Default locale: `en`
- Supported locales: `en`, `fr`
- Routing: Prefix all locales (including default), redirect to default locale
- Page structure: Locale-prefixed routes (`/en/`, `/fr/`)

## Platform Requirements

**Development:**
- Node.js 22
- npm (lockfile: `package-lock.json`)
- Git with pre-commit hooks (lefthook)
- Playwright installation for E2E tests: `npm run build && npm run test:e2e`

**Production:**
- Cloudflare Pages (static hosting)
- Cloudflare Workers runtime (for Page Functions if needed)
- Compatibility: nodejs_compat enabled
- Build output: `dist/` directory

---

*Stack analysis: 2026-02-09*
