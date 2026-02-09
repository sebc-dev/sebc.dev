# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Le site incarne les valeurs defendues (UX, performance, qualite) tout en permettant une publication reguliere d'articles. Le medium est le message.
**Current focus:** Phase 4 - Search Page (in progress)

## Current Position

Phase: 4 of 6 (Search Page)
Plan: 1 of 3 in current phase (COMPLETE)
Status: Plan 04-01 complete. Pagefind indexing instrumented. Ready for Plan 04-02.
Last activity: 2026-02-09 -- Completed 04-01-PLAN.md (Pagefind indexing)

Progress: [██████████░] 53%

## Performance Metrics

**Velocity:**
- Total plans completed: 8
- Average duration: 9min
- Total execution time: 1.24 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 9min | 3min |
| 02-home-page | 2 | 12min | 6min |
| 03-article-page | 2 | 47min | 24min |
| 04-search-page | 1 | 3min | 3min |

**Recent Trend:**
- Last 5 plans: 02-02 (8min), 03-01 (2min), 03-02 (45min), 04-01 (3min)
- Trend: 04-01 fast -- data attribute instrumentation + i18n strings only

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: 6 phases derived from 36 requirements following strict dependency chain (foundation -> pages by reuse order -> polish)
- [Roadmap]: SEO requirements grouped in final phase for cross-page consistency verification
- [Roadmap]: Responsive (INFR-03) and contrast (INFR-04) placed in Phase 1 as foundational constraints
- [01-01]: Followed official Astro i18n recipe pattern -- no custom abstractions for 2 languages
- [01-01]: GlowLine accepts optional class prop for flexible composition across components
- [01-02]: Used text-teal-bright (not text-teal) for logo and active states -- WCAG AA on all backgrounds
- [01-02]: Social icons use text-secondary hover:text-teal-bright instead of mockup text-muted for WCAG
- [01-02]: LangSwitch renders as anchor tags since each option navigates to a localized URL
- [01-03]: BaseLayout uses min-h-screen flex-col pattern to push footer to bottom on short pages
- [01-03]: ~~Scroll-reveal script wrapped in astro:page-load event~~ CORRECTED in 02-02: use direct call + astro:after-swap
- [01-03]: Root 404 page defaults to English since it handles unprefixed URLs
- [02-01]: Flat article file structure ({lang}-{slug}.mdx) to prevent entry.id path separator issues
- [02-01]: Featured article fallback to most recent when none marked featured: true
- [02-01]: Intl.DateTimeFormat over date-fns/dayjs -- zero dependencies for locale-aware dates
- [02-02]: Category badge as inline span (not Tag component) for absolute positioning inside image container
- [02-02]: Script init pattern: direct call + astro:after-swap (not astro:page-load which requires ClientRouter)
- [02-02]: Featured article excluded from grid via ID comparison to prevent duplication
- [03-01]: EC placed before mdx() integration (EC must process code blocks before MDX)
- [03-01]: Removed markdown.shikiConfig (replaced by EC configuration)
- [03-01]: Removed pre.astro-code CSS selector (EC uses figure wrapper structure)
- [03-01]: Related articles scored by category (+2) and tag overlap (+1 per shared tag)
- [04-01]: Pagefind meta tags placed inside article element before ArticleHeader for clean DOM order
- [04-01]: data-pagefind-ignore added to search pages proactively to prevent self-indexing

### Pending Todos

None yet.

### Blockers/Concerns

- [Research]: Pagefind custom search UI integration with Astro is MEDIUM confidence -- may need API docs review during Phase 4 planning
- [Research]: About page mockup (about.html) must be redesigned -- do not implement as-is
- [Research]: Trailing slash config must be validated on Cloudflare Pages staging early

## Session Continuity

Last session: 2026-02-09
Stopped at: Completed 04-01-PLAN.md (Pagefind indexing instrumentation)
Resume file: Ready for /gsd:execute-phase 4 (plan 02 next)
