---
phase: 02-home-page
plan: 01
subsystem: content, data-layer, ui
tags: [astro-content-collections, mdx, intl-dateformat, i18n, tailwind-v4]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "BaseLayout, i18n system, design tokens, content.config.ts schema"
provides:
  - "6 seed MDX articles (3 EN + 3 FR) with valid frontmatter"
  - "Article data access layer (getArticlesByLocale, getFeaturedArticle, getCategories, getArticleUrl)"
  - "Locale-aware date formatting utility (formatDate)"
  - "Tag component with 3 visual variants (default, active, badge)"
  - "Home page and article i18n strings in both EN and FR"
affects: [02-home-page, 03-article-page, 04-search-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Centralized article data access via src/lib/articles.ts -- all pages use this, never raw getCollection"
    - "Intl.DateTimeFormat for locale-aware date formatting -- no external dependency"
    - "Flat MDX file naming convention: {lang}-{slug}.mdx to avoid entry.id path separator issues"
    - "Tag component variant pattern: variantClasses map + class:list composition"

key-files:
  created:
    - src/content/articles/en-building-design-system.mdx
    - src/content/articles/en-typescript-patterns.mdx
    - src/content/articles/en-css-container-queries.mdx
    - src/content/articles/fr-construire-design-system.mdx
    - src/content/articles/fr-patterns-typescript.mdx
    - src/content/articles/fr-css-container-queries.mdx
    - src/lib/articles.ts
    - src/utils/dates.ts
    - src/components/ui/Tag.astro
  modified:
    - src/i18n/ui.ts

key-decisions:
  - "Flat article file structure ({lang}-{slug}.mdx) to prevent entry.id path issues"
  - "Featured article fallback to most recent article when none marked featured: true"
  - "Intl.DateTimeFormat over date-fns/dayjs -- zero dependencies for trivial formatting"

patterns-established:
  - "Data access layer: src/lib/articles.ts encapsulates all content collection queries"
  - "Date formatting: src/utils/dates.ts with Intl.DateTimeFormat locale map"
  - "Tag variants: variantClasses map pattern for multi-variant Astro components"

# Metrics
duration: 4min
completed: 2026-02-09
---

# Phase 2 Plan 1: Data Foundation Summary

**6 seed MDX articles, article data access layer with typed queries, Intl.DateTimeFormat date utility, and Tag component with 3 Tailwind v4 variants**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-09T11:46:49Z
- **Completed:** 2026-02-09T11:50:20Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Created 6 seed MDX articles (3 EN + 3 FR) with full frontmatter matching content.config.ts schema -- includes featured flags, pillarTags with accents, optional image omission for fallback testing
- Built centralized article data access layer (src/lib/articles.ts) with 5 typed exports that all future pages will consume
- Implemented locale-aware date formatting using native Intl.DateTimeFormat with zero external dependencies
- Created reusable Tag component with 3 visual variants matching the design mockup exactly

## Task Commits

Each task was committed atomically:

1. **Task 1: Create seed MDX articles and i18n strings** - `9bf54e4` (feat)
2. **Task 2: Create article data access layer and date utility** - `596deb0` (feat)
3. **Task 3: Create Tag component with 3 variants** - `9e9ec6d` (feat)

## Files Created/Modified

- `src/content/articles/en-building-design-system.mdx` - Featured EN seed article (design systems)
- `src/content/articles/en-typescript-patterns.mdx` - EN seed article (TypeScript)
- `src/content/articles/en-css-container-queries.mdx` - EN seed article (CSS, no image -- tests fallback)
- `src/content/articles/fr-construire-design-system.mdx` - Featured FR seed article (design systems)
- `src/content/articles/fr-patterns-typescript.mdx` - FR seed article (TypeScript)
- `src/content/articles/fr-css-container-queries.mdx` - FR seed article (CSS, no image)
- `src/lib/articles.ts` - Article data access layer: getArticlesByLocale, getFeaturedArticle, getCategories, getArticleUrl, Article type
- `src/utils/dates.ts` - Locale-aware date formatting with Intl.DateTimeFormat
- `src/components/ui/Tag.astro` - Reusable tag component with 3 variants (default, active, badge)
- `src/i18n/ui.ts` - Added home.description, home.noArticles, home.filterAll, article.readingTime in EN + FR

## Decisions Made

- **Flat article file structure:** Used `{lang}-{slug}.mdx` naming convention (no subdirectories) to prevent `entry.id` path separator issues per research pitfall 6
- **Featured article fallback:** `getFeaturedArticle()` returns the first article with `featured: true`, falling back to `articles[0]` (most recent) if none is featured
- **Intl.DateTimeFormat over date-fns:** Native API handles all locale edge cases with zero dependency cost; format options `{ day: "numeric", month: "short", year: "numeric" }` produce correct output for both EN and FR

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All data prerequisites for Plan 02 (visual components) are ready
- Seed articles provide 3 distinct categories (design-systems, typescript, css) for testing category filtering
- Article data layer is importable and returns correct, sorted data
- Tag component is ready for use in ArticleCard and CategoryFilter components

## Self-Check: PASSED

- All 10 files: FOUND
- All 3 commits: FOUND (9bf54e4, 596deb0, 9e9ec6d)
- astro check: 0 errors, 0 warnings
- astro build: Complete

---
*Phase: 02-home-page*
*Completed: 2026-02-09*
