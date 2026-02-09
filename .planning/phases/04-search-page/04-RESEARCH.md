# Phase 4: Search Page - Research

**Researched:** 2026-02-09
**Domain:** Pagefind custom JS API, Astro client-side search UI, URL state management
**Confidence:** MEDIUM-HIGH

## Summary

This phase implements a custom search page using Pagefind's JavaScript API (not the default widget) integrated with the site's existing design system. The project already has Pagefind 1.4.0 installed and running in the build pipeline (`pagefind --site dist`), and multilingual indexes are being generated automatically (`wasm.en.pagefind`, `wasm.fr.pagefind`). However, no `data-pagefind-body`, `data-pagefind-filter`, or `data-pagefind-meta` attributes exist anywhere in the codebase yet, so the article templates need instrumentation before Pagefind can produce useful search results.

The search page requires a hybrid rendering approach: server-render all articles via Astro for the initial "browse all" state (since Pagefind does not reliably support listing all indexed pages without a query), then switch to Pagefind-driven results when the user types a query or applies filters. This avoids a blank or loading state on initial page load and makes the page functional as a browsable article index. All interactive behavior (search, filter, grid/list toggle, URL sync) is client-side JavaScript within Astro `<script>` tags -- no framework needed.

**Primary recommendation:** Instrument the ArticleLayout with `data-pagefind-body`, `data-pagefind-filter`, and `data-pagefind-meta` attributes; build the search UI as vanilla JS in Astro script tags using Pagefind's `debouncedSearch()` API; server-render all articles for initial state; sync state bidirectionally with URLSearchParams.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Instant search as-you-type with debounce (no submit button)
- Initial state: search field empty + all articles displayed in grid (acts as browsable index)
- Empty results: simple message "Aucun resultat pour X" / "No results for X" -- no suggestions
- URL sync via query params (q, cat, tags) -- enables sharing, back/forward, and pre-filtering from other pages
- Grid mode reuses the existing ArticleCard component from home page (image, date, reading time, category, tags, excerpt)
- List mode: horizontal layout with thumbnail left, title + excerpt + metadata right (rich, not compact)
- Search terms highlighted in results (title and excerpt)
- Sort by Pagefind relevance score (no user-facing sort toggle)
- Sidebar on the left with category and tag filters
- Filters show article count per option (e.g., "IA (5)")
- Logic: AND between category and tags, OR within tags -- selecting category "IA" + tags ["Astro", "RAG"] returns IA articles with tag Astro OR RAG
- Active filters displayed as chips with x dismiss above results
- Pre-filtering: clicking a category or tag link from any page navigates to search with corresponding query params pre-applied
- Sidebar becomes a drawer/bottom sheet on small screens (triggered by a "Filtres" button)
- Grid/list toggle hidden on mobile -- list mode forced (more readable)
- Search field scrolls naturally with content (not sticky)

### Claude's Discretion
- Breakpoint choice for sidebar-to-drawer transition and forced list mode
- Debounce timing
- Drawer animation and close behavior
- Loading state while Pagefind indexes
- Grid column count at different breakpoints
- Exact chip styling and placement

### Deferred Ideas (OUT OF SCOPE)
None

</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Pagefind JS API | 1.4.0 (already installed) | Full-text search + filtering | Already in build pipeline; generates per-language indexes automatically |
| Vanilla JS (Astro script tags) | N/A | All client-side interactivity | Project pattern -- no framework for interactive islands; consistent with CategoryFilter, TOC mobile panel |
| URLSearchParams | Native Web API | URL state management | Zero-dependency, built into all browsers; sufficient for q/cat/tags params |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | | | All dependencies are already installed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla JS | Preact/Solid island | Overkill for this complexity; the project has no UI framework installed and all other interactive components use vanilla JS |
| URLSearchParams | nuqs / custom state lib | Only needed in React/Next; URLSearchParams is sufficient for a static site |
| @pagefind/modular-ui | Pagefind JS API directly | Modular UI adds opinions on rendering; we need full control for custom ArticleCard rendering |

**Installation:**
```bash
# Nothing to install -- Pagefind 1.4.0 already in devDependencies
# Verify with: npx pagefind --version
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  pages/
    en/search.astro          # EN search page (replaces placeholder)
    fr/search.astro           # FR search page (replaces placeholder)
  layouts/
    ArticleLayout.astro       # Add data-pagefind-body, data-pagefind-filter, data-pagefind-meta
    BaseLayout.astro          # No changes needed (already has <html lang={lang}>)
  components/
    article/
      ArticleCard.astro       # Existing -- reused for grid mode server-render
    search/
      SearchResults.astro     # Server-rendered initial article grid (all articles)
  lib/
    articles.ts               # May need getTags() helper for filter sidebar
  i18n/
    ui.ts                     # Add search-related translation keys
```

### Pattern 1: Hybrid Server-Render + Client-Side Search
**What:** Server-render all articles in Astro for the initial page state, then replace with Pagefind results when the user interacts.
**When to use:** When you need an initial "browse all" state but Pagefind requires a query to return results.
**Example:**
```astro
---
// search.astro frontmatter
import ArticleCard from "@/components/article/ArticleCard.astro";
import { getArticlesByLocale, getCategories } from "@/lib/articles";
const lang = getLangFromUrl(Astro.url);
const articles = await getArticlesByLocale(lang);
const categories = await getCategories(lang);
---

<!-- Server-rendered initial state -->
<div id="initial-articles" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {articles.map((article) => <ArticleCard article={article} />)}
</div>

<!-- Pagefind results container (hidden initially) -->
<div id="search-results" class="hidden"></div>

<script>
  // When user types or filters, hide #initial-articles, show #search-results
  // When query and filters are cleared, show #initial-articles again
</script>
```

### Pattern 2: Pagefind Lazy Init on Focus
**What:** Defer Pagefind initialization until the search input receives focus. This avoids loading the WASM bundle on initial page load.
**When to use:** Always -- standard Pagefind best practice.
**Example:**
```typescript
// Source: https://pagefind.app/docs/api/
let pagefind: any = null;

async function initPagefind() {
  if (pagefind) return pagefind;
  // Variable indirection prevents Vite from resolving at build time
  const pagefindPath = "/pagefind/pagefind.js";
  pagefind = await import(/* @vite-ignore */ pagefindPath);
  pagefind.init();
  return pagefind;
}

searchInput.addEventListener("focus", () => initPagefind(), { once: true });
```

### Pattern 3: Debounced Search with URL Sync
**What:** Use Pagefind's built-in `debouncedSearch()` with bidirectional URL sync.
**When to use:** For the main search interaction loop.
**Example:**
```typescript
// Source: https://pagefind.app/docs/api/
async function performSearch(query: string, filters: Record<string, string | string[]>) {
  const pf = await initPagefind();

  // Build Pagefind filter object
  const pfFilters: Record<string, any> = {};
  if (filters.cat) pfFilters.category = filters.cat;
  if (filters.tags?.length) pfFilters.tag = { any: filters.tags };

  const hasQuery = query.trim().length > 0;
  const hasFilters = Object.keys(pfFilters).length > 0;

  if (!hasQuery && !hasFilters) {
    // Show server-rendered initial state
    showInitialArticles();
    return;
  }

  // Use null for query-less filter-only searches
  const searchTerm = hasQuery ? query : null;
  const result = await pf.debouncedSearch(searchTerm, { filters: pfFilters }, 250);

  if (result === null) return; // Superseded by newer search

  renderResults(result);
}
```

### Pattern 4: URL State as Single Source of Truth
**What:** Read query params on load, write them on interaction, listen for popstate.
**When to use:** Always -- enables sharing, back/forward, and pre-filtering from external links.
**Example:**
```typescript
function readStateFromUrl(): SearchState {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") || "",
    category: params.get("cat") || "",
    tags: params.get("tags")?.split(",").filter(Boolean) || [],
  };
}

function writeStateToUrl(state: SearchState) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category) params.set("cat", state.category);
  if (state.tags.length) params.set("tags", state.tags.join(","));

  const url = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
  window.history.replaceState(null, "", url);
}

// On page load: read URL and apply
const initialState = readStateFromUrl();
applyState(initialState);

// On popstate (back/forward): read URL and apply
window.addEventListener("popstate", () => applyState(readStateFromUrl()));
```

### Anti-Patterns to Avoid
- **Using Pagefind Default UI or Modular UI:** They impose their own DOM structure and styling. The requirement is to use the site's existing design system (ArticleCard, Tag, etc.).
- **Importing pagefind.js as a string literal:** Vite will try to resolve it at build time and fail. Always use a variable: `const p = "/pagefind/pagefind.js"; await import(p);`
- **Using a UI framework (React/Preact/Solid) for the search island:** The project has no framework installed, and all existing interactive components use vanilla JS in Astro script tags. Adding a framework for one page would be inconsistent.
- **Fetching all result data() eagerly:** Each `result.data()` triggers a network request. Only load data for visible results (paginate or slice).
- **Relying on Pagefind to "list all" with empty query:** `pagefind.search("")` behavior is not well-documented. Use server-rendered articles for the initial state.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full-text search | Custom text indexing | Pagefind JS API | Handles stemming, ranking, excerpt generation, highlighting with `<mark>` tags, WASM-powered performance |
| Search term highlighting in excerpts | Regex-based highlighting | Pagefind's `excerpt` field (already has `<mark>` tags) | Pagefind returns excerpts with `<mark>` wrapping matched terms; safe for innerHTML |
| Debouncing | Custom setTimeout wrapper | `pagefind.debouncedSearch(query, options, timeout)` | Built-in, returns `null` when superseded by newer call; handles race conditions |
| Multilingual index separation | Manual language filtering | Pagefind automatic `<html lang>` detection | Pagefind creates per-language indexes and loads the right one based on the page's lang attribute |
| Filter count computation | Manual count from data | `pagefind.filters()` and search result `filters`/`totalFilters` objects | Pagefind returns filter counts as part of search results, including adjusted counts for current selections |

**Key insight:** Pagefind handles the hard parts (indexing, stemming, ranking, excerpt generation, highlighting, multilingual separation). The custom work is purely UI: rendering results in the site's design system and managing filter/URL state.

## Common Pitfalls

### Pitfall 1: Vite Tries to Resolve Pagefind Import at Build Time
**What goes wrong:** `import("/pagefind/pagefind.js")` with a string literal causes Vite to attempt static analysis and fail because the file only exists after Pagefind runs post-build.
**Why it happens:** Vite pre-bundles imports it can statically analyze.
**How to avoid:** Use variable indirection: `const p = "/pagefind/pagefind.js"; await import(/* @vite-ignore */ p);`
**Warning signs:** Build errors mentioning "Failed to resolve import" or "Could not load" pagefind.
**Source:** https://pyk.sh/blog/2025-10-21-vite-dynamic-import-trick

### Pitfall 2: data-pagefind-body Opt-In Gate
**What goes wrong:** Once ANY page has `data-pagefind-body`, all pages WITHOUT it are excluded from the index entirely.
**Why it happens:** Pagefind treats `data-pagefind-body` as an opt-in mechanism. If it appears anywhere on the site, only pages with it get indexed.
**How to avoid:** Add `data-pagefind-body` to every page that should be searchable (all article pages). Add `data-pagefind-ignore` to the search page itself to prevent it from appearing in its own results. Non-article pages (home, about) should probably not have `data-pagefind-body` since they're not useful search results.
**Warning signs:** Only some articles appear in search results; search returns zero results.
**Source:** https://pagefind.app/docs/indexing/

### Pitfall 3: No data-pagefind Attributes Exist Yet
**What goes wrong:** Currently Pagefind indexes the entire `<body>` of every page, including nav, footer, "Coming soon" placeholder text, and non-article pages. Search results will be noisy and lack filter/metadata support.
**Why it happens:** No instrumentation has been added to the article templates.
**How to avoid:** Phase 4 MUST add `data-pagefind-body` to the article content area, `data-pagefind-filter` for category and tags, and `data-pagefind-meta` for title, description, image, date, and readingTime on the ArticleLayout.
**Warning signs:** Search results include nav text, footer text, or non-article pages.

### Pitfall 4: Pagefind Metadata Returns Strings Only
**What goes wrong:** `data-pagefind-meta="date:2026-01-15"` returns `"2026-01-15"` as a string, not a Date object. Reading time returns `"8"` not `8`.
**Why it happens:** Pagefind stores all metadata as strings.
**How to avoid:** Parse metadata values when rendering: `new Date(result.meta.date)`, `parseInt(result.meta.readingTime, 10)`.
**Warning signs:** Dates display as raw strings; reading time comparisons fail.
**Source:** https://dee.underscore.world/blog/building-pagefind-ui/

### Pitfall 5: Search Results Cannot Reuse Server-Side ArticleCard
**What goes wrong:** Attempting to render Astro's `ArticleCard.astro` component from client-side JavaScript is impossible because Astro components are server-only.
**Why it happens:** ArticleCard is an Astro component that runs at build time. Client-side JS must construct DOM elements directly.
**How to avoid:** Create a client-side `renderArticleCard()` function that produces the same HTML structure as ArticleCard.astro but from Pagefind result data. Keep the markup and classes identical.
**Warning signs:** Trying to import .astro files in script tags; runtime errors.

### Pitfall 6: Filter Count Discrepancy Between Initial State and Search State
**What goes wrong:** The initial server-rendered article list shows filter counts from Astro data, but switching to Pagefind results shows different counts because Pagefind computes them differently.
**Why it happens:** Server-side counts use direct article data; Pagefind filter counts come from its index and reflect search term matching.
**How to avoid:** For the initial state (no query, no filters), compute filter counts from the server-rendered articles. When Pagefind is active, use the `filters` or `totalFilters` objects from search results.
**Warning signs:** Filter counts change unexpectedly when typing then clearing the search field.

### Pitfall 7: replaceState vs pushState for URL Sync
**What goes wrong:** Using `pushState` for every keystroke creates a huge browser history stack. User has to press back 50 times to leave the page.
**Why it happens:** Each search input character creates a new history entry.
**How to avoid:** Use `replaceState` for search input changes (typing). Use `pushState` only for discrete filter actions (clicking a filter chip). This way back/forward navigates between filter states, not between individual characters.
**Warning signs:** Browser back button requires many clicks to leave the search page.

### Pitfall 8: Pagefind Not Available in Dev Mode
**What goes wrong:** `import("/pagefind/pagefind.js")` fails in `astro dev` because the pagefind bundle only exists after `astro build && pagefind --site dist`.
**Why it happens:** Pagefind is a post-build tool; it does not run during development.
**How to avoid:** Wrap the Pagefind import in a try/catch. Show a graceful message in dev mode ("Search available in production build"). Or run `npm run build` once to generate the index, then reference it from `dist/pagefind/`.
**Warning signs:** Console errors about failed imports during `npm run dev`.

## Code Examples

### Pagefind Article Instrumentation (ArticleLayout.astro)
```astro
<!-- Source: https://pagefind.app/docs/indexing/, https://pagefind.app/docs/filtering/, https://pagefind.app/docs/metadata/ -->

<!-- In ArticleLayout.astro, wrap the article content -->
<article data-pagefind-body>
  <!-- Filter attributes (can be anywhere in the article, even in ignored sections) -->
  <meta data-pagefind-filter="category[content]" content={article.data.category} />
  {article.data.tags.map((tag) => (
    <meta data-pagefind-filter="tag[content]" content={tag} />
  ))}

  <!-- Metadata attributes -->
  <meta data-pagefind-meta="title[content]" content={article.data.title} />
  <meta data-pagefind-meta="description[content]" content={article.data.description} />
  <meta data-pagefind-meta="date[content]" content={article.data.date.toISOString()} />
  <meta data-pagefind-meta="readingTime[content]" content={String(article.data.readingTime)} />
  <meta data-pagefind-meta="image[content]" content={article.data.image || ""} />
  <meta data-pagefind-meta="url[content]" content={`/${article.data.lang}/articles/${article.id}`} />

  <ArticleHeader article={article} />
  <div class="prose max-w-none" id="article-content">
    <slot />
  </div>
</article>
```

### Pagefind Search Initialization
```typescript
// Source: https://pagefind.app/docs/api/, https://pyk.sh/blog/2025-10-21-vite-dynamic-import-trick
let pagefind: any = null;

async function initPagefind(): Promise<any> {
  if (pagefind) return pagefind;
  try {
    // Variable indirection prevents Vite static analysis
    const pagefindPath = "/pagefind/pagefind.js";
    pagefind = await import(/* @vite-ignore */ pagefindPath);
    pagefind.init();
    return pagefind;
  } catch {
    console.warn("Pagefind not available (run npm run build first)");
    return null;
  }
}
```

### Getting Filter Options with Counts
```typescript
// Source: https://pagefind.app/docs/js-api-filtering/
const pf = await initPagefind();
if (pf) {
  const filters = await pf.filters();
  // Returns: { category: { css: 2, "design-systems": 1, typescript: 1 }, tag: { css: 2, responsive: 1, ... } }
  renderFilterSidebar(filters);
}
```

### Performing Filtered Search
```typescript
// Source: https://pagefind.app/docs/js-api-filtering/
// AND between category and tags; OR within tags
const result = await pf.debouncedSearch(query || null, {
  filters: {
    category: "css",                           // single category (AND)
    tag: { any: ["responsive", "tailwind"] },  // OR within tags
  },
}, 250);

if (result === null) return; // Superseded by newer search

// result.results is an array of { id, data() }
// result.filters has adjusted counts for current search
// result.totalFilters has counts if filter replaced current selection
// result.unfilteredResultCount has total without any filters
```

### Loading and Rendering Result Data
```typescript
// Source: https://pagefind.app/docs/api/, https://pagefind.app/docs/js-api-metadata/
const PAGE_SIZE = 12;
const visibleResults = result.results.slice(0, PAGE_SIZE);
const loaded = await Promise.all(visibleResults.map(r => r.data()));

// Each loaded result contains:
// {
//   url: "/en/articles/en-css-container-queries",
//   excerpt: "Media queries respond to the <mark>viewport</mark>, not...",
//   meta: {
//     title: "CSS Container Queries",
//     description: "How container queries...",
//     image: "https://picsum.photos/...",
//     date: "2025-12-28T00:00:00.000Z",
//     readingTime: "10",
//     url: "/en/articles/en-css-container-queries"
//   },
//   filters: { category: ["css"], tag: ["css", "responsive"] },
//   word_count: 150
// }
```

### Client-Side Article Card Rendering (Grid Mode)
```typescript
// Mirror the markup from ArticleCard.astro
function renderGridCard(data: any, lang: string): string {
  const date = new Date(data.meta.date);
  const formattedDate = new Intl.DateTimeFormat(lang, {
    year: "numeric", month: "long", day: "numeric"
  }).format(date);
  const readingTime = data.meta.readingTime;
  const readLabel = lang === "fr" ? "min de lecture" : "min read";
  const tags = data.filters?.tag || [];
  const url = data.meta.url || data.url;

  return `
    <article class="group">
      <a href="${url}" class="block">
        <div class="relative overflow-hidden rounded-xs border border-border group-hover:border-teal/30 transition-colors mb-4">
          ${data.meta.image
            ? `<img src="${data.meta.image}" alt="${escapeHtml(data.meta.title)}" class="w-full aspect-[16/10] object-cover opacity-75 group-hover:opacity-100 transition-opacity" loading="lazy" />`
            : `<div class="w-full aspect-[16/10] bg-surface flex items-center justify-center"><span class="text-3xl font-code text-text-muted">&gt;_</span></div>`
          }
          <div class="absolute inset-0 bg-linear-to-t from-canvas/40 to-transparent"></div>
          <span class="absolute top-3 left-3 text-xs font-code text-teal bg-canvas/80 backdrop-blur-sm px-2.5 py-1 rounded-xs border border-teal/20">
            ${data.filters?.category?.[0] || ""}
          </span>
        </div>
        <div class="flex items-center gap-2 text-xs text-text-muted mb-2.5">
          <time class="tabular-nums">${formattedDate}</time>
          <span class="w-1 h-1 rounded-full bg-text-muted"></span>
          <span>${readingTime} ${readLabel}</span>
        </div>
        <h3 class="text-lg font-semibold leading-snug mb-2 group-hover:text-teal-bright transition-colors">
          ${data.excerpt ? highlightTitle(data.meta.title, data.excerpt) : escapeHtml(data.meta.title)}
        </h3>
        <p class="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
          ${data.excerpt || escapeHtml(data.meta.description)}
        </p>
        <div class="flex flex-wrap gap-2">
          ${tags.map((t: string) => `<span class="text-xs font-code px-2.5 py-1 rounded-xs border text-text-secondary border-border">${escapeHtml(t)}</span>`).join("")}
        </div>
      </a>
    </article>
  `;
}
```

### URL State Sync
```typescript
interface SearchState {
  query: string;
  category: string;
  tags: string[];
}

function readStateFromUrl(): SearchState {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") || "",
    category: params.get("cat") || "",
    tags: params.get("tags")?.split(",").filter(Boolean) || [],
  };
}

function writeStateToUrl(state: SearchState, push = false) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category) params.set("cat", state.category);
  if (state.tags.length) params.set("tags", state.tags.join(","));

  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? "?" + qs : ""}`;
  if (push) {
    window.history.pushState(null, "", url);
  } else {
    window.history.replaceState(null, "", url);
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PagefindUI default widget | Pagefind JS API + custom rendering | Always available | Full design system control |
| `@pagefind/default-ui` npm package | Direct `import("/pagefind/pagefind.js")` | N/A | No extra dependency; smaller bundle |
| `entry.render()` | `import { render } from 'astro:content'` | Astro 5 | Must use new render API in article page |
| `entry.slug` | `entry.id` | Astro 5 | URL generation uses `.id` not `.slug` |

**Deprecated/outdated:**
- PagefindUI CSS classes and DOM structure: Not relevant since we are using the JS API directly
- `@astrojs/tailwind`: Replaced by `@tailwindcss/vite` in this project

## Pagefind Multilingual Behavior (Critical)

Pagefind automatically detects the `lang` attribute on the `<html>` element and creates separate indexes per language. When the search page loads, Pagefind checks `<html lang="en">` or `<html lang="fr">` and loads only the matching index. This means:

- EN search page only searches EN articles
- FR search page only searches FR articles
- No manual language filtering needed
- The BaseLayout already sets `<html lang={lang}>` correctly

**Source:** https://pagefind.app/docs/multilingual/

## Pagefind Filter System (Critical)

### How Filters Work
- `data-pagefind-filter="category"` on an element captures its text content as a filter value
- `data-pagefind-filter="category[content]"` captures from the `content` attribute (useful with `<meta>`)
- Multiple `data-pagefind-filter="tag"` on different elements creates an array of values for one page
- `pagefind.filters()` returns all filter values with counts: `{ category: { css: 2 }, tag: { responsive: 1 } }`
- `pagefind.search(query, { filters: { tag: { any: ["a", "b"] } } })` uses OR within a filter
- Default filter logic is AND between different filter keys

### Filter Counts in Search Results
Search results include three count objects:
- `filters`: counts if the filter were ADDED to current selections
- `totalFilters`: counts if the filter REPLACED current selections
- `unfilteredResultCount`: total results for just the search term

Use `totalFilters` for the sidebar counts (shows how many results each filter value would produce independently).

**Source:** https://pagefind.app/docs/js-api-filtering/

## Key Technical Decisions

### Breakpoint Recommendation (Claude's Discretion)
Use `lg` (1024px) as the breakpoint for sidebar-to-drawer transition and forced list mode. This is consistent with the existing ArticleLayout which uses `lg:grid lg:grid-cols-[1fr_240px]` for its sidebar and `lg:hidden` for mobile TOC elements.

### Debounce Timing Recommendation (Claude's Discretion)
Use 250ms for the Pagefind `debouncedSearch()` timeout. This is the sweet spot: fast enough to feel instant, slow enough to avoid excessive API calls. Pagefind's built-in debounce handles race conditions by returning `null` for superseded calls.

### Loading State Recommendation (Claude's Discretion)
Show a subtle skeleton/pulse animation on the results area during the first Pagefind initialization (WASM load). After initial load, searches are fast enough that no loading indicator is needed. Use the same surface/border colors as the design system.

### Grid Column Count Recommendation (Claude's Discretion)
- Mobile (<640px): 1 column
- SM (640px-1023px): 2 columns
- LG (1024px+): 3 columns
This matches the home page grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### Drawer Animation Recommendation (Claude's Discretion)
Reuse the same slide-in pattern from ArticleLayout's mobile TOC panel: overlay with backdrop blur, panel slides in from left (since sidebar is on the left), close on backdrop click or X button. Use the same transition classes: `translate-x` with `duration-300 ease-out`.

### Chip Styling Recommendation (Claude's Discretion)
Use the existing Tag component's "active" variant styling: `text-teal-bright border-teal/20 bg-teal-dim` with an X button appended. Place chips in a flex-wrap row between the search input and the results grid.

## Open Questions

1. **Pagefind search("") / search(null) for "browse all"**
   - What we know: `pagefind.search(null, { filters: ... })` is documented for filter-only searches. Empty string behavior is undocumented.
   - What's unclear: Whether `pagefind.search(null)` without filters returns all indexed pages or zero results.
   - Recommendation: Use the hybrid approach (server-render all articles for initial state). This is more robust and provides instant rendering without waiting for WASM initialization. Test `pagefind.search(null)` during implementation; if it works, it could simplify the filter-only code path.

2. **Filter counts for initial state**
   - What we know: `pagefind.filters()` returns counts for the full index.
   - What's unclear: Whether filter counts from `pagefind.filters()` match the server-rendered article counts exactly.
   - Recommendation: For initial state, compute counts from Astro data. Once Pagefind loads (on first interaction), use Pagefind's filter counts. They should match since the index is built from the same content.

3. **data-pagefind-filter on tags: array handling**
   - What we know: Multiple `data-pagefind-filter="tag"` elements on one page create multiple filter values.
   - What's unclear: Whether `<meta>` tags with the same `data-pagefind-filter="tag[content]"` attribute on the same page accumulate correctly.
   - Recommendation: Use multiple `<meta>` elements, one per tag. Test during implementation to confirm all tags appear in `pagefind.filters()`.

## Sources

### Primary (HIGH confidence)
- [Pagefind JS API](https://pagefind.app/docs/api/) - Search method, debouncedSearch, result data structure
- [Pagefind Filtering Setup](https://pagefind.app/docs/filtering/) - data-pagefind-filter attribute syntax
- [Pagefind JS Filtering API](https://pagefind.app/docs/js-api-filtering/) - Filter queries, AND/OR logic, filter counts
- [Pagefind Metadata](https://pagefind.app/docs/metadata/) - data-pagefind-meta attribute, default metadata
- [Pagefind Indexing](https://pagefind.app/docs/indexing/) - data-pagefind-body, data-pagefind-ignore
- [Pagefind Multilingual](https://pagefind.app/docs/multilingual/) - Automatic lang-based index separation
- [Pagefind Search Config](https://pagefind.app/docs/search-config/) - excerptLength, ranking, bundlePath

### Secondary (MEDIUM confidence)
- [Vite Dynamic Import Trick](https://pyk.sh/blog/2025-10-21-vite-dynamic-import-trick) - Variable indirection for Pagefind import
- [Astro + Pagefind Filtering (younagi.dev)](https://younagi.dev/blog/astro-with-pagefind-filtering-search/) - Custom UI implementation pattern
- [Building a Pagefind UI (dee.underscore.world)](https://dee.underscore.world/blog/building-pagefind-ui/) - Result data structure, metadata as strings
- [Pagefind Search in Astro (syntackle.com)](https://syntackle.com/blog/pagefind-search-in-astro-site/) - Lazy init pattern, Vite config

### Tertiary (LOW confidence)
- Pagefind `search(null)` behavior for "browse all" - undocumented, needs testing

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Pagefind already installed and producing indexes; no new dependencies needed
- Architecture (hybrid server-render + client search): HIGH - Well-established pattern; consistent with project's vanilla JS approach
- Pagefind JS API (search, filters, metadata): HIGH - Verified against official docs
- Pagefind indexing attributes: HIGH - Official documentation is comprehensive and consistent
- Vite import workaround: MEDIUM - Multiple sources confirm the variable indirection trick
- Client-side ArticleCard rendering: MEDIUM - Must manually mirror Astro component markup; risk of drift
- Pagefind null/empty query behavior: LOW - Undocumented; hybrid approach mitigates this risk

**Research date:** 2026-02-09
**Valid until:** 2026-03-11 (Pagefind 1.4.x is stable; Astro 5.x is stable)
