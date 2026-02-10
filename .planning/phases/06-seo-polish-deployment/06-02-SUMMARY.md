---
phase: 06-seo-polish-deployment
plan: 02
subsystem: ui
tags: [view-transitions, client-router, astro-page-load, spa-navigation]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "BaseLayout with scroll reveal, Header, Footer"
  - phase: 02-home-page
    provides: "CategoryFilter, ArticleCard with scripts"
  - phase: 03-article-page
    provides: "ArticleLayout with TOC, ShareButtons, ReadingProgress, code block scripts"
  - phase: 04-search-page
    provides: "Search pages with Pagefind init scripts"
  - phase: 06-seo-polish-deployment
    provides: "SEO component in BaseLayout head (06-01)"
provides:
  - "ClientRouter active in BaseLayout enabling View Transitions with default fade"
  - "All 11 scripts migrated from direct-call+after-swap to astro:page-load pattern"
  - "Zero astro:after-swap references in codebase"
affects: [06-seo-polish-deployment]

# Tech tracking
tech-stack:
  added: ["astro:transitions (ClientRouter)"]
  patterns: ["astro:page-load event handler for all client scripts", "Consolidated script blocks per layout"]

key-files:
  created: []
  modified:
    - "src/layouts/BaseLayout.astro"
    - "src/layouts/ArticleLayout.astro"
    - "src/components/article/TableOfContents.astro"
    - "src/components/article/ShareButtons.astro"
    - "src/components/article/CategoryFilter.astro"
    - "src/components/ui/ReadingProgress.astro"
    - "src/pages/en/search.astro"
    - "src/pages/fr/search.astro"

key-decisions:
  - "Consolidated ArticleLayout 4 separate script blocks into single astro:page-load handler with IIFEs"
  - "Search pages keep initSearch as named function inside page-load for readability (1200+ lines)"
  - "ReadingProgress scroll listener accumulation accepted as harmless (early-return on missing elements)"

patterns-established:
  - "astro:page-load pattern: all client scripts use document.addEventListener('astro:page-load', () => {}) instead of direct call + astro:after-swap"
  - "Script consolidation: multiple related scripts in same layout consolidated into single script block with IIFEs"

# Metrics
duration: 3min
completed: 2026-02-10
---

# Phase 6 Plan 2: View Transitions Summary

**ClientRouter with default fade transitions and all 11 scripts migrated from after-swap to astro:page-load**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-10T19:57:19Z
- **Completed:** 2026-02-10T20:00:40Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- ClientRouter imported and active in BaseLayout head, enabling SPA-style View Transitions with default fade animation
- All 11 scripts across 8 files migrated from `direct call + astro:after-swap` to `astro:page-load` event pattern
- Zero `astro:after-swap` references remain anywhere in `src/`
- ArticleLayout's 4 script blocks consolidated into one clean handler with IIFEs

## Task Commits

Each task was committed atomically:

1. **Task 1: Add ClientRouter to BaseLayout and migrate BaseLayout + ArticleLayout scripts** - `606279b` (feat)
2. **Task 2: Migrate remaining 5 component/page scripts to astro:page-load** - `6b96e6a` (feat)

## Files Created/Modified
- `src/layouts/BaseLayout.astro` - Added ClientRouter import and rendering, migrated initScrollReveal to page-load
- `src/layouts/ArticleLayout.astro` - Consolidated 4 scripts into single page-load handler (heading anchor copy, code block headers, mobile code copy, mobile TOC)
- `src/components/article/TableOfContents.astro` - Migrated initScrollSpy to page-load
- `src/components/article/ShareButtons.astro` - Migrated initCopyLink to page-load
- `src/components/article/CategoryFilter.astro` - Migrated initCategoryFilter to page-load
- `src/components/ui/ReadingProgress.astro` - Migrated initReadingProgress to page-load
- `src/pages/en/search.astro` - Migrated initSearch to page-load
- `src/pages/fr/search.astro` - Migrated initSearch to page-load

## Decisions Made
- Consolidated ArticleLayout's 4 separate `<script>` blocks into a single block with one `astro:page-load` listener containing 4 IIFEs -- cleaner than 4 separate listeners
- For search pages, kept `initSearch` as a named function called inside page-load handler (rather than inlining the 1200+ line body directly) for readability
- Accepted ReadingProgress scroll listener accumulation across navigations as harmless -- stale listeners on non-article pages early-return due to null checks on `#reading-progress` and `article` elements

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prettier formatting required after ArticleLayout consolidation**
- **Found during:** Task 1
- **Issue:** Consolidating 4 script blocks into one changed indentation, Prettier reformatted
- **Fix:** Ran `npx prettier --write` before commit
- **Files modified:** src/layouts/ArticleLayout.astro
- **Verification:** Pre-commit hook passed
- **Committed in:** 606279b

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Formatting-only fix, no scope change.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- View Transitions active with default fade animation across all pages
- All scripts correctly re-initialize after client-side navigation
- Ready for remaining Phase 6 plans (deployment polish, final verification)

## Self-Check: PASSED

- All 8 modified files verified on disk
- Both task commits (606279b, 6b96e6a) verified in git log
- Build passes cleanly
- Lint passes (0 errors)
- All 37 unit tests pass
- Zero astro:after-swap references in src/
- 8 astro:page-load references across all expected files
- ClientRouter imported and rendered in BaseLayout head

---
*Phase: 06-seo-polish-deployment*
*Completed: 2026-02-10*
