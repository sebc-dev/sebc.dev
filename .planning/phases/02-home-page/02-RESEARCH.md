# Phase 2: Home Page - Research

**Researched:** 2026-02-09
**Domain:** Astro 5 home page with featured article hero, article card grid, client-side category filtering, i18n, content collections
**Confidence:** HIGH

## Summary

Phase 2 transforms the placeholder home page (`src/pages/en/index.astro` and `src/pages/fr/index.astro`) into a fully functional article listing page with three sections: a featured article hero, a category filter bar, and a responsive article card grid. All data comes from the existing `articles` content collection, which already has a complete Zod schema with `title`, `description`, `date`, `category`, `tags`, `pillarTags`, `image`, `readingTime`, `featured`, `draft`, and `lang` fields. No new npm packages are needed.

The design mockup (`docs/design-research/home.html`) provides exact Tailwind classes for every element. The mockup shows a featured article section using a `md:grid-cols-[1.3fr_1fr]` split layout, category filter buttons as a horizontally scrollable row, and a 1/2/3-column responsive article card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Category filtering is client-side via vanilla JS (`<script>` tag toggling `hidden` classes), and there is no pagination for v1 (under 50 articles expected in year 1, per REQUIREMENTS.md).

The primary technical challenge is building the article data access layer (`src/lib/articles.ts`) to encapsulate all content collection queries, then composing reusable components (ArticleCard, FeaturedArticle, CategoryFilter) that will be shared with the Search page (Phase 4) and Article page's related articles section (Phase 3). Date formatting must use `Intl.DateTimeFormat` for locale-aware display. Images are optional in the schema -- components must handle the missing image case gracefully with a fallback pattern.

**Primary recommendation:** Build bottom-up: data layer first (`lib/articles.ts`, `utils/dates.ts`), then atomic components (Tag), then composed components (ArticleCard, FeaturedArticle, CategoryFilter), then wire into home pages. Use client-side JS for category filtering -- no framework islands needed. Create 3-4 seed MDX articles (EN + FR) to have real data during development.

## Standard Stack

### Core (Already Installed -- No New Dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.17.1 | Content collections, `getCollection()`, static page generation | Already configured with glob loader and Zod schema |
| Tailwind CSS v4 | 4.1.18 | Utility-first styling, responsive grid, `line-clamp` | Already configured with design tokens |
| TypeScript | 5.9.3 | Type safety for article props, data layer functions | Already configured with strict mode |

### Supporting (Already Available)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `astro:content` module | (built-in) | `getCollection()`, `CollectionEntry<"articles">` type | Every page/component that needs article data |
| `Intl.DateTimeFormat` | (browser/Node built-in) | Locale-aware date formatting (EN: "Jan 15, 2026", FR: "15 janv. 2026") | Article metadata display |
| IntersectionObserver | (browser built-in) | Fade-up animations on cards (already in BaseLayout) | Stagger animation on article grid |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Client-side JS filtering | Pre-built static pages per category | More complexity with i18n routes (e.g., `/en/category/typescript`); overkill for <50 articles |
| `Intl.DateTimeFormat` | `date-fns` or `dayjs` | External dependency for trivial formatting; `Intl` is native and locale-aware |
| Vanilla JS filter script | Preact/React island | Framework overhead (3-40KB) for 30 lines of DOM class toggling |
| Astro `<Image />` component | Raw `<img>` tag | Astro Image optimizes at build time (WebP, compression); worth using for card images |

**Installation:** None required. Phase 2 uses only what is already installed.

## Architecture Patterns

### Recommended Project Structure (Phase 2 Additions)

```
src/
+-- lib/                          # NEW: Data access layer
|   +-- articles.ts               # getArticlesByLocale, getFeaturedArticle, getCategories, getArticleUrl
+-- utils/                        # NEW: Pure utility functions
|   +-- dates.ts                  # formatDate(date, lang) using Intl.DateTimeFormat
+-- components/
|   +-- ui/                       # NEW additions to existing directory
|   |   +-- Tag.astro             # Reusable tag/badge component (3 variants)
|   +-- article/                  # NEW: Article components (empty directory exists)
|       +-- ArticleCard.astro     # Card for grid view (image, meta, title, excerpt, tags)
|       +-- FeaturedArticle.astro # Full-width featured hero card
|       +-- CategoryFilter.astro  # Category filter buttons bar
+-- content/
|   +-- articles/                 # NEW: Seed MDX articles for development
|       +-- en-building-design-system.mdx
|       +-- en-typescript-patterns.mdx
|       +-- fr-construire-design-system.mdx
|       +-- fr-patterns-typescript.mdx
+-- pages/
    +-- en/
    |   +-- index.astro           # UPDATE: Full home page with data fetching
    +-- fr/
        +-- index.astro           # UPDATE: Full home page with data fetching
```

### Pattern 1: Article Data Access Layer

**What:** A centralized `src/lib/articles.ts` module that encapsulates all content collection queries with typed functions for fetching, filtering, and sorting articles by locale.
**When to use:** Every page or component that needs article data. Prevents duplicating `getCollection()` + filter + sort logic.
**Why critical:** This module will be reused in Phase 3 (related articles), Phase 4 (search pre-filtering), and future article listing pages.

```typescript
// src/lib/articles.ts
import { getCollection, type CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"articles">;

export async function getArticlesByLocale(
  lang: "en" | "fr",
): Promise<Article[]> {
  const articles = await getCollection("articles", (entry) => {
    return entry.data.lang === lang && !entry.data.draft;
  });
  return articles.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export async function getFeaturedArticle(
  lang: "en" | "fr",
): Promise<Article | undefined> {
  const articles = await getArticlesByLocale(lang);
  return articles.find((a) => a.data.featured) ?? articles[0];
}

export async function getCategories(lang: "en" | "fr"): Promise<string[]> {
  const articles = await getArticlesByLocale(lang);
  const categories = [...new Set(articles.map((a) => a.data.category))];
  return categories.sort();
}

export function getArticleUrl(article: Article): string {
  return `/${article.data.lang}/articles/${article.id}`;
}
```

**Confidence:** HIGH -- uses standard Astro `getCollection()` API with filter callback, verified against official docs.

### Pattern 2: Locale-Aware Date Formatting

**What:** A utility function that formats dates using `Intl.DateTimeFormat` for the correct locale.
**When to use:** All article metadata display (cards, featured hero, article page).
**Key detail:** French dates use "15 janv. 2026" format; English uses "Jan 15, 2026". Both achieved with `{ day: "numeric", month: "short", year: "numeric" }` options and the appropriate locale string.

```typescript
// src/utils/dates.ts
const localeMap: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
};

export function formatDate(date: Date, lang: string): string {
  const locale = localeMap[lang] ?? "en-US";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
```

**Confidence:** HIGH -- `Intl.DateTimeFormat` is a web standard with universal support. Verified against MDN docs.

### Pattern 3: Client-Side Category Filtering (Inline Script)

**What:** Vanilla JS in an inline `<script>` tag that shows/hides article cards based on the selected category filter button. All articles are rendered server-side; filtering toggles visibility with `hidden` class.
**When to use:** The category filter bar on the home page (HOME-03).
**Why not static routes per category:** With <50 articles and i18n (2 locales), pre-building category pages would create unnecessary routing complexity. Client-side filtering is simpler and instant.

```html
<script>
  function initCategoryFilter() {
    const buttons = document.querySelectorAll("[data-filter]");
    const cards = document.querySelectorAll("[data-category]");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = (btn as HTMLElement).dataset.filter;

        // Update button active states
        buttons.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle("text-teal-bright", isActive);
          b.classList.toggle("border-teal", isActive);
          b.classList.toggle("bg-teal-dim", isActive);
          b.classList.toggle("text-text-muted", !isActive);
          b.classList.toggle("border-border", !isActive);
        });

        // Show/hide cards
        cards.forEach((card) => {
          const cardCategory = (card as HTMLElement).dataset.category;
          if (category === "all" || cardCategory === category) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  document.addEventListener("astro:page-load", initCategoryFilter);
</script>
```

**Key decisions:**
- Wrap in `astro:page-load` for View Transitions compatibility (Phase 6)
- Use `data-filter` and `data-category` attributes for clean DOM querying
- Toggle `hidden` class (Tailwind's `display: none`) for instant visual feedback
- "All" button uses `data-filter="all"` as a special sentinel value

**Confidence:** HIGH -- standard DOM manipulation pattern, no framework needed.

### Pattern 4: Handling Optional Images

**What:** The `image` field in the content schema is `z.string().optional()`. Article cards and the featured hero must gracefully handle articles without images.
**When to use:** Any component rendering article imagery.
**Strategy:** Show image container with gradient overlay when image exists; show a solid surface-colored placeholder with the category badge when no image exists. This keeps the grid uniform.

```astro
---
// Inside ArticleCard.astro
const { article } = Astro.props;
const hasImage = !!article.data.image;
---
<div class="relative overflow-hidden rounded-xs border border-border group-hover:border-teal/30 transition-colors mb-4">
  {hasImage ? (
    <img
      src={article.data.image}
      alt={article.data.title}
      class="w-full aspect-[16/10] object-cover opacity-75 group-hover:opacity-100 transition-opacity"
      loading="lazy"
    />
  ) : (
    <div class="w-full aspect-[16/10] bg-surface flex items-center justify-center">
      <span class="text-text-muted font-code text-sm">&gt;_</span>
    </div>
  )}
  <div class="absolute inset-0 bg-linear-to-t from-canvas/40 to-transparent"></div>
  <span class="absolute top-3 left-3 text-xs font-code text-teal bg-canvas/80 backdrop-blur-sm px-2.5 py-1 rounded-xs border border-teal/20">
    {article.data.category}
  </span>
</div>
```

**Confidence:** HIGH -- straightforward conditional rendering.

### Pattern 5: Seed Content for Development

**What:** Create 3-4 minimal MDX articles (2 EN + 2 FR) as seed content so the home page has real data during development.
**When to use:** Before building any visual components, so every component can be tested with real content.
**Why necessary:** The content collection currently has zero articles. Building the home page without data means testing only empty states. Seed articles enable visual verification of card layouts, date formatting, category filtering, and responsive grid behavior.

```mdx
---
title: "Building a Modern Design System with Tailwind v4"
description: "Exploring the new @theme directive and how it transforms the way we build design systems."
date: 2026-01-15
category: "design-systems"
tags: ["tailwind", "css", "design-systems"]
pillarTags: ["Ingenierie", "UX"]
readingTime: 8
featured: true
draft: false
lang: "en"
translationSlug: "construire-design-system-tailwind-v4"
---

This is a seed article for development. Content will be replaced.
```

**Confidence:** HIGH -- standard MDX frontmatter matching the existing schema.

### Anti-Patterns to Avoid

- **Duplicating `getCollection()` calls in page files:** Use `lib/articles.ts` exclusively. Pages should call `getArticlesByLocale()`, not `getCollection()` directly.
- **Using `entry.slug` instead of `entry.id`:** Astro 5 uses `entry.id` with the glob loader. The old `entry.slug` API does not exist.
- **Calling `entry.render()` in content collections:** Astro 5 requires `import { render } from 'astro:content'` and `const { Content } = await render(entry)`. However, the home page does NOT need to render article bodies -- only metadata.
- **Building a Preact/React island for category filtering:** Overkill. 30 lines of vanilla JS achieves the same result with zero framework overhead.
- **Using Tailwind v3 class names:** `rounded-xs` (not `rounded-sm` for 2px corners), `bg-linear-to-t` (not `bg-gradient-to-t`), `shadow-xs` (not `shadow-sm` for the smallest shadow). See Pitfall 1 below.
- **Hardcoding reading time format:** Use `t()` from the i18n system for "min read" / "min de lecture". Do NOT hardcode strings in components.
- **Omitting `loading="lazy"` on grid images:** Only the featured article image should be eager-loaded (above the fold). All grid card images must be `loading="lazy"`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date formatting per locale | Custom date formatter with month name arrays | `Intl.DateTimeFormat` with `{ month: "short", day: "numeric", year: "numeric" }` | Native API handles all locale edge cases (ordinals, month names, date order) |
| Article URL generation | String concatenation in every template | `getArticleUrl(article)` in `lib/articles.ts` | Single source of truth; URL pattern changes require one update |
| Category deduplication | Manual Set/array logic in page files | `getCategories(lang)` in `lib/articles.ts` | Encapsulates the dedup + sort logic; reusable for search page filters |
| Image placeholder | Complex fallback with SVG generation | Conditional `{hasImage ? <img> : <div>}` pattern | Simple ternary is sufficient; placeholder matches the design system |
| Reading time string | Custom pluralization logic | `${article.data.readingTime} ${t("article.readingTime")}` | i18n system handles the label; reading time is already computed in frontmatter |

**Key insight:** The home page is primarily data display -- no complex transformations. The data layer (`lib/articles.ts`) and utility functions (`utils/dates.ts`) handle all the business logic. Components are pure display.

## Common Pitfalls

### Pitfall 1: Tailwind v4 Class Name Renames in Design Mockup

**What goes wrong:** The design mockup (`home.html`) uses `rounded-xs` which is correct for Tailwind v4 (2px corners). However, if copying classes from v3-era examples, `rounded` maps to 4px (was 6px in v3), `rounded-sm` maps to 4px (new default), and `rounded-xs` maps to 2px (what was `rounded-sm` in v3).
**Why it happens:** Tailwind v4 renamed the entire scale. The mockup was written FOR v4, so its classes are correct. The danger is mixing in v3-era patterns from external sources.
**How to avoid:** Always reference the design mockup (`home.html`) for exact Tailwind classes. Key mappings for Phase 2: `rounded-xs` (2px, used on cards/badges), `rounded-sm` (4px, used on buttons), `bg-linear-to-t` (not `bg-gradient-to-t`).
**Warning signs:** Corners look larger than the mockup; gradients don't render.

### Pitfall 2: `line-clamp-2` Overridden by Responsive Display Utilities

**What goes wrong:** The excerpt in ArticleCard uses `line-clamp-2` to truncate text to 2 lines. If a responsive display utility with higher specificity is applied to a parent element, the `-webkit-box` display mode required for `line-clamp` gets overridden, causing text to not clamp.
**Why it happens:** `line-clamp` depends on `display: -webkit-box`, which can be overstepped by other display utilities.
**How to avoid:** Do not add display-altering classes (`flex`, `grid`, `block`) directly to the element with `line-clamp`. Keep `line-clamp-2` on a `<p>` tag that has no other display utilities.
**Warning signs:** Excerpt text flows beyond 2 lines on certain screen sizes.

### Pitfall 3: Content Collection Returns Empty Array Without Warning

**What goes wrong:** `getCollection("articles")` returns `[]` if no MDX files exist in `src/content/articles/`, or if all files have invalid frontmatter, or if the `lang` filter does not match any entries. No error is thrown -- the page simply renders empty.
**Why it happens:** `getCollection()` returns a filtered array, not an error. Invalid frontmatter files are silently excluded (schema validation failures produce build warnings but don't throw).
**How to avoid:** Create seed MDX articles early. Add an empty-state section to the home page that displays a "No articles yet" message when the article array is empty. Check the Astro dev server terminal for schema validation warnings.
**Warning signs:** Home page renders with no articles, no errors in browser, but schema warnings in terminal.

### Pitfall 4: Featured Article Excluded from Grid Creates Visual Gap

**What goes wrong:** If the featured article is also shown in the grid, it appears twice. If excluded from the grid, the grid has one fewer card than expected, potentially causing layout issues (2 cards in a 3-column grid leaves an awkward gap).
**Why it happens:** The featured article is typically the most recent article. Displaying it in both the hero and the grid is redundant.
**How to avoid:** Filter the featured article OUT of the grid array: `const gridArticles = articles.filter(a => a.id !== featured?.id)`. The grid will naturally fill available columns. An odd number of cards in the grid is visually fine -- CSS Grid handles it.
**Warning signs:** The same article appears in both the featured section and the first grid card.

### Pitfall 5: Category Filter Script Not Re-Initializing After View Transitions

**What goes wrong:** When View Transitions are added (Phase 6), navigating to the home page via soft navigation does not re-run the filter script. Filter buttons become unresponsive.
**Why it happens:** Astro's inline `<script>` tags are deduplicated and only run once by default. After a View Transition soft navigation, the DOM is replaced but the script does not re-execute.
**How to avoid:** Wrap the filter initialization in `document.addEventListener("astro:page-load", initCategoryFilter)`. This event fires on first load AND after every View Transition. This is the same pattern already used for scroll-reveal in BaseLayout.
**Warning signs:** Filtering works on first page load but not after navigating away and back.

### Pitfall 6: `entry.id` May Include Path Separators

**What goes wrong:** If MDX files are placed in subdirectories within `src/content/articles/` (e.g., `en/my-article.mdx`), the `entry.id` becomes `en/my-article` instead of just `my-article`. This breaks URL generation.
**Why it happens:** The glob loader generates IDs from the full relative path to the `base` directory.
**How to avoid:** Keep all MDX files flat in `src/content/articles/` (no subdirectories). Use a naming convention like `en-article-title.mdx` and `fr-titre-article.mdx` for language differentiation. The `lang` frontmatter field handles locale filtering.
**Warning signs:** Article URLs contain unexpected slashes (`/en/articles/en/my-article`).

## Code Examples

### Complete ArticleCard Component

```astro
---
// src/components/article/ArticleCard.astro
import Tag from "@/components/ui/Tag.astro";
import { formatDate } from "@/utils/dates";
import { getArticleUrl, type Article } from "@/lib/articles";
import { getLangFromUrl, useTranslations } from "@/i18n/utils";

interface Props {
  article: Article;
  class?: string;
}

const { article, class: className } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const url = getArticleUrl(article);
const hasImage = !!article.data.image;
---
<article class:list={["group", className]} data-category={article.data.category}>
  <a href={url} class="block">
    <div class="relative overflow-hidden rounded-xs border border-border group-hover:border-teal/30 transition-colors mb-4">
      {hasImage ? (
        <img
          src={article.data.image}
          alt={article.data.title}
          class="w-full aspect-[16/10] object-cover opacity-75 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
      ) : (
        <div class="w-full aspect-[16/10] bg-surface flex items-center justify-center">
          <span class="text-text-muted font-code text-sm">&gt;_</span>
        </div>
      )}
      <div class="absolute inset-0 bg-linear-to-t from-canvas/40 to-transparent"></div>
      <span class="absolute top-3 left-3 text-xs font-code text-teal bg-canvas/80 backdrop-blur-sm px-2.5 py-1 rounded-xs border border-teal/20">
        {article.data.category}
      </span>
    </div>
    <div class="flex items-center gap-2 text-xs text-text-muted mb-2.5">
      <time class="tabular-nums">{formatDate(article.data.date, lang)}</time>
      <span class="w-1 h-1 rounded-full bg-text-muted"></span>
      <span>{article.data.readingTime} {t("article.readingTime")}</span>
    </div>
    <h3 class="text-lg font-semibold leading-snug mb-2 group-hover:text-teal-bright transition-colors">
      {article.data.title}
    </h3>
    <p class="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
      {article.data.description}
    </p>
    <div class="flex flex-wrap gap-2">
      {article.data.tags.map((tag) => (
        <Tag label={tag} />
      ))}
    </div>
  </a>
</article>
```

**Source:** Adapted from design mockup `docs/design-research/home.html` card pattern + `docs/design-research/design-report.md` section 5.3.

### Complete FeaturedArticle Component

```astro
---
// src/components/article/FeaturedArticle.astro
import Tag from "@/components/ui/Tag.astro";
import { formatDate } from "@/utils/dates";
import { getArticleUrl, type Article } from "@/lib/articles";
import { getLangFromUrl, useTranslations } from "@/i18n/utils";

interface Props {
  article: Article;
}

const { article } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const url = getArticleUrl(article);
const hasImage = !!article.data.image;
---
<section class="py-12 md:py-16 border-b border-border fade-up">
  <a href={url} class="block group md:grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
    <div class="relative overflow-hidden rounded-xs border border-border group-hover:border-teal/30 transition-colors mb-6 md:mb-0">
      {hasImage ? (
        <img
          src={article.data.image}
          alt={article.data.title}
          class="w-full aspect-[16/10] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <div class="w-full aspect-[16/10] bg-surface flex items-center justify-center">
          <span class="text-text-muted font-code text-2xl">&gt;_</span>
        </div>
      )}
      <div class="absolute inset-0 bg-linear-to-t from-canvas/50 to-transparent"></div>
      <span class="absolute top-4 left-4 text-xs font-code text-teal bg-canvas/80 backdrop-blur-sm px-2.5 py-1 rounded-xs border border-teal/20">
        {article.data.category}
      </span>
    </div>
    <div>
      <div class="flex items-center gap-3 text-xs text-text-muted mb-4">
        <time class="tabular-nums">{formatDate(article.data.date, lang)}</time>
        <span class="w-1 h-1 rounded-full bg-text-muted"></span>
        <span>{article.data.readingTime} {t("article.readingTime")}</span>
      </div>
      <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-teal-bright transition-colors">
        {article.data.title}
      </h2>
      <p class="text-text-secondary leading-relaxed mb-5">
        {article.data.description}
      </p>
      <div class="flex flex-wrap gap-2">
        {article.data.tags.map((tag) => (
          <Tag label={tag} />
        ))}
      </div>
    </div>
  </a>
</section>
```

**Source:** Direct transcription from `docs/design-research/home.html` featured section.

### Tag Component (3 Variants)

```astro
---
// src/components/ui/Tag.astro
interface Props {
  label: string;
  variant?: "default" | "active" | "badge";
  class?: string;
}

const { label, variant = "default", class: className } = Astro.props;

const variantClasses = {
  default: "text-text-secondary border-border",
  active: "text-teal-bright border-teal/20 bg-teal-dim",
  badge: "text-teal bg-canvas/80 backdrop-blur-sm border-teal/20",
};
---
<span class:list={[
  "text-xs font-code px-2.5 py-1 rounded-xs border",
  variantClasses[variant],
  className,
]}>
  {label}
</span>
```

**Source:** Design report section 5.5 (Tag/Badge).

### Complete Home Page Wiring

```astro
---
// src/pages/en/index.astro (or fr/index.astro with FR translations)
import BaseLayout from "@/layouts/BaseLayout.astro";
import FeaturedArticle from "@/components/article/FeaturedArticle.astro";
import ArticleCard from "@/components/article/ArticleCard.astro";
import CategoryFilter from "@/components/article/CategoryFilter.astro";
import {
  getArticlesByLocale,
  getFeaturedArticle,
  getCategories,
} from "@/lib/articles";
import { getLangFromUrl, useTranslations } from "@/i18n/utils";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const allArticles = await getArticlesByLocale(lang);
const featured = await getFeaturedArticle(lang);
const categories = await getCategories(lang);
const gridArticles = featured
  ? allArticles.filter((a) => a.id !== featured.id)
  : allArticles;
---
<BaseLayout
  title={t("nav.home")}
  description={t("home.description")}
>
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    {featured && <FeaturedArticle article={featured} />}

    {categories.length > 0 && (
      <CategoryFilter categories={categories} />
    )}

    {gridArticles.length > 0 ? (
      <section class="pb-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.map((article, i) => (
            <ArticleCard
              article={article}
              class:list={[
                "fade-up",
                i < 3 && `fade-up-d${Math.min(i + 1, 4)}`,
              ]}
            />
          ))}
        </div>
      </section>
    ) : (
      <section class="py-16 text-center">
        <p class="text-text-secondary">{t("home.noArticles")}</p>
      </section>
    )}
  </div>
</BaseLayout>
```

### i18n Strings to Add

```typescript
// Additions to src/i18n/ui.ts
// EN:
"home.description": "Technical blog about AI, Software Engineering & UX",
"home.noArticles": "No articles yet. Check back soon!",
"home.filterAll": "All",
"article.readingTime": "min read",

// FR:
"home.description": "Blog technique sur l'IA, l'Ingenierie logicielle & l'UX",
"home.noArticles": "Pas encore d'articles. Revenez bientot !",
"home.filterAll": "Tous",
"article.readingTime": "min de lecture",
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `entry.slug` for content | `entry.id` with `glob()` loader | Astro 5.0 (Dec 2024) | Use `entry.id` everywhere |
| `entry.render()` | `import { render } from 'astro:content'` | Astro 5.0 (Dec 2024) | Not needed for home page (no article body rendering) |
| `@tailwindcss/line-clamp` plugin | Built-in `line-clamp-*` utilities | Tailwind 3.3+ / v4 | No plugin needed; `line-clamp-2` works natively |
| `bg-gradient-to-t` | `bg-linear-to-t` | Tailwind v4 (Jan 2025) | Updated gradient syntax in all components |
| Astro `<Image />` requires import | `<Image />` from `astro:assets` | Astro 3.0+ | Available but optional for Phase 2; plain `<img>` is fine for URL-based images |

**Deprecated/outdated:**
- `entry.slug`: Does not exist in Astro 5 content collections
- `@tailwindcss/line-clamp`: Plugin no longer needed; utilities are built in
- `bg-gradient-*`: Renamed to `bg-linear-*` in Tailwind v4

## Image Strategy Decision

The content schema has `image: z.string().optional()`. For Phase 2, images referenced in frontmatter will be external URLs (e.g., placeholder images for seed content). The Astro `<Image />` component from `astro:assets` is designed for local images stored in `src/` -- it does NOT optimize external URLs in static output mode. For v1 with external image URLs, use plain `<img>` tags with `loading="lazy"`.

**Future consideration:** When migrating to local images (stored in `src/content/articles/` alongside MDX files), switch to `<Image />` for build-time WebP conversion and compression. This would require changing the schema from `z.string()` to `image()` helper.

**Recommendation for Phase 2:** Use `<img>` tags. Add `loading="lazy"` to grid cards, omit it from the featured article (above the fold). This is sufficient for v1.

## Open Questions

1. **Seed article image strategy**
   - What we know: Seed articles need images for development. The schema accepts `image: z.string().optional()`.
   - What's unclear: Whether to use placeholder URLs (picsum.photos), local placeholder images in `public/`, or omit images from seed content.
   - Recommendation: Use `https://picsum.photos/seed/{slug}/800/500` for seed articles. This provides consistent, reproducible images without storing files. Replace with real images when actual articles are written.

2. **Pagination deferral**
   - What we know: The design mockup shows pagination. The REQUIREMENTS.md explicitly states pagination is out of scope ("Pagination with page numbers: <50 articles year 1, unnecessary routing complexity with i18n").
   - What's unclear: Whether to show a "Load more" button or simply display all articles.
   - Recommendation: Display all articles in the grid for v1. With <50 articles per language, no pagination is needed. The grid already filters by category to reduce visible items. If needed later, add pagination in a Phase 2.x insertion.

3. **Category naming convention**
   - What we know: Categories come from article frontmatter (`category: z.string()`). The schema does not enforce a fixed set of categories.
   - What's unclear: What the initial categories should be named. The mockup shows "TypeScript", "React", "CSS", "Performance", "Accessibilite", "Tooling" -- but these are from the design mockup's placeholder content.
   - Recommendation: Let categories emerge organically from seed article frontmatter. Use lowercase kebab-case for machine keys (e.g., `design-systems`, `typescript`) and display them with title-case in the UI. The filter buttons display whatever categories exist in the content.

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) -- getCollection, filter, sort patterns
- [Astro Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/) -- CollectionEntry type, getCollection signature
- [MDN Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) -- locale date formatting API
- [Tailwind CSS v4 line-clamp](https://tailwindcss.com/docs/line-clamp) -- built-in utilities, no plugin needed
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) -- utility renames, gradient syntax
- Design mockup: `docs/design-research/home.html` -- exact Tailwind classes for all home page components
- Design report: `docs/design-research/design-report.md` -- component specifications, layout grid, token usage

### Secondary (MEDIUM confidence)
- [Astro Images Guide](https://docs.astro.build/en/guides/images/) -- Image component vs plain img, optimization behavior
- [Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) -- imageService: "compile" behavior for static builds

### Project Sources (HIGH confidence)
- `src/content.config.ts` -- existing articles collection schema with all fields
- `src/i18n/ui.ts` + `src/i18n/utils.ts` -- existing i18n system
- `src/layouts/BaseLayout.astro` -- existing layout with scroll-reveal
- `src/styles/global.css` -- existing design tokens and animation classes
- Phase 1 summaries -- established patterns and decisions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies; all uses existing Astro + Tailwind APIs
- Architecture (data layer): HIGH - standard getCollection pattern from official Astro docs
- Architecture (components): HIGH - directly transcribed from verified design mockup with Tailwind v4 classes
- Architecture (filtering): HIGH - vanilla JS DOM manipulation, standard pattern
- Pitfalls: HIGH - verified against Tailwind v4 docs, Astro content collections docs, and Phase 1 research
- Date formatting: HIGH - Intl.DateTimeFormat verified against MDN docs
- Image strategy: MEDIUM - Astro Image component behavior with Cloudflare adapter needs runtime verification

**Research date:** 2026-02-09
**Valid until:** 2026-04-09 (stable stack, no breaking changes expected)
