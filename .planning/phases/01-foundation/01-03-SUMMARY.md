---
phase: 01-foundation
plan: 03
subsystem: ui
tags: [astro, layout, i18n, navigation]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: i18n middleware, routing structure (01-01); Header, Footer, Nav, LangSwitch components (01-02)
provides:
  - BaseLayout with integrated Header/Footer shell
  - View Transitions-ready scroll-reveal script
  - All route placeholders (en/fr: index, about, search)
  - Root 404 fallback page
  - Fully navigable bilingual site shell
affects: [02-pages, 03-pillar-articles, 04-search]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "BaseLayout flex-col pattern: min-h-screen flex flex-col body, flex-1 main, auto footer"
    - "Scroll-reveal with View Transitions: astro:page-load event + initScrollReveal function + :not(.in-view) selector"
    - "Placeholder page pattern: BaseLayout + single section with fade-up + 'Coming soon' content"

key-files:
  created:
    - src/pages/en/about.astro
    - src/pages/fr/about.astro
    - src/pages/en/search.astro
    - src/pages/fr/search.astro
    - src/pages/404.astro
  modified:
    - src/layouts/BaseLayout.astro
    - src/pages/en/index.astro
    - src/pages/fr/index.astro

key-decisions:
  - "BaseLayout uses flex-col min-h-screen pattern to push footer to bottom on short pages"
  - "Scroll-reveal script wrapped in astro:page-load event for View Transitions compatibility"
  - "404 page uses English as root fallback for unprefixed URLs"
  - "Placeholder pages kept minimal (<15 lines) -- exist solely for navigation targets"

patterns-established:
  - "View Transitions-ready animation: use astro:page-load event, named init function, :not(.in-view) selector to prevent re-animation"
  - "Sticky footer layout: body min-h-screen flex flex-col, main flex-1, footer auto"

# Metrics
duration: 5min
completed: 2026-02-09
---

# Phase 1 Plan 3: BaseLayout Integration Summary

**Complete site shell with sticky header, footer, bilingual navigation, placeholder routes, and View Transitions-ready scroll-reveal animations**

## Performance

- **Duration:** 5 min (Task 1: 2 min execution, Task 2: 3 min checkpoint verification)
- **Started:** 2026-02-09T09:40:00Z
- **Completed:** 2026-02-09T09:45:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- BaseLayout now renders Header and Footer on every page with sticky header and flex-col footer-to-bottom layout
- All six route placeholders created (en/fr: index, about, search) -- navigation links work bidirectionally
- Root 404 fallback page handles unprefixed URLs in English
- Scroll-reveal script updated for View Transitions compatibility (astro:page-load event, :not(.in-view) selector)
- Language switching preserves page type across locales

## Task Commits

Each task was committed atomically:

1. **Task 1: Integrate layout shell into BaseLayout and update pages** - `db41c21` (feat)
2. **Task 2: Visual verification of layout shell** - Checkpoint approved by user

**Plan metadata:** (this commit)

## Files Created/Modified
- `src/layouts/BaseLayout.astro` - Integrated Header/Footer, added min-h-screen flex-col layout, updated scroll-reveal for View Transitions
- `src/pages/en/index.astro` - Added fade-up class to hero section
- `src/pages/fr/index.astro` - Added fade-up class to hero section
- `src/pages/en/about.astro` - Placeholder page with "Coming soon"
- `src/pages/fr/about.astro` - Placeholder page with "A venir"
- `src/pages/en/search.astro` - Placeholder page for search functionality
- `src/pages/fr/search.astro` - Placeholder page for recherche functionality
- `src/pages/404.astro` - Root fallback with centered 404 message in English

## Decisions Made
- BaseLayout uses `min-h-screen flex flex-col` pattern on body with `flex-1` on main to push footer to bottom on short pages
- Scroll-reveal script wrapped in named `initScrollReveal()` function and attached to `astro:page-load` event for View Transitions compatibility
- Observer uses `:not(.in-view)` selector to prevent re-animation on subsequent page loads
- Root 404 page defaults to English since it handles unprefixed URLs
- All placeholder pages kept minimal (<15 lines) -- exist solely as navigation targets, will be populated in Phase 2

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 1 (Foundation) Complete.**

All foundation work is complete:
- i18n routing with EN/FR locales (01-01)
- Layout components: Header, Footer, Nav, LangSwitch, GlowLine (01-02)
- BaseLayout shell with all route placeholders (01-03)

Ready for Phase 2 (Home Page):
- BaseLayout provides consistent shell for home page content
- Scroll-reveal animation pattern established
- Navigation and language switching fully functional
- Responsive layout from 375px to desktop

**User checkpoint feedback:** User approved visual verification. Noted that placeholder pages are empty so scroll-reveal can't be fully tested on those pages yet, but confirmed structural elements (header, footer, nav, lang switch, 404) are working correctly.

---
*Phase: 01-foundation*
*Completed: 2026-02-09*
