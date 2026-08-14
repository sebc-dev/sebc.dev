# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` — Start dev server (runs `wrangler types && astro dev`)
- `npm run build` — Full build: wrangler types → astro check → astro build → pagefind indexing
- `npm run preview` — Build + preview with Wrangler Workers locally

### Testing
- `npm run test` — Run unit tests once (vitest)
- `npm run test:watch` — Tests in watch mode
- `npm run test:coverage` — Tests with v8 coverage
- `npm run test:mutation` — Mutation testing (stryker, local only)
- `npm run test:e2e` — E2E tests (playwright, chromium)
- Run a single test: `npx vitest run src/utils/dates.test.ts`

### Quality
- `npm run lint` — ESLint
- `npm run lint:content` — Markdownlint on `src/content/**/*.{md,mdx}`
- `npm run format` / `npm run format:check` — Prettier
- `npm run knip` — Dead code detection
- `npm run typecheck` — Full type check (astro sync + astro check + tsc --noEmit)

### Quality Report Script
`./scripts/quality-report.sh` — Compact report optimized for LLM consumption (minimal tokens):
```
-t  tests only (no coverage)    -c  tests + coverage (-c implies -t)
-k  knip (dead code)            -m  mutation testing (stryker)
-a  all (-t -c -k -m)           -v  verbose (full logs)
-o FILE  write to file (ANSI stripped)
```

## Architecture

**Astro 7 static site** deployed on Cloudflare Workers Static Assets. Bilingual (EN default + FR), all routes locale-prefixed (`/en/...`, `/fr/...`).

There is **no Astro adapter**: the site is 100% static, so `astro build` writes plain files to `dist/` and Workers serves them directly with no Worker script. Adding SSR, a binding (KV/D1/R2) or a server island would require reinstating `@astrojs/cloudflare` and a `main` entry in `wrangler.jsonc`.

### Content Layer
- Config: `src/content.config.ts` (NOT `src/content/config.ts`)
- MDX articles in `src/content/articles/` loaded via `glob()` loader
- Schema enforces `pillarTags` enum: `"IA"`, `"Ingénierie"`, `"UX"` (min 1)
- `draft: true` articles are filtered out by `src/lib/articles.ts`
- Articles support `series` (id, episode, total) and `translationSlug` for cross-locale linking

### Routing
- `src/pages/index.astro` — redirect to default locale
- `src/pages/{en,fr}/index.astro` — home pages
- `src/pages/{en,fr}/articles/[id].astro` — dynamic article pages (use `entry.id` NOT `entry.slug`)
- `src/pages/{en,fr}/search.astro` — Pagefind client-side search
- `src/pages/{en,fr}/about.astro`

### Key Modules
- `src/lib/articles.ts` — Article queries (by locale, featured, related by score, categories)
- `src/i18n/utils.ts` — `getLangFromUrl()`, `useTranslations()` returning `t(key)` function
- `src/i18n/ui.ts` — UI translation strings (en/fr)
- `src/utils/dates.ts` — `formatDate(date, lang)` using `Intl.DateTimeFormat`

### Layouts & Components
- `BaseLayout.astro` → Header, Footer, scroll reveal
- `ArticleLayout.astro` → TOC, reading progress bar, share buttons
- Components organized: `layout/`, `article/`, `ui/`

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` (NOT `@astrojs/tailwind`)
- Global styles: `src/styles/global.css` with `@theme` block defining color tokens
- Dark theme: void/canvas/surface backgrounds, teal accent `#0D9488`
- Fonts: Albert Sans (body), Fira Code (code)
- Use `@reference "../styles/global.css"` in `<style>` blocks for `@apply` with Tailwind v4

## Astro 7 Gotchas
- Requires Node >= 22.12.0
- **Markdown runs on the `unified()` processor, not Astro 7's default Sätteri.** Astro 7 made Sätteri the default and stopped bundling `@astrojs/markdown-remark`; we install it explicitly and pass `processor: unified({ rehypePlugins: [...] })` because the heading anchors depend on `rehypeHeadingIds` + `rehype-autolink-headings`. MDX inherits this processor. Do NOT move plugins back to the removed top-level `markdown.rehypePlugins`.
- The compiler is Rust-based and **rejects invalid HTML** instead of silently repairing it — every non-void tag needs a closing tag.
- `compressHTML: true` is set on purpose: Astro 7 defaults to `'jsx'`, which strips whitespace between inline elements (`<span>a</span><em>b</em>` → `ab`).
- `src/fetch.ts` / `src/fetch.js` is a **reserved filename** (advanced routing).
- `import { render } from 'astro:content'` NOT `entry.render()`
- `import { z } from 'astro/zod'` NOT `from 'zod'`
- `output: 'static'` only (no `hybrid`)
- `getViteConfig()` from `astro/config` needs `as any` cast for test property in vitest config
- Path alias: `@/*` maps to `src/*`

## Cloudflare hosting
- `wrangler.jsonc` — assets-only Worker: no `main`, no `binding` (only valid with a Worker script).
- `html_handling: "drop-trailing-slash"` mirrors Astro's `trailingSlash: "never"` (`/a/b/` → 307 → `/a/b`).
- `not_found_handling: "404-page"` serves the built `404.html`.
- `public/_headers` (CSP, HSTS, immutable `_astro/*`) and `public/_redirects` (`/` → 301 → `/en`) are consumed by Cloudflare and are not served as assets.
- `npm run preview` builds then serves through `wrangler dev`, which exercises the real routing rules above — use it, not `astro preview`, to validate redirects and headers.

## CI/CD
- **PR**: Quality Gate (`quality.yml`) — prettier, eslint, markdownlint, astro check, knip, vitest+coverage, npm audit, playwright E2E, Lighthouse CI (0.9 min scores)
- **Push to main**: Deploy (`deploy.yml`) — build + Cloudflare Workers deploy via wrangler. Needs the `CF_API_TOKEN` and `CF_ACCOUNT_ID` secrets in the `production` environment.
- **Pre-commit** (lefthook): prettier, eslint, markdownlint on staged files
