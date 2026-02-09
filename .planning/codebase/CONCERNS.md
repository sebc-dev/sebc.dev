# Codebase Concerns

**Analysis Date:** 2026-02-09

## Tech Debt

**Underpopulated directory structure:**
- Issue: Multiple empty component and utility directories exist but contain no code
- Files: `src/components/layout/`, `src/components/shared/`, `src/components/ui/`, `src/components/article/`, `src/components/about/`, `src/lib/`, `src/utils/`, `src/types/`, `src/assets/`
- Impact: Dead directories create false expectations about code organization and may cause confusion during development; suggests incomplete architectural planning
- Fix approach: Remove empty directories when not immediately needed, or populate with placeholder files and documentation explaining their intended purpose

**Vitest configuration type safety:**
- Issue: `vitest.config.ts` requires `as any` cast to satisfy TypeScript strict mode
- Files: `src/vitest.config.ts` (lines 15-16)
- Impact: Bypasses type checking on test configuration; may allow incompatibilities with Astro 5 to go undetected
- Fix approach: Migrate to Vitest v4+ compatible config structure or update Astro/Vitest types to eliminate `any` cast need

**ESLint strict rule disabled:**
- Issue: `@typescript-eslint/no-empty-object-type` rule disabled in `eslint.config.js`
- Files: `eslint.config.js` (lines 9-10)
- Impact: Allows untyped empty objects to slip into codebase; reduces type safety gains from strict mode
- Fix approach: Replace empty object types with proper `Record<string, never>` or explicit interfaces; re-enable rule

## Known Bugs

**Font loading via Google Fonts:**
- Symptoms: Render-blocking external font loads on every page
- Files: `src/layouts/BaseLayout.astro` (lines 21-26)
- Trigger: Page load with CSS font imports
- Workaround: None currently; will cause Cumulative Layout Shift (CLS) and slow First Contentful Paint (FCP)
- Note: Consider self-hosting fonts or using local font files for better performance

## Security Considerations

**Client-side IntersectionObserver without error boundary:**
- Risk: Script in `BaseLayout.astro` queries elements without checking existence; could fail silently if HTML structure changes
- Files: `src/layouts/BaseLayout.astro` (lines 32-44)
- Current mitigation: None
- Recommendations: Add try-catch around observer setup; validate selector results before use

**Environment configuration incomplete:**
- Risk: `Env` interface in `src/env.d.ts` uses `[key: string]: unknown` - allows any env var access without type checking
- Files: `src/env.d.ts` (lines 6-8)
- Current mitigation: TypeScript strict mode enabled elsewhere
- Recommendations: Define explicit interface for actual Cloudflare bindings; restrict access to known variables

## Performance Bottlenecks

**Content schema validation granularity:**
- Problem: `pillarTags` requires at least one tag but no upper limit defined; articles could accumulate unbounded tags
- Files: `src/content.config.ts` (lines 13-15)
- Cause: Missing `max()` constraint on array schema
- Improvement path: Add `.max(3)` or similar limit to prevent content bloat

**Google Fonts blocking render:**
- Problem: Two font requests (Albert Sans + Fira Code) block page render
- Files: `src/layouts/BaseLayout.astro` (lines 21-26)
- Cause: Default font loading strategy without `display=swap`
- Improvement path: Add `&display=swap` to font URL or self-host fonts

**No image optimization:**
- Problem: Images are not mentioned in Tailwind config; no responsive image handling detected
- Files: `astro.config.mjs` (line 11: `imageService: "compile"`)
- Cause: Using compile image service instead of sharp/cloudflare for runtime optimization
- Improvement path: Consider using Astro's `<Image>` component with proper sizing

## Fragile Areas

**Single layout for all pages:**
- Files: `src/layouts/BaseLayout.astro`
- Why fragile: All pages depend on this one layout; any breaking change affects the entire site
- Safe modification: Write comprehensive E2E tests before modifying layout structure; test all page types
- Test coverage: No E2E tests found in `e2e/` directory; Playwright configured but unused

**Content schema evolution:**
- Files: `src/content.config.ts`
- Why fragile: Adding/removing required fields breaks existing articles without migration path
- Safe modification: Always use `.optional()` for new fields; never remove fields without deprecation period
- Test coverage: No tests for content schema validation; schema changes have no safeguards

**Hardcoded strings in components:**
- Files: `src/pages/en/index.astro`, `src/pages/fr/index.astro`
- Why fragile: Duplicated text across language variants; no i18n utility found to prevent inconsistency
- Safe modification: Extract all user-facing text to content collection or i18n variables
- Test coverage: No automated tests for content accuracy

## Scaling Limits

**Zero test coverage:**
- Current capacity: No unit or integration tests exist in `src/`
- Limit: Refactoring is high-risk; no safety net for breaking changes
- Scaling path: Implement Vitest configuration with baseline coverage; add tests for content schema, utilities, and critical components

**E2E tests not implemented:**
- Current capacity: Playwright configured with 120s timeout but `e2e/` directory is empty
- Limit: Cannot catch regressions in page rendering, links, or layout changes
- Scaling path: Add smoke tests for `/en`, `/fr`, `/en/articles`, `/fr/articles` routes; verify navigation works

**Manual content management:**
- Current capacity: No content is present in `src/content/articles/`
- Limit: Cannot test article rendering, pagination, or search until populated
- Scaling path: Create at least 3-5 sample articles in both languages before shipping

## Dependencies at Risk

**Vitest v3 pinned (skill explicitly blocks v4):**
- Risk: Project memory says v4 "incompatible with Astro 5.x" but Astro 5.17.1 is mature; risk may be outdated
- Impact: Cannot use latest Vitest features; may miss critical bug fixes
- Migration plan: Test Vitest v4 with current Astro version; unpin if compatible

**Tailwind CSS v4 via @tailwindcss/vite (not @astrojs/tailwind):**
- Risk: Using newer Vite plugin approach instead of official Astro integration; less community testing
- Impact: May miss compatibility issues with Astro updates
- Migration plan: Monitor release notes; test Astro/Tailwind combinations before updating

**Pagefind for client-side search:**
- Risk: Depends on generated static index; no fallback if index fails to load
- Impact: Search feature silently breaks if index generation is skipped
- Migration plan: Add error handling for missing Pagefind index; document build requirement

## Missing Critical Features

**No error pages:**
- Problem: No 404, 500, or error layout defined
- Blocks: Users see generic browser errors instead of branded error pages

**No mobile navigation:**
- Problem: No menu/navigation component found in empty `src/components/layout/`
- Blocks: Mobile users cannot navigate between pages effectively

**No search implementation:**
- Problem: Pagefind is installed but no search page or component exists
- Blocks: Cannot search articles despite having search infrastructure

**No article listing/index page:**
- Problem: No article listing component found despite collection defined
- Blocks: Cannot browse or discover articles

## Test Coverage Gaps

**Content schema not validated:**
- What's not tested: `pillarTags` enum enforcement, date parsing, string length limits
- Files: `src/content.config.ts`
- Risk: Invalid articles could be committed without detection
- Priority: High

**Layout rendering:**
- What's not tested: Font loading, IntersectionObserver functionality, metadata generation
- Files: `src/layouts/BaseLayout.astro`
- Risk: Visual regressions go undetected
- Priority: High

**Internationalization routing:**
- What's not tested: URL prefix handling (`/en/`, `/fr/`), locale detection, redirect behavior
- Files: `astro.config.mjs` (i18n config), pages structure
- Risk: i18n routing could break silently
- Priority: High

**Build and deployment process:**
- What's not tested: Pagefind index generation, Cloudflare Pages deployment, static site generation
- Files: `package.json` scripts, Cloudflare adapter configuration
- Risk: Build-time errors only caught in CI/production
- Priority: Medium

**Prettier/ESLint integration:**
- What's not tested: Lefthook pre-commit hooks, linting enforcement, format consistency
- Files: `lefthook.yml`, `eslint.config.js`, `prettier.config.mjs`
- Risk: Lint/format failures only caught on push or CI
- Priority: Medium

---

*Concerns audit: 2026-02-09*
