# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Le site incarne les valeurs defendues (UX, performance, qualite) tout en permettant une publication reguliere d'articles. Le medium est le message.
**Current focus:** Phase 3 - Article Page

## Current Position

Phase: 3 of 6 (Article Page) -- IN PROGRESS
Plan: 1 of 2 in current phase
Status: Article page foundation complete -- EC, rehype, data layer, i18n configured
Last activity: 2026-02-09 -- Completed 03-01-PLAN.md (Article Page Foundation)

Progress: [███████░░░] 41%

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 4min
- Total execution time: 0.59 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 9min | 3min |
| 02-home-page | 2 | 12min | 6min |
| 03-article-page | 1 | 2min | 2min |

**Recent Trend:**
- Last 5 plans: 01-03 (5min), 02-01 (4min), 02-02 (8min), 03-01 (2min)
- Trend: Consistent

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

### Pending Todos

None yet.

### Blockers/Concerns

- [Research]: Pagefind custom search UI integration with Astro is MEDIUM confidence -- may need API docs review during Phase 4 planning
- [Research]: About page mockup (about.html) must be redesigned -- do not implement as-is
- [Research]: Trailing slash config must be validated on Cloudflare Pages staging early

## Session Continuity

Last session: 2026-02-09
Stopped at: Completed 03-01-PLAN.md (Article Page Foundation)
Resume file: Ready for 03-02-PLAN.md (Article Page Components)
