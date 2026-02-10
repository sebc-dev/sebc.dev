---
phase: 04-search-page
plan: 03
subsystem: ui
tags: [search, filters, calendar, pre-filter, verification]

# Dependency graph
requires:
  - phase: 04-search-page
    plan: 02
    provides: Complete EN/FR search pages with Pagefind integration
provides:
  - Cross-page pre-filter links from category badges and tags
  - Date range filter with custom calendar picker
  - Reading time range slider filter
  - Human-verified end-to-end search experience
---

## What Changed

### Task 1: Pre-filter links + enhanced filters
**Commit:** `609b203` feat(04-03): add search pre-filter links to category badges and tags
**Commit:** `1df2ec7` feat(04-03): add date/reading time filters, custom calendar, FeaturedArticle pre-filter links

### Task 2: Visual verification
**Status:** Approved by human after iterative fixes

## Key Files

### Created
(none)

### Modified
- `src/components/article/FeaturedArticle.astro` — Stretch-link pattern, category badge and tags link to search
- `src/components/article/ArticleCard.astro` — Category badge links to search with ?cat= param
- `src/components/article/ArticleHeader.astro` — Tags link to search with ?tags= param
- `src/components/ui/Tag.astro` — Optional href prop (renders <a> when provided, <span> when not)
- `src/layouts/ArticleLayout.astro` — Sidebar tags link to search
- `src/pages/en/search.astro` — Date range filter, reading time slider, custom calendar, grid/list fix
- `src/pages/fr/search.astro` — Same as EN (synced)
- `src/i18n/ui.ts` — Added search.dateRange, search.dateFrom, search.dateTo, search.readingTime, search.minutes

## Deviations

1. **Nested anchor fix**: Plan suggested `<a>` inside `<a>` for ArticleCard — used stretch-link pattern instead
2. **FeaturedArticle not in plan**: Component had same nested anchor issue, applied same stretch-link fix
3. **Date/reading time filters**: Added at user request during verification (not in original plan)
4. **Custom calendar**: Native browser date picker didn't match dark theme — built custom dropdown calendar
5. **Removed filter counts**: Removed article count from category/tag buttons at user request
6. **Grid/list toggle fix**: Toggle didn't work in initial state — added Pagefind fallback on first toggle

## Self-Check: PASSED
- [x] Category badges link to search with ?cat= across all components
- [x] Tags link to search with ?tags= across all components
- [x] Tag component backward compatible (no href = span)
- [x] Date range filter with custom dark-themed calendar
- [x] Reading time dual-thumb range slider
- [x] All filters sync URL, chips, desktop/mobile
- [x] Grid/list toggle works in all states
- [x] Human verification passed
