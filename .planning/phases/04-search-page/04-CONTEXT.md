# Phase 4: Search Page - Context

**Gathered:** 2026-02-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Custom Pagefind search UI for full-text article search with category/tag filters, grid/list toggle, and URL-based state for shareability. Uses the site's design system — not the default Pagefind widget. Pre-filtering from category/tag links on other pages is in scope.

</domain>

<decisions>
## Implementation Decisions

### Search experience
- Instant search as-you-type with debounce (no submit button)
- Initial state: search field empty + all articles displayed in grid (acts as browsable index)
- Empty results: simple message "Aucun résultat pour X" / "No results for X" — no suggestions
- URL sync via query params (q, cat, tags) — enables sharing, back/forward, and pre-filtering from other pages

### Results presentation
- Grid mode reuses the existing ArticleCard component from home page (image, date, reading time, category, tags, excerpt)
- List mode: horizontal layout with thumbnail left, title + excerpt + metadata right (rich, not compact)
- Search terms highlighted in results (title and excerpt)
- Sort by Pagefind relevance score (no user-facing sort toggle)

### Filters and navigation
- Sidebar on the left with category and tag filters
- Filters show article count per option (e.g., "IA (5)")
- Logic: AND between category and tags, OR within tags — selecting category "IA" + tags ["Astro", "RAG"] returns IA articles with tag Astro OR RAG
- Active filters displayed as chips with × dismiss above results
- Pre-filtering: clicking a category or tag link from any page navigates to search with corresponding query params pre-applied

### Mobile responsiveness
- Sidebar becomes a drawer/bottom sheet on small screens (triggered by a "Filtres" button)
- Grid/list toggle hidden on mobile — list mode forced (more readable)
- Search field scrolls naturally with content (not sticky)
- Breakpoint for sidebar→drawer and forced list mode: Claude's discretion

### Claude's Discretion
- Breakpoint choice for sidebar→drawer transition and forced list mode
- Debounce timing
- Drawer animation and close behavior
- Loading state while Pagefind indexes
- Grid column count at different breakpoints
- Exact chip styling and placement

</decisions>

<specifics>
## Specific Ideas

- Initial page state as full article index makes the search page useful even without a query — it doubles as an "all articles" browse page
- The ArticleCard reuse ensures visual consistency between home and search pages
- URL sync is essential for the pre-filtering requirement (clicking category/tag from article page → search page with filter)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-search-page*
*Context gathered: 2026-02-09*
