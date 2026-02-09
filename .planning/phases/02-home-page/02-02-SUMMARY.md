---
phase: 02-home-page
plan: 02
subsystem: ui, content
tags: [astro-components, tailwind-v4, client-side-filtering, i18n, responsive-grid]

# Dependency graph
requires:
  - phase: 02-home-page/01
    provides: "Seed MDX articles, article data access layer, Tag component, i18n strings"
  - phase: 01-foundation
    provides: "BaseLayout, i18n system, design tokens, global.css"
provides:
  - "FeaturedArticle hero component with image, metadata, tags"
  - "ArticleCard grid card component with data-category attribute for filtering"
  - "CategoryFilter button bar with client-side vanilla JS filtering"
  - "Complete EN and FR home pages with featured hero, filter bar, and article grid"
affects: [03-article-page, 04-search-page, 06-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client-side filtering via data-attributes and vanilla JS (no framework needed)"
    - "Direct script init + astro:after-swap listener (not astro:page-load which requires ClientRouter)"
    - "Staggered fade-up animations via CSS class composition (fade-up-d1, fade-up-d2, etc.)"
    - "Conditional image/placeholder pattern for articles without images"

key-files:
  created:
    - src/components/article/FeaturedArticle.astro
    - src/components/article/ArticleCard.astro
    - src/components/article/CategoryFilter.astro
  modified:
    - src/pages/en/index.astro
    - src/pages/fr/index.astro
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Category badge rendered as inline span (not Tag component) for absolute positioning inside image container"
  - "Script initialization uses direct call + astro:after-swap instead of astro:page-load (ClientRouter not added until Phase 6)"
  - "Featured article excluded from grid via ID comparison to prevent duplication"

patterns-established:
  - "Data-attribute filtering: data-filter on buttons, data-category on cards, vanilla JS toggle"
  - "Script init pattern: call immediately + listen for astro:after-swap (corrects Phase 1 astro:page-load pattern)"
  - "Image fallback: conditional render with >_ placeholder div when article has no image"

# Metrics
duration: 8min
completed: 2026-02-09
---

# Phase 2 Plan 2: Home Page Components Summary

**FeaturedArticle hero, ArticleCard grid, and CategoryFilter with client-side vanilla JS filtering wired into bilingual EN/FR home pages**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-09T12:00:00Z
- **Completed:** 2026-02-09T12:12:57Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 6

## Accomplishments

- Built FeaturedArticle hero component with 2-column responsive layout, image with gradient overlay, metadata row, and tags
- Created ArticleCard grid card with data-category attribute enabling client-side filtering, lazy-loaded images, and line-clamped descriptions
- Implemented CategoryFilter with vanilla JS that toggles card visibility via data-attributes -- no framework dependency
- Wired all components into EN and FR home pages with locale-aware dates, labels, and featured article deduplication
- Fixed script initialization pattern from astro:page-load (requires ClientRouter) to direct call + astro:after-swap

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FeaturedArticle, ArticleCard, and CategoryFilter components** - `afd5f8e` (feat)
2. **Task 2: Wire components into EN and FR home pages** - `fdc09e6` (feat)
3. **Task 3: Visual verification** - APPROVED (checkpoint, no commit)
4. **Fix: Script initialization pattern** - `ab8290c` (fix)

## Files Created/Modified

- `src/components/article/FeaturedArticle.astro` - Full-width featured article hero with image, metadata, title, description, tags
- `src/components/article/ArticleCard.astro` - Article card for grid with data-category attribute, lazy-loaded image, metadata, tags
- `src/components/article/CategoryFilter.astro` - Category filter button bar with inline JS for client-side filtering
- `src/pages/en/index.astro` - English home page with featured hero, filter bar, responsive article grid
- `src/pages/fr/index.astro` - French home page with locale-aware dates and labels
- `src/layouts/BaseLayout.astro` - Fixed scroll-reveal script initialization pattern

## Decisions Made

- **Category badge as inline span:** Used raw span with absolute positioning inside the image container instead of the Tag component, since Tag doesn't support absolute positioning context
- **Featured article deduplication:** Grid articles filtered by comparing `a.id !== featured.id` to prevent the featured article appearing twice
- **Script init pattern correction:** Changed from `astro:page-load` to direct call + `astro:after-swap` because `astro:page-load` only fires when ClientRouter (View Transitions) is active, which isn't added until Phase 6

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed script initialization using wrong event listener**
- **Found during:** Post-checkpoint verification (after Task 2)
- **Issue:** Both BaseLayout scroll-reveal and CategoryFilter used `document.addEventListener("astro:page-load", ...)` which only fires when Astro's ClientRouter (View Transitions) is active. Without ClientRouter, scripts never initialized -- scroll animations and category filtering were broken.
- **Fix:** Changed to `initFunction(); document.addEventListener("astro:after-swap", initFunction)` -- calls immediately on script parse, re-initializes on View Transitions page swap for future Phase 6 compatibility.
- **Files modified:** `src/layouts/BaseLayout.astro`, `src/components/article/CategoryFilter.astro`
- **Verification:** Category filter buttons respond to clicks, scroll-reveal animations trigger on scroll
- **Committed in:** `ab8290c`

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug fix)
**Impact on plan:** Essential fix -- without it, all client-side interactivity was non-functional. Also retroactively corrects the Phase 1 BaseLayout pattern.

## Issues Encountered

None beyond the deviation documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Home page complete with all three HOME requirements (HOME-01, HOME-02, HOME-03) delivered
- Phase 2 fully complete -- ready for Phase 3 (Article Page)
- Article data access layer, components, and patterns established for reuse in article detail page
- Script initialization pattern corrected for all existing and future inline scripts

## Self-Check: PASSED

- All 6 files: FOUND
- All 3 commits: FOUND (afd5f8e, fdc09e6, ab8290c)

---
*Phase: 02-home-page*
*Completed: 2026-02-09*
