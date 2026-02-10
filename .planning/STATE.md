# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-09)

**Core value:** Le site incarne les valeurs defendues (UX, performance, qualite) tout en permettant une publication reguliere d'articles. Le medium est le message.
**Current focus:** Phase 6 - SEO, Polish & Deployment (IN PROGRESS)

## Current Position

Phase: 6 of 6 (Polish & SEO)
Plan: 3 of ? in current phase (READY TO START)
Status: Plan 06-02 (View Transitions) complete. ClientRouter active, all 11 scripts migrated to astro:page-load.
Last activity: 2026-02-10 -- Plan 06-02 complete in 3min, View Transitions enabled

Progress: [████████████████] 87%

## Performance Metrics

**Velocity:**
- Total plans completed: 13
- Average duration: 8min
- Total execution time: ~1.8 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 9min | 3min |
| 02-home-page | 2 | 12min | 6min |
| 03-article-page | 2 | 47min | 24min |
| 04-search-page | 3 | 25min | 8min |
| 05-about-page | 2 | 12min | 6min |
| 06-seo-polish-deployment | 2 | 8min | 4min |

**Recent Trend:**
- Last 5 plans: 04-03 (16min), 05-01 (4min), 05-02 (8min), 06-01 (5min), 06-02 (3min)
- Trend: Fast execution, View Transitions migration was mechanical pattern replacement

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
- [04-02]: Pagefind lazy init on focus via variable indirection import pattern
- [04-02]: Server-rendered initial state for all articles (Pagefind needs query/filter to return results)
- [04-02]: Mobile drawer slides from left matching sidebar position
- [04-02]: Safe DOM reference pattern with const aliases after null guard for ESLint compliance
- [04-02]: Filter counts server-computed initially, then updated from Pagefind totalFilters
- [04-03]: Stretch-link pattern for ArticleCard and FeaturedArticle (no nested anchors)
- [04-03]: Custom calendar picker instead of native date input (dark theme consistency)
- [04-03]: Date/reading time filters are post-Pagefind (client-side filtering on loaded results)
- [04-03]: Grid/list toggle initializes Pagefind on first click in initial state
- [05-01]: Pillar tags indexed in same 'tag' namespace as regular tags for simplicity (no search page JS changes needed)
- [05-01]: All about.* i18n text values are placeholders (user will provide real content later per locked decision)
- [05-01]: PillarBlock component uses getPillarColorClass for pillar-specific styling
- [05-02]: CTA link removes trailing slash (/{lang} not /{lang}/) to prevent 404s on Cloudflare Pages
- [05-02]: Hero section intentionally structures philosophy (tagline+intro) separately from bio paragraph (mt-6 spacing) per locked decision
- [06-01]: Astro.site fallback pattern (Astro.site ?? new URL) instead of non-null assertions for ESLint compliance
- [06-01]: x-default hreflang always points to English version per SEO best practice
- [06-01]: translationMap computed via path replacement for static pages, translationSlug for articles
- [06-01]: RSS descriptions use double dashes (--) not em dashes to avoid XML encoding issues
- [06-02]: Consolidated ArticleLayout 4 script blocks into single astro:page-load handler with IIFEs
- [06-02]: Search pages keep initSearch as named function inside page-load for readability
- [06-02]: Script init pattern now astro:page-load (supersedes 02-02 after-swap pattern since ClientRouter is active)

### Pending Todos

None yet.

### Blockers/Concerns

- [Research]: ~~Pagefind custom search UI integration with Astro is MEDIUM confidence~~ RESOLVED in 04-02
- [Research]: About page mockup (about.html) must be redesigned -- do not implement as-is
- [Research]: Trailing slash config must be validated on Cloudflare Pages staging early

## Session Continuity

Last session: 2026-02-10
Stopped at: Completed 06-02-PLAN.md
Resume file: Continue with next plan in phase 06
