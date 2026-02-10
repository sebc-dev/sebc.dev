---
phase: 06-seo-polish-deployment
plan: 01
subsystem: seo
tags: [open-graph, twitter-cards, json-ld, rss, hreflang, canonical, astro-rss]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "BaseLayout, i18n routing, Header with LangSwitch"
  - phase: 02-home-page
    provides: "Article content layer, getArticlesByLocale, getArticleUrl"
  - phase: 03-article-page
    provides: "ArticleLayout with translationMap"
provides:
  - "SEO.astro centralized OG, Twitter Card, canonical, hreflang, RSS autodiscovery"
  - "JsonLd.astro BlogPosting structured data for articles"
  - "RSS feeds at /en/rss.xml and /fr/rss.xml"
  - "translationMap passed on all pages for cross-locale linking"
affects: [06-seo-polish-deployment]

# Tech tracking
tech-stack:
  added: ["@astrojs/rss"]
  patterns: ["Centralized SEO component in BaseLayout head", "siteUrl fallback pattern (Astro.site ?? new URL)"]

key-files:
  created:
    - "src/components/seo/SEO.astro"
    - "src/components/seo/JsonLd.astro"
    - "src/pages/en/rss.xml.ts"
    - "src/pages/fr/rss.xml.ts"
  modified:
    - "src/layouts/BaseLayout.astro"
    - "src/layouts/ArticleLayout.astro"
    - "src/pages/en/index.astro"
    - "src/pages/fr/index.astro"
    - "src/pages/en/about.astro"
    - "src/pages/fr/about.astro"
    - "src/pages/en/search.astro"
    - "src/pages/fr/search.astro"

key-decisions:
  - "Used Astro.site fallback pattern instead of non-null assertions to satisfy ESLint no-non-null-assertion rule"
  - "publishedDate accepted in SEO Props but not destructured (reserved for future og:article:published_time)"
  - "x-default hreflang always points to English version for SEO best practice"
  - "RSS description uses double dashes (--) not em dashes to avoid XML encoding issues"

patterns-established:
  - "SEO component pattern: centralized meta tag injection via BaseLayout"
  - "translationMap computation: path-based for static pages, translationSlug-based for articles"

# Metrics
duration: 5min
completed: 2026-02-10
---

# Phase 6 Plan 1: SEO Infrastructure Summary

**Centralized OG, Twitter Card, canonical/hreflang, JSON-LD BlogPosting, and bilingual RSS feeds for all pages**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-10T19:49:30Z
- **Completed:** 2026-02-10T19:54:45Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Every page now has full Open Graph and Twitter Card meta tags for social sharing
- Bilingual hreflang alternates (en, fr, x-default) on all pages for proper search engine locale targeting
- Article pages have JSON-LD BlogPosting structured data with headline, author, dates
- RSS feeds at /en/rss.xml and /fr/rss.xml with autodiscovery links in every page head

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SEO and JsonLd components + RSS feed endpoints** - `6aa6f35` (feat)
2. **Task 2: Wire SEO and JsonLd into layouts, pass translationMap from all pages** - `c59bbad` (feat)

## Files Created/Modified
- `src/components/seo/SEO.astro` - Centralized OG, Twitter Card, canonical, hreflang, RSS autodiscovery meta tags
- `src/components/seo/JsonLd.astro` - JSON-LD BlogPosting structured data component
- `src/pages/en/rss.xml.ts` - English RSS feed endpoint
- `src/pages/fr/rss.xml.ts` - French RSS feed endpoint
- `src/layouts/BaseLayout.astro` - Added SEO component import and rendering in head, extended Props with image/type/publishedDate
- `src/layouts/ArticleLayout.astro` - Added JsonLd component, passes article-specific SEO values to BaseLayout
- `src/pages/{en,fr}/index.astro` - Added translationMap computation and BaseLayout prop
- `src/pages/{en,fr}/about.astro` - Added translationMap computation and BaseLayout prop
- `src/pages/{en,fr}/search.astro` - Added translationMap computation and BaseLayout prop

## Decisions Made
- Used `Astro.site ?? new URL("https://sebc.dev")` fallback pattern instead of non-null assertions (`Astro.site!`) to satisfy the ESLint `no-non-null-assertion` rule
- `publishedDate` accepted in SEO Props interface but not destructured in the component (reserved for future `og:article:published_time` extension)
- `x-default` hreflang always points to the English version per SEO best practice
- RSS descriptions use double dashes (`--`) instead of em dashes to avoid XML encoding issues
- Home page translationMap handles the edge case where path is `/en` or `/fr` (no trailing content)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed ESLint non-null assertion errors**
- **Found during:** Task 1
- **Issue:** Plan specified `Astro.site!` pattern but project ESLint config forbids non-null assertions
- **Fix:** Used fallback pattern `Astro.site ?? new URL("https://sebc.dev")` in all 4 files
- **Files modified:** SEO.astro, JsonLd.astro, rss.xml.ts (en/fr)
- **Verification:** ESLint passes, build succeeds
- **Committed in:** 6aa6f35

**2. [Rule 1 - Bug] Removed unused publishedDate destructuring**
- **Found during:** Task 1
- **Issue:** Plan included `publishedDate` in destructuring but SEO component never uses it, causing `no-unused-vars` ESLint error
- **Fix:** Kept `publishedDate` in Props interface (for type safety when passed) but removed from destructuring
- **Files modified:** SEO.astro
- **Verification:** ESLint passes
- **Committed in:** 6aa6f35

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes were necessary for pre-commit hooks to pass. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- SEO infrastructure complete, all pages have proper meta tags
- Ready for remaining Phase 6 plans (sitemap refinement, View Transitions, deployment polish)
- RSS feeds functional and discoverable

## Self-Check: PASSED

- All 4 created files verified on disk
- Both task commits (6aa6f35, c59bbad) verified in git log
- Build passes cleanly
- Typecheck passes (0 errors, 0 warnings)
- Built HTML verified: OG, Twitter Card, canonical, hreflang, RSS autodiscovery, JSON-LD all present

---
*Phase: 06-seo-polish-deployment*
*Completed: 2026-02-10*
