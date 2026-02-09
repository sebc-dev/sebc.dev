# Architecture Research

**Domain:** Astro 5 blog technique personnel -- component architecture for pages and components
**Researched:** 2026-02-09
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
BUILD TIME (Astro SSG)
===================================================================

Pages Layer (src/pages/)
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │  Home Page    │ │ Article Page │ │ Search Page  │ │ About Page   │
  │  [locale]/    │ │ [locale]/    │ │ [locale]/    │ │ [locale]/    │
  │  index.astro  │ │ articles/    │ │ search.astro │ │ about.astro  │
  │               │ │ [...id].astro│ │              │ │              │
  └──────┬────────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
         │                 │                │                │
Layout Layer (src/layouts/)│                │                │
  ┌──────┴─────────────────┴────────────────┴────────────────┴──────┐
  │                        BaseLayout.astro                         │
  │  (HTML shell, <head>, fonts, global styles, IntersectionObs)    │
  ├─────────────────────────────────────────────────────────────────┤
  │                     ArticleLayout.astro                         │
  │  (extends BaseLayout, adds sidebar TOC/share + article grid)    │
  └──────────────────────────┬──────────────────────────────────────┘
                             │
Component Layer (src/components/)
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ layout/  │ │  ui/     │ │ article/ │ │ search/  │ │  about/  │
  │ Header   │ │ Tag      │ │ Card     │ │ Search   │ │ Hero     │
  │ Footer   │ │ GlowLine │ │ TOC  *   │ │ Input *  │ │ Timeline │
  │ Nav      │ │ Paginate │ │ Progress*│ │ Filters *│ │ TechGrid │
  │ LangSwitch││ CategoryBtns│ Share *│ │ Results  │ │ Projects │
  └──────────┘ └──────────┘ │ Related │ │ ViewToggle*│ Philosophy│
                            │ CoverImg │ │ Empty    │ │ CTA      │
                            │ Meta     │ └──────────┘ └──────────┘
                            └──────────┘
  (* = needs client-side JS -- island or inline <script>)

Data Layer
  ┌──────────────────────────────────────────────────────────────────┐
  │  src/content.config.ts   (articles collection + Zod schema)      │
  │  src/i18n/ui.ts          (UI string translations EN/FR)          │
  │  src/i18n/utils.ts       (getLangFromUrl, useTranslations)       │
  │  src/lib/articles.ts     (getArticlesByLocale, getRelated, etc.) │
  └──────────────────────────────────────────────────────────────────┘

Styling Layer
  ┌──────────────────────────────────────────────────────────────────┐
  │  src/styles/global.css   (Tailwind v4 @theme, prose, animations) │
  └──────────────────────────────────────────────────────────────────┘

RUNTIME (Browser -- only for islands)
===================================================================
  ┌──────────────────┐  ┌──────────────────┐
  │ TOC ScrollSpy    │  │ Search Page      │
  │ (IntersectionObs)│  │ (Pagefind JS API)│
  │ Reading Progress │  │ Filter state     │
  │ Code Copy        │  │ View toggle      │
  │ Share clipboard  │  │ Cmd+K shortcut   │
  └──────────────────┘  └──────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **BaseLayout** | HTML shell, `<head>`, fonts, global CSS, IntersectionObserver for fade-up animations | Astro layout with `<slot />`, receives `title` + `description` props |
| **ArticleLayout** | Extends BaseLayout, adds sidebar grid (TOC + share + tags), article prose container, reading progress bar | Astro layout wrapping BaseLayout, receives article metadata as props |
| **Header** | Sticky nav bar with logo, navigation links, language switcher | Pure Astro component, no JS. i18n-aware links via `useTranslations` |
| **Footer** | Site branding, social links, legal links, glow separator | Pure Astro component, no JS |
| **Nav** | Navigation links with active state detection | Pure Astro, uses `Astro.url.pathname` to set active class |
| **LangSwitch** | EN/FR toggle links, highlights current locale | Pure Astro, uses `Astro.currentLocale` and builds alternate URL |
| **ArticleCard** | Card rendering for article in grid/list view (image, category badge, date, reading time, title, excerpt, tags) | Pure Astro, receives article entry as prop |
| **FeaturedArticle** | Full-width featured article at top of home page | Pure Astro, larger variant of card pattern |
| **TOC** | Table of contents sidebar with scroll spy highlighting | Astro component with inline `<script>` for IntersectionObserver |
| **ReadingProgress** | Reading progress bar (top bar + sidebar percentage) | Astro component with inline `<script>` for scroll tracking |
| **ShareButtons** | Twitter, LinkedIn, Copy-link buttons | Astro component, copy-link uses inline `<script>` for clipboard API |
| **SearchInput** | Full-text search input with Cmd+K shortcut | Inline `<script>` for keyboard shortcut + Pagefind initialization |
| **SearchFilters** | Category, tag, reading time, date filters sidebar | Inline `<script>` for filter state management + Pagefind filter API |
| **SearchResults** | Grid/list article results from Pagefind | Rendered by Pagefind JS or custom render from search API |
| **Tag** | Reusable tag/chip display component | Pure Astro, receives label + optional variant props |
| **GlowLine** | Decorative teal gradient horizontal line | Pure Astro, single `<div>` with CSS class |
| **Pagination** | Page navigation for article lists | Pure Astro, generates static pagination links |
| **CategoryFilters** | Horizontal scrollable filter button bar on home page | Pure Astro for static rendering; home page uses static pre-built pages per category OR inline `<script>` for client filtering |

## Recommended Project Structure

```
src/
├── components/
│   ├── layout/              # Shell components shared by all pages
│   │   ├── Header.astro     # Sticky header with nav + lang switch
│   │   ├── Footer.astro     # Site footer with social links
│   │   ├── Nav.astro        # Navigation links with active states
│   │   └── LangSwitch.astro # EN/FR locale toggle
│   │
│   ├── ui/                  # Reusable atomic UI components
│   │   ├── Tag.astro        # Tag/chip display (category, article tags)
│   │   ├── GlowLine.astro   # Decorative teal gradient line
│   │   ├── Pagination.astro # Page navigation controls
│   │   └── Icon.astro       # SVG icon wrapper (optional)
│   │
│   ├── article/             # Article-specific components
│   │   ├── ArticleCard.astro      # Card for grid/list views
│   │   ├── FeaturedArticle.astro  # Full-width hero card for latest article
│   │   ├── ArticleMeta.astro      # Date, reading time, updated date display
│   │   ├── CoverImage.astro       # Article cover with category badge
│   │   ├── TOC.astro              # Table of contents + scroll spy
│   │   ├── ReadingProgress.astro  # Progress bar (top + sidebar)
│   │   ├── ShareButtons.astro     # Social share + copy link
│   │   ├── RelatedArticles.astro  # Related articles grid at bottom
│   │   └── CodeBlock.astro        # Enhanced code block with copy button
│   │
│   ├── search/              # Search page components
│   │   ├── SearchInput.astro      # Search bar with Cmd+K
│   │   ├── SearchFilters.astro    # Filter sidebar (categories, tags, time, date)
│   │   ├── SearchResults.astro    # Results container (grid + list views)
│   │   ├── ResultCard.astro       # Search result card variant
│   │   ├── ViewToggle.astro       # Grid/list view switcher
│   │   ├── ActiveFilters.astro    # Active filter chips display
│   │   └── EmptyState.astro       # No results message
│   │
│   └── about/               # About page section components
│       ├── AboutHero.astro        # Hero section with avatar + stats
│       ├── Timeline.astro         # Career timeline
│       ├── TechGrid.astro         # Technology stack grid
│       ├── ProjectCard.astro      # Notable project card
│       └── PhilosophyCard.astro   # Value/philosophy card
│
├── layouts/
│   ├── BaseLayout.astro     # Root HTML layout (exists)
│   └── ArticleLayout.astro  # Article page layout with sidebar grid
│
├── i18n/                    # Translation system
│   ├── ui.ts                # UI string dictionaries (EN + FR)
│   └── utils.ts             # getLangFromUrl(), useTranslations()
│
├── lib/                     # Data access and business logic
│   └── articles.ts          # Article queries (by locale, related, featured, paginated)
│
├── types/                   # Shared TypeScript types
│   └── index.ts             # Article, Heading, SearchResult, etc.
│
├── utils/                   # Pure utility functions
│   ├── dates.ts             # Date formatting per locale
│   └── urls.ts              # URL building helpers (localized paths)
│
├── pages/
│   ├── index.astro          # Root redirect to /en/ (exists)
│   ├── en/
│   │   ├── index.astro      # EN home page
│   │   ├── about.astro      # EN about page
│   │   ├── search.astro     # EN search page
│   │   └── articles/
│   │       └── [...id].astro # EN article pages (dynamic)
│   └── fr/
│       ├── index.astro      # FR home page
│       ├── about.astro      # FR about page
│       ├── search.astro     # FR search page
│       └── articles/
│           └── [...id].astro # FR article pages (dynamic)
│
├── content/
│   └── articles/            # MDX article files (exists)
│
├── styles/
│   └── global.css           # Tailwind v4 theme + prose + animations (exists)
│
└── content.config.ts        # Content collection schema (exists)
```

### Structure Rationale

- **components/layout/:** Shared shell components (Header, Footer, Nav, LangSwitch) are used on every page. Separated from page-specific components because they form the consistent site frame. Build these first -- everything depends on them.
- **components/ui/:** Small, reusable atomic components with no business logic. Used across multiple page types (Tag appears on home, article, search). Build early as foundation pieces.
- **components/article/:** Article-specific components clustered together. ArticleCard is reused on home, search, and related sections. TOC, ReadingProgress, and ShareButtons are article-page-only. This grouping matches the domain: "everything about presenting an article."
- **components/search/:** Search page is the most complex interactive section. All components here work together with Pagefind and share filter state. Grouping them enables cohesive development and testing.
- **components/about/:** About page has unique section components (Timeline, TechGrid) not reused elsewhere. Isolating them prevents clutter in shared directories.
- **i18n/:** Dedicated directory for translation system, following the official Astro i18n recipe pattern. Centralized strings make adding languages trivial.
- **lib/:** Data access layer for querying content collections. Encapsulates `getCollection` calls with locale filtering, sorting, pagination logic. Keeps page files clean.
- **types/:** Shared TypeScript interfaces. Prevents circular dependencies between components.
- **utils/:** Pure utility functions (date formatting, URL construction). No Astro-specific imports -- testable with Vitest.

## Architectural Patterns

### Pattern 1: i18n UI Strings via Translation Dictionary

**What:** Centralized translation dictionaries with a `useTranslations()` helper that returns a `t()` function for the current locale.
**When to use:** Every component that renders user-facing text (navigation labels, button text, section headings, metadata labels, empty states).
**Trade-offs:** Adds a small abstraction layer, but prevents hardcoded strings and makes adding languages trivial. No runtime cost -- resolved at build time.

**Confidence:** HIGH (official Astro recipe)

**Example:**
```typescript
// src/i18n/ui.ts
export const languages = { en: "English", fr: "Francais" };
export const defaultLang = "en";

export const ui = {
  en: {
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.about": "About",
    "article.readingTime": "min read",
    "article.backToArticles": "Back to articles",
    "article.relatedArticles": "Related articles",
    "article.toc": "Table of contents",
    "article.share": "Share",
    "search.title": "Search",
    "search.placeholder": "Search articles, topics, keywords...",
    "search.noResults": "No results",
    "search.resetFilters": "Reset filters",
    "search.categories": "Categories",
    "search.tags": "Tags",
    "search.readingTime": "Reading time",
    "search.publicationDate": "Publication date",
    "search.all": "All",
    "search.articles": "articles",
    "search.sortBy": "Sort:",
    "footer.copyright": "All rights reserved.",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.search": "Recherche",
    "nav.about": "A propos",
    "article.readingTime": "min de lecture",
    "article.backToArticles": "Retour aux articles",
    "article.relatedArticles": "Articles similaires",
    "article.toc": "Sommaire",
    "article.share": "Partager",
    "search.title": "Recherche",
    "search.placeholder": "Rechercher un article, un sujet, un mot-cle...",
    "search.noResults": "Aucun resultat",
    "search.resetFilters": "Reinitialiser les filtres",
    "search.categories": "Categories",
    "search.tags": "Tags",
    "search.readingTime": "Temps de lecture",
    "search.publicationDate": "Date de publication",
    "search.all": "Tous",
    "search.articles": "articles",
    "search.sortBy": "Trier :",
    "footer.copyright": "Tous droits reserves.",
  },
} as const;

// src/i18n/utils.ts
import { ui, defaultLang } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
```

**Usage in component:**
```astro
---
// Header.astro
import { getLangFromUrl, useTranslations } from "@/i18n/utils";
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<nav>
  <a href={`/${lang}`}>{t("nav.home")}</a>
  <a href={`/${lang}/search`}>{t("nav.search")}</a>
  <a href={`/${lang}/about`}>{t("nav.about")}</a>
</nav>
```

### Pattern 2: Inline `<script>` for Client-Side Interactivity (NOT Framework Islands)

**What:** Use Astro's inline `<script>` tags within `.astro` components for client-side behavior instead of React/Vue/Svelte islands.
**When to use:** When interactivity is simple DOM manipulation (scroll tracking, IntersectionObserver, clipboard API, toggle classes, filter state). This blog has no complex state that warrants a UI framework.
**Trade-offs:** No framework overhead (0 KB framework JS shipped). Slightly more manual DOM manipulation vs. reactive state. But for a blog, the interactivity needs (scroll spy, copy button, filter toggles) are straightforward DOM operations.

**Confidence:** HIGH (verified against Astro docs: script tags are bundled and optimized by Astro)

**Example:**
```astro
---
// TOC.astro
interface Props {
  headings: Array<{ depth: number; slug: string; text: string }>;
}
const { headings } = Astro.props;
const tocHeadings = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
---
<nav class="toc">
  <ul>
    {tocHeadings.map((heading) => (
      <li class:list={[{ "pl-5": heading.depth === 3, "pl-3": heading.depth === 2 }]}>
        <a href={`#${heading.slug}`} class="toc-link" data-heading={heading.slug}>
          {heading.text}
        </a>
      </li>
    ))}
  </ul>
</nav>

<script>
  const tocLinks = document.querySelectorAll(".toc-link");
  const headings = document.querySelectorAll("article :is(h2, h3)");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          tocLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(
            `.toc-link[data-heading="${entry.target.id}"]`
          );
          activeLink?.classList.add("active");
        }
      }
    },
    { threshold: 1, rootMargin: "0px 0px -66% 0px" }
  );

  headings.forEach((heading) => observer.observe(heading));
</script>
```

### Pattern 3: Article Data Access Layer

**What:** A dedicated `src/lib/articles.ts` module that encapsulates all content collection queries, providing typed functions for fetching articles by locale, getting related articles, featured articles, and paginated lists.
**When to use:** Every page or component that needs article data. Prevents duplicating `getCollection` + filter + sort logic across pages.
**Trade-offs:** Adds one more file, but dramatically reduces duplication and makes article queries testable with Vitest.

**Confidence:** HIGH (standard Astro pattern, verified with existing content.config.ts)

**Example:**
```typescript
// src/lib/articles.ts
import { getCollection, type CollectionEntry } from "astro:content";

type Article = CollectionEntry<"articles">;

export async function getArticlesByLocale(
  lang: "en" | "fr",
  options?: { excludeDrafts?: boolean }
): Promise<Article[]> {
  const articles = await getCollection("articles", (entry) => {
    const matchesLang = entry.data.lang === lang;
    const notDraft = options?.excludeDrafts !== false ? !entry.data.draft : true;
    return matchesLang && notDraft;
  });
  return articles.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

export async function getFeaturedArticle(lang: "en" | "fr"): Promise<Article | undefined> {
  const articles = await getArticlesByLocale(lang);
  return articles.find((a) => a.data.featured) ?? articles[0];
}

export async function getRelatedArticles(
  current: Article,
  limit = 2
): Promise<Article[]> {
  const articles = await getArticlesByLocale(current.data.lang);
  return articles
    .filter((a) => a.id !== current.id)
    .filter((a) =>
      a.data.tags.some((tag) => current.data.tags.includes(tag)) ||
      a.data.category === current.data.category
    )
    .slice(0, limit);
}

export function getArticleUrl(article: Article): string {
  return `/${article.data.lang}/articles/${article.id}`;
}
```

### Pattern 4: Pagefind Custom Search Integration

**What:** Use Pagefind's JavaScript API (not the default PagefindUI widget) to build a fully custom search experience matching the design mockups. Pagefind indexes at build time; the search page loads its JS API at runtime.
**When to use:** The search page. The design mockups show a highly customized search UI with sidebar filters, grid/list views, and active filter chips that do not match Pagefind's default widget.
**Trade-offs:** More implementation work than the default widget, but full control over markup and behavior. Pagefind's JS API is lightweight (~20KB gzipped) and works entirely client-side.

**Confidence:** MEDIUM (Pagefind JS API is well documented, but the custom integration with Astro's static build requires careful path handling for dev vs production)

**Example approach:**
```astro
---
// search.astro page
import BaseLayout from "@/layouts/BaseLayout.astro";
import SearchInput from "@/components/search/SearchInput.astro";
import SearchFilters from "@/components/search/SearchFilters.astro";
import SearchResults from "@/components/search/SearchResults.astro";
---
<BaseLayout title="Search">
  <SearchInput />
  <div class="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
    <SearchFilters />
    <SearchResults />
  </div>
</BaseLayout>

<!-- All search interactivity in a single coordinated script -->
<script>
  async function initSearch() {
    const pagefind = await import("/pagefind/pagefind.js");
    await pagefind.init();

    const input = document.getElementById("search-input");
    input?.addEventListener("input", async (e) => {
      const query = (e.target as HTMLInputElement).value;
      const results = await pagefind.search(query);
      // Render results to DOM...
    });
  }
  initSearch();
</script>
```

**Critical note:** Pagefind only works after `astro build` generates the index. During `astro dev`, search will not function. The `astro-pagefind` integration handles this by running the indexer during build.

## Data Flow

### Build-Time Content Resolution (unchanged from existing architecture)

```
src/content/articles/*.mdx
    |
    v (glob loader)
src/content.config.ts  -->  Zod validation
    |
    v (getCollection API)
src/lib/articles.ts    -->  Filtered, sorted article lists per locale
    |
    v (props)
Page components        -->  Render static HTML
    |
    v (astro build)
dist/                  -->  Static HTML + Pagefind index
```

### i18n Data Flow

```
User visits URL (e.g., /fr/articles/my-post)
    |
    v
Astro i18n middleware   -->  Sets Astro.currentLocale = "fr"
    |
    v
Page frontmatter       -->  getLangFromUrl(Astro.url) = "fr"
    |
    v
useTranslations("fr")  -->  Returns t() function bound to FR dictionary
    |
    v
Components             -->  {t("nav.home")} = "Accueil"
                            {t("nav.search")} = "Recherche"
```

### Article Page Data Flow

```
[...id].astro getStaticPaths()
    |
    v
getArticlesByLocale("en")  -->  All EN articles
    |
    v
Each article: { params: { id: entry.id }, props: { entry } }
    |
    v
Article page render:
    entry.data          -->  ArticleMeta, CoverImage, Tags
    render(entry)       -->  Article body HTML (Content component)
    entry headings      -->  TOC component
    getRelatedArticles  -->  RelatedArticles component
```

### Search Page Data Flow (runtime)

```
User types in search input
    |
    v
Pagefind.search(query, { filters })  -->  Search results
    |
    v
results.map(r => r.data())           -->  Fetch full result data
    |
    v
Render to #results-grid DOM          -->  Article cards

User clicks filter button
    |
    v
Update filter state object           -->  Re-run pagefind.search()
    |
    v
Update active filter chips           -->  Visual feedback
```

### Key Data Flows Summary

1. **Content -> Pages:** MDX files -> content collection -> `lib/articles.ts` queries -> page props -> component rendering. All at build time.
2. **i18n -> Components:** URL pathname -> locale detection -> translation dictionary lookup -> string interpolation. All at build time.
3. **User -> Search:** Keyboard input -> Pagefind JS API -> DOM updates. All at runtime, client-side only.
4. **User -> Article:** Scroll position -> IntersectionObserver -> TOC highlight + progress bar. All at runtime, lightweight.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-50 articles | Current architecture is perfect. Static pagination with 6 articles per page. No changes needed. |
| 50-200 articles | Pagefind handles this effortlessly (designed for 10K+ pages). Consider adding category landing pages (e.g., `/en/category/typescript`) as static routes for SEO. Pagination becomes more important. |
| 200+ articles | Pagefind still handles search fine. Consider splitting content collection into subcollections if build times grow. Article series navigation becomes important. RSS feed per category. |

### Scaling Priorities

1. **First bottleneck:** Build time as article count grows. Mitigation: Astro's incremental builds (if available in future) or content collection partitioning. Not a concern under 200 articles.
2. **Second bottleneck:** Pagefind index size on slow connections. At 200+ articles, the index is still small (< 100KB). Not a real concern for this project's scale.

## Anti-Patterns

### Anti-Pattern 1: Using React/Vue Islands for Simple DOM Manipulation

**What people do:** Import React or Vue just for a scroll spy, toggle, or copy button.
**Why it's wrong:** Ships 30-100KB of framework JS for behavior achievable with 20 lines of vanilla JS. Violates Astro's zero-JS-by-default philosophy. Adds build complexity and framework dependencies.
**Do this instead:** Use Astro's inline `<script>` tags for simple interactivity. The design mockups' JS (TOC scroll spy, reading progress, copy button, filter toggles) are all vanilla DOM operations. No framework needed.

### Anti-Pattern 2: Duplicating Content Queries Across Pages

**What people do:** Write `getCollection('articles', ...)` with filtering logic directly in every page's frontmatter.
**Why it's wrong:** Duplicated filtering, sorting, and locale logic across home, article, and search pages. Changes require updating multiple files.
**Do this instead:** Centralize in `src/lib/articles.ts`. Pages call `getArticlesByLocale()`, `getFeaturedArticle()`, `getRelatedArticles()`. Single source of truth for article access patterns.

### Anti-Pattern 3: Hardcoding i18n Strings in Components

**What people do:** Write French or English text directly in component templates with conditional logic like `{lang === 'fr' ? 'Accueil' : 'Home'}`.
**Why it's wrong:** Scattered translations impossible to maintain. Adding a third language requires editing every component. No fallback mechanism.
**Do this instead:** Use the `i18n/ui.ts` dictionary + `useTranslations()` pattern. All strings in one place, type-safe keys, automatic fallback to default language.

### Anti-Pattern 4: Using Pagefind Default UI for Custom Designs

**What people do:** Import `@pagefind/default-ui` and try to override its styles with Tailwind to match a custom design.
**Why it's wrong:** The default UI has its own markup structure, class names, and behavior that fights custom designs. CSS overrides become fragile and brittle. The design mockup shows sidebar filters, grid/list toggle, and active filter chips -- none of which exist in the default UI.
**Do this instead:** Use Pagefind's JavaScript API (`pagefind.search()`, `pagefind.filters()`) and render results yourself. Full control over markup, behavior, and styling.

### Anti-Pattern 5: Mixing Page-Level and Component-Level Layout Concerns

**What people do:** Put the full-page grid layout (sidebar + content area) inside individual components instead of the page or layout file.
**Why it's wrong:** Components become non-reusable because they assume a specific page context. Testing and composition become harder.
**Do this instead:** Pages and layouts own the grid structure. Components fill slots within the grid. Example: `ArticleLayout.astro` defines the `lg:grid lg:grid-cols-[1fr_240px]` layout; TOC and ShareButtons render within the sidebar slot.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Pagefind | Build-time indexing via `astro-pagefind` integration; runtime JS API in search page | Index generated during `astro build`. Not available in dev mode. Must handle gracefully. |
| Google Fonts | Preconnect + stylesheet link in BaseLayout `<head>` | Already implemented. Albert Sans + Fira Code. |
| Cloudflare Pages | Static deployment target via `@astrojs/cloudflare` adapter | Already configured. `output: "static"`. |
| Cloudflare Analytics | Script tag in BaseLayout (future) | Not yet implemented. Add as deferred enhancement. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Pages <-> Layouts | Props (`title`, `description`, article metadata) + Slots (page content) | Standard Astro layout pattern. Layouts own shell; pages fill content. |
| Pages <-> lib/articles.ts | Async function calls in page frontmatter | All data fetching happens at build time in page frontmatter script. |
| Pages <-> i18n | Import `useTranslations()`, call in frontmatter, pass `t()` result or lang to components | Components receive pre-resolved strings or the `t` function as needed. |
| Components <-> Components | Props only. No shared state. | Astro components communicate via props passed down from pages/layouts. No global store needed. |
| Article content <-> Components | `render()` returns `<Content />` component; `headings` array passed to TOC | Astro 5 pattern: `const { Content, headings } = await render(entry)` |
| Search script <-> Search components | DOM queries (`getElementById`, `querySelector`) | Search page JS script coordinates all search components via DOM. Components provide the markup structure; script provides behavior. |

## Island Architecture Decisions

This section explicitly documents which components need client-side JavaScript and the chosen strategy.

### Components with NO client-side JS (pure static Astro)

| Component | Why static |
|-----------|-----------|
| Header | Links + active state calculable at build time. Lang switch is just `<a>` tags to alternate locale URL. |
| Footer | Static content, social links are plain `<a>` tags. |
| Nav | Active link determined by `Astro.url.pathname` at build time. |
| LangSwitch | Generates alternate-locale `<a>` href at build time. No JS toggle needed. |
| ArticleCard | Renders article metadata as static HTML. Hover effects are CSS-only. |
| FeaturedArticle | Same as ArticleCard, larger variant. |
| ArticleMeta | Static display of date, reading time. |
| CoverImage | Static `<img>` with CSS overlay. |
| Tag | Static `<span>` element. |
| GlowLine | Static `<div>` with CSS. |
| Pagination | Static `<a>` links to paginated routes. |
| RelatedArticles | Static article cards queried at build time. |
| All About page components | Static sections. IntersectionObserver for fade-up is already in BaseLayout. |
| EmptyState | Static markup, shown/hidden by search script. |
| ActiveFilters | Static markup container, populated by search script. |
| ViewToggle | Static buttons, behavior attached by search script. |

### Components with client-side JS (inline `<script>`)

| Component | JS Behavior | Strategy | Rationale |
|-----------|-------------|----------|-----------|
| **TOC** | IntersectionObserver tracks visible heading, highlights corresponding link | Inline `<script>` in TOC.astro | ~20 lines of vanilla JS. No framework needed. Script scoped to article pages only. |
| **ReadingProgress** | Scroll event calculates reading percentage, updates progress bar width | Inline `<script>` in ReadingProgress.astro | ~15 lines of vanilla JS. Passive scroll listener for performance. |
| **ShareButtons** (copy only) | `navigator.clipboard.writeText()` on copy-link button click | Inline `<script>` in ShareButtons.astro | ~10 lines. Twitter/LinkedIn share links are static `<a>` tags with `target="_blank"`. Only "copy link" needs JS. |
| **CodeBlock** | Copy code to clipboard on button click | Inline `<script>` in CodeBlock.astro or global in ArticleLayout | ~15 lines, same pattern as share copy. |
| **Search page** (entire) | Pagefind initialization, search execution, filter management, result rendering, view toggle, Cmd+K shortcut | **Single coordinated `<script>` in search page** | Most complex JS on the site. All search components share state (query, filters, results). One script coordinates them all rather than fragmented per-component scripts. |
| **Home CategoryFilters** | Toggle active filter, filter displayed articles | Inline `<script>` OR static pages per category | Decision point: if using client-side filtering, ~30 lines of vanilla JS. If pre-building category pages, no JS needed but more build routes. **Recommend: inline `<script>` for simpler architecture.** |

### Why NOT use framework islands

The blog's interactivity needs are:
1. Scroll-based highlighting (IntersectionObserver)
2. Clipboard API (copy text)
3. Search API calls (Pagefind)
4. DOM class toggling (filter active states)
5. Scroll position tracking (reading progress)

None of these require reactive state management, component lifecycle, virtual DOM diffing, or two-way data binding. All are achievable with vanilla JS in under 50 lines each. Shipping React (~40KB) or Preact (~3KB) for this would add bundle size with zero benefit.

**Exception:** If future features require complex interactive widgets (e.g., a WYSIWYG editor, real-time comments, or interactive data visualizations), reconsider with `client:visible` islands using Preact for minimal overhead.

## Suggested Build Order (Dependencies)

This ordering ensures each phase builds on the previous one with no blocking dependencies.

### Phase 1: Foundation (Layout + i18n + Data Layer)
Build order within phase:
1. `src/i18n/ui.ts` + `src/i18n/utils.ts` -- translation system (zero dependencies)
2. `src/lib/articles.ts` -- article queries (depends on content.config.ts which exists)
3. `src/utils/dates.ts` + `src/utils/urls.ts` -- utility functions (zero dependencies)
4. `src/types/index.ts` -- shared types (zero dependencies)
5. `src/components/ui/GlowLine.astro` -- simplest component (zero dependencies)
6. `src/components/ui/Tag.astro` -- atomic component (zero dependencies)
7. `src/components/layout/Nav.astro` -- depends on i18n + utils/urls
8. `src/components/layout/LangSwitch.astro` -- depends on i18n
9. `src/components/layout/Header.astro` -- composes Nav + LangSwitch + GlowLine
10. `src/components/layout/Footer.astro` -- depends on i18n
11. Update `BaseLayout.astro` -- integrate Header + Footer + GlowLine

**Milestone:** All pages render with consistent header/footer/i18n. Navigate between EN/FR.

### Phase 2: Home Page
Build order within phase:
1. `src/components/article/CoverImage.astro` -- depends on Tag
2. `src/components/article/ArticleMeta.astro` -- depends on i18n, dates.ts
3. `src/components/article/ArticleCard.astro` -- depends on CoverImage + ArticleMeta + Tag
4. `src/components/article/FeaturedArticle.astro` -- depends on CoverImage + ArticleMeta + Tag
5. `src/components/ui/Pagination.astro` -- depends on utils/urls
6. Home page CategoryFilters (inline `<script>`)
7. Wire up `src/pages/en/index.astro` + `src/pages/fr/index.astro`

**Milestone:** Home page displays featured article + article grid + category filters + pagination.

### Phase 3: Article Page
Build order within phase:
1. `src/layouts/ArticleLayout.astro` -- extends BaseLayout, adds sidebar grid
2. `src/components/article/TOC.astro` -- depends on headings prop
3. `src/components/article/ReadingProgress.astro` -- standalone
4. `src/components/article/ShareButtons.astro` -- depends on i18n
5. `src/components/article/CodeBlock.astro` -- standalone (optional, enhance Shiki output)
6. `src/components/article/RelatedArticles.astro` -- depends on ArticleCard + lib/articles
7. Wire up `src/pages/[locale]/articles/[...id].astro`

**Milestone:** Full article reading experience with TOC, progress bar, share buttons, related articles.

### Phase 4: Search Page
Build order within phase:
1. Install + configure `astro-pagefind` integration
2. `src/components/search/SearchInput.astro` -- markup only
3. `src/components/search/SearchFilters.astro` -- markup only
4. `src/components/search/ResultCard.astro` -- variant of ArticleCard
5. `src/components/search/ViewToggle.astro` -- markup only
6. `src/components/search/ActiveFilters.astro` -- markup container
7. `src/components/search/EmptyState.astro` -- static
8. `src/components/search/SearchResults.astro` -- wraps grid/list containers
9. Search page `<script>` -- Pagefind init + filter management + rendering
10. Wire up `src/pages/[locale]/search.astro`

**Milestone:** Working search with filters, grid/list views, Cmd+K shortcut.

### Phase 5: About Page
Build order within phase:
1. `src/components/about/AboutHero.astro`
2. `src/components/about/Timeline.astro`
3. `src/components/about/TechGrid.astro`
4. `src/components/about/ProjectCard.astro`
5. `src/components/about/PhilosophyCard.astro`
6. Wire up `src/pages/[locale]/about.astro`

**Milestone:** Complete about page with all sections.

## Sources

- [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/) -- official docs on file organization (HIGH confidence)
- [Astro Components](https://docs.astro.build/en/basics/astro-components/) -- official docs on component patterns, props, slots (HIGH confidence)
- [Astro Islands](https://docs.astro.build/en/concepts/islands/) -- official docs on client directives and hydration strategies (HIGH confidence)
- [Astro i18n Recipe](https://docs.astro.build/en/recipes/i18n/) -- official recipe for useTranslations pattern (HIGH confidence)
- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/) -- official i18n routing configuration (HIGH confidence)
- [astro-pagefind integration](https://github.com/shishkin/astro-pagefind) -- community integration for Pagefind (MEDIUM confidence)
- [Pagefind custom UI with Astro](https://younagi.dev/blog/astro-with-pagefind-filtering-search/) -- community pattern for Pagefind JS API (MEDIUM confidence)
- [TOC with Scroll Spy in Astro](https://dev.to/fazzaamiarso/add-toc-with-scroll-spy-in-astro-3d25) -- community pattern for IntersectionObserver TOC (MEDIUM confidence)
- [Astro Social Share](https://github.com/silent1mezzo/astro-social-share) -- community package for share buttons (MEDIUM confidence)
- Design mockups: `docs/design-research/home.html`, `article.html`, `recherche.html`, `about.html` -- project-specific (HIGH confidence)

---
*Architecture research for: sebc.dev blog technique personnel*
*Researched: 2026-02-09*
