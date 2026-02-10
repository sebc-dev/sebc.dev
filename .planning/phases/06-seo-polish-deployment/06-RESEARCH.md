# Phase 6: SEO, Polish & Deployment - Research

**Researched:** 2026-02-10
**Domain:** SEO meta tags, structured data, RSS feeds, View Transitions, Cloudflare deployment, Lighthouse optimization
**Confidence:** HIGH

## Summary

Phase 6 is a cross-cutting phase that adds SEO infrastructure (Open Graph, Twitter Cards, JSON-LD, canonical/hreflang), RSS feeds, View Transitions, and Cloudflare Analytics to an existing Astro 5 static site. The site currently has **zero** SEO meta tags beyond basic `<title>` and `<meta name="description">`, no RSS feeds, no View Transitions, and no analytics. All of this needs to be built from scratch.

The project already has a solid foundation: `site: "https://sebc.dev"` is configured in `astro.config.mjs`, the sitemap integration is active, bilingual routing with locale prefixes works, and Lighthouse CI is configured in the quality pipeline with 0.9 minimum scores. The primary technical challenge is the View Transitions migration -- the codebase has **11 scripts** using the `direct call + astro:after-swap` pattern that must be migrated to `astro:page-load` when `<ClientRouter />` is added.

The recommended approach is to use Astro's `<ClientRouter />` component (not native CSS `@view-transition`) because it provides cross-browser fallback support and Astro 5 fully supports it with static output. All SEO meta tags should be centralized in a single reusable `<SEO>` component injected via `BaseLayout.astro`. RSS feeds should use `@astrojs/rss` v4 with separate endpoints per locale.

**Primary recommendation:** Build a centralized `<SEO>` Astro component, add `<ClientRouter />` to BaseLayout with `astro:page-load` migration, create per-locale RSS endpoints, and enable Cloudflare Web Analytics via the dashboard.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro (existing) | ^5.17.1 | Framework - provides ClientRouter, content collections, static generation | Already in project |
| @astrojs/rss | ^4.0.15 | RSS feed generation from content collections | Official Astro package, actively maintained |
| @astrojs/sitemap (existing) | ^3.7.0 | Sitemap generation | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro:transitions | built-in | ClientRouter component and transition directives | View Transitions implementation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ClientRouter | Native CSS @view-transition | Native has ~75% browser support but no fallback animations; ClientRouter provides universal support with graceful degradation. Use ClientRouter for now. |
| Hand-built SEO component | astro-seo npm package | astro-seo adds a dependency for something trivially built with Astro props. Hand-built is simpler and more maintainable. |
| sanitize-html + markdown-it for RSS content | Description-only RSS items | Full content RSS adds 2 dependencies and complexity. Description-only RSS is simpler and sufficient for discovery. |

**Installation:**
```bash
npm install @astrojs/rss
```

No other new dependencies needed. `astro:transitions` is built into Astro 5.

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    seo/
      SEO.astro             # Centralized OG, Twitter, canonical, hreflang meta tags
      JsonLd.astro           # JSON-LD structured data component
  pages/
    en/
      rss.xml.ts             # EN RSS feed endpoint
    fr/
      rss.xml.ts             # FR RSS feed endpoint
  layouts/
    BaseLayout.astro         # Add <ClientRouter />, <SEO />, RSS autodiscovery
    ArticleLayout.astro      # Add <JsonLd /> for BlogPosting
```

### Pattern 1: Centralized SEO Component
**What:** A single `<SEO>` component that receives page-level props and renders all OG, Twitter Card, canonical, and hreflang meta tags.
**When to use:** Every page, injected via BaseLayout.
**Example:**
```astro
---
// Source: Astro official docs pattern + Google structured data docs
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedDate?: Date;
  canonicalPath?: string;
  translationMap?: Record<string, string>;
}

const {
  title,
  description,
  image = "/images/og-default.png",
  type = "website",
  publishedDate,
  canonicalPath,
  translationMap,
} = Astro.props;

const lang = Astro.currentLocale ?? "en";
const site = Astro.site!;
const currentPath = canonicalPath ?? Astro.url.pathname;
const canonicalURL = new URL(currentPath, site).href;
const ogImage = new URL(image, site).href;

// Build hreflang links
const otherLang = lang === "en" ? "fr" : "en";
const alternates: { lang: string; href: string }[] = [
  { lang, href: canonicalURL },
];
if (translationMap?.[otherLang]) {
  alternates.push({
    lang: otherLang,
    href: new URL(translationMap[otherLang], site).href,
  });
}
// x-default points to the current language page (en is default)
const xDefault = alternates.find((a) => a.lang === "en")?.href ?? canonicalURL;
---

<!-- Canonical -->
<link rel="canonical" href={canonicalURL} />

<!-- Hreflang -->
{alternates.map((alt) => (
  <link rel="alternate" hreflang={alt.lang} href={alt.href} />
))}
<link rel="alternate" hreflang="x-default" href={xDefault} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:site_name" content="sebc.dev" />
<meta property="og:type" content={type} />
<meta property="og:image" content={ogImage} />
<meta property="og:locale" content={lang === "fr" ? "fr_FR" : "en_US"} />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<!-- RSS autodiscovery -->
<link
  rel="alternate"
  type="application/rss+xml"
  title={`sebc.dev (${lang.toUpperCase()})`}
  href={`/${lang}/rss.xml`}
/>
```

### Pattern 2: JSON-LD BlogPosting Component
**What:** A component that outputs `<script type="application/ld+json">` with BlogPosting schema.
**When to use:** Article pages only, injected via ArticleLayout.
**Example:**
```astro
---
// Source: https://developers.google.com/search/docs/appearance/structured-data/article
interface Props {
  headline: string;
  description: string;
  datePublished: Date;
  image?: string;
  authorName: string;
  authorUrl?: string;
  url: string;
}

const { headline, description, datePublished, image, authorName, authorUrl, url } = Astro.props;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline,
  description,
  datePublished: datePublished.toISOString(),
  dateModified: datePublished.toISOString(),
  url,
  ...(image && { image: [new URL(image, Astro.site!).href] }),
  author: [{
    "@type": "Person",
    name: authorName,
    ...(authorUrl && { url: authorUrl }),
  }],
  publisher: {
    "@type": "Person",
    name: authorName,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": url,
  },
};
---

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

### Pattern 3: RSS Feed Endpoint per Locale
**What:** Astro endpoint files that generate RSS XML using `@astrojs/rss`.
**When to use:** One per locale at `src/pages/{locale}/rss.xml.ts`.
**Example:**
```typescript
// Source: https://docs.astro.build/en/recipes/rss/
// src/pages/en/rss.xml.ts
import rss from "@astrojs/rss";
import { getArticlesByLocale, getArticleUrl } from "@/lib/articles";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = await getArticlesByLocale("en");
  return rss({
    title: "sebc.dev",
    description: "Technical blog -- AI x Engineering x UX",
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: getArticleUrl(article),
    })),
    customData: `<language>en</language>`,
  });
}
```

### Pattern 4: ClientRouter + Script Migration
**What:** Add `<ClientRouter />` to BaseLayout and migrate all scripts from `direct call + astro:after-swap` to `astro:page-load`.
**When to use:** One-time migration when adding View Transitions.
**Example (before):**
```javascript
// CURRENT pattern (11 scripts)
function initScrollReveal() { /* ... */ }
initScrollReveal();
document.addEventListener("astro:after-swap", initScrollReveal);
```
**Example (after):**
```javascript
// NEW pattern with ClientRouter
document.addEventListener("astro:page-load", () => {
  // All initialization logic here
  const observer = new IntersectionObserver(/* ... */);
  document.querySelectorAll(".fade-up:not(.in-view)")
    .forEach((el) => observer.observe(el));
});
```

### Anti-Patterns to Avoid
- **Scattering meta tags across pages:** Centralize all SEO tags in the SEO component. Pages pass props, not raw HTML.
- **Hardcoding URLs in meta tags:** Always derive from `Astro.site` and `Astro.url` to ensure correct domain in all environments.
- **Using `astro:after-swap` with ClientRouter:** When ClientRouter is active, prefer `astro:page-load` which fires after the full navigation cycle including script execution. Using `astro:after-swap` still works but fires before new scripts execute.
- **Putting JSON-LD on non-article pages:** BlogPosting schema is specifically for article pages. Other pages get only OG/Twitter tags.
- **Forgetting `x-default` hreflang:** Google requires `x-default` in addition to per-language alternates for proper international indexing.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RSS feed generation | Custom XML builder | `@astrojs/rss` v4 | Handles RSS spec edge cases, XML escaping, date formatting, customData |
| Sitemap | Custom sitemap generator | `@astrojs/sitemap` (already installed) | Handles i18n routes, changefreq, lastmod automatically |
| View Transitions routing | Custom history/fetch-based SPA | `<ClientRouter />` from `astro:transitions` | Handles prefetching, scroll restoration, fallback, animation lifecycle |
| OG image generation | Manual image creation | Static default OG image per locale | Dynamic OG image generation (e.g., satori) is overkill for a personal blog |

**Key insight:** The Astro ecosystem provides official, well-tested solutions for every SEO/polish feature needed. Custom solutions would be worse in correctness, maintenance, and edge case handling.

## Common Pitfalls

### Pitfall 1: Script Re-execution After ClientRouter Navigation
**What goes wrong:** After adding `<ClientRouter />`, scripts that relied on `direct call + astro:after-swap` may not behave correctly. Some scripts may not re-initialize, others may duplicate event listeners.
**Why it happens:** ClientRouter transforms the MPA into a SPA. Bundled module scripts execute only once. Inline scripts may re-execute unexpectedly.
**How to avoid:** Migrate ALL scripts to the `astro:page-load` event pattern. The `astro:page-load` event fires on both initial load and every client-side navigation.
**Warning signs:** Broken scroll reveal, non-functional TOC spy, broken search after navigating between pages.
**Affected files (11 scripts found):**
1. `src/layouts/BaseLayout.astro` - `initScrollReveal`
2. `src/layouts/ArticleLayout.astro` - `initHeadingAnchorCopy`
3. `src/layouts/ArticleLayout.astro` - `initCodeBlockHeaders`
4. `src/layouts/ArticleLayout.astro` - `initMobileCodeCopy`
5. `src/layouts/ArticleLayout.astro` - `initMobileToc`
6. `src/components/article/TableOfContents.astro` - `initScrollSpy`
7. `src/components/article/ShareButtons.astro` - `initCopyLink`
8. `src/components/article/CategoryFilter.astro` - `initCategoryFilter`
9. `src/components/ui/ReadingProgress.astro` - `initReadingProgress`
10. `src/pages/en/search.astro` - `initSearch`
11. `src/pages/fr/search.astro` - `initSearch`

### Pitfall 2: Missing OG Image Fallback
**What goes wrong:** Pages without a specific image produce `og:image` tags pointing to undefined/empty URLs, which social platforms reject.
**Why it happens:** Not all pages have associated images. The content schema has `image` as optional.
**How to avoid:** Always provide a default fallback OG image (e.g., `/images/og-default.png`). Create a branded default image at 1200x630px.
**Warning signs:** Blank previews when sharing links on Twitter/LinkedIn.

### Pitfall 3: Incorrect Canonical URLs with Trailing Slashes
**What goes wrong:** Canonical URLs may mismatch the actual page URLs if trailing slash handling is inconsistent.
**Why it happens:** The project uses `trailingSlash: "never"` in `astro.config.mjs`, but canonical URLs might be constructed with trailing slashes.
**How to avoid:** Use `Astro.url.pathname` directly (which respects the trailingSlash config) and combine with `Astro.site` for absolute URLs.
**Warning signs:** Lighthouse SEO audit warnings about canonical URL mismatches.

### Pitfall 4: Hreflang Without Translation Mapping
**What goes wrong:** Non-article pages (home, search, about) point to the wrong alternate language page, or article pages without `translationSlug` produce broken hreflang links.
**Why it happens:** The `translationMap` prop is only fully populated for articles with `translationSlug`. Other pages need manual mapping.
**How to avoid:** For static pages (home, search, about), construct hreflang from the URL pattern `/{otherLang}/{rest}`. For articles without `translationSlug`, omit the alternate language hreflang link entirely (Google handles this gracefully).
**Warning signs:** Hreflang links pointing to 404 pages.

### Pitfall 5: RSS Autodiscovery Missing from Head
**What goes wrong:** RSS readers and browser extensions cannot discover the feed automatically.
**Why it happens:** The `<link rel="alternate" type="application/rss+xml">` tag is forgotten in the `<head>`.
**How to avoid:** Include RSS autodiscovery in the SEO component that is injected via BaseLayout on every page.
**Warning signs:** RSS feed exists at the URL but readers cannot auto-detect it.

### Pitfall 6: Cloudflare Analytics Double-Counting with ClientRouter
**What goes wrong:** Cloudflare Web Analytics may not track SPA-style navigations correctly, or may under-count page views.
**Why it happens:** Cloudflare's beacon script is designed for traditional page loads. ClientRouter intercepts navigation.
**How to avoid:** For Cloudflare Pages, enable Web Analytics via the dashboard (automatic injection). The auto-injected script is designed to work with SPAs. If using manual script, no special handling is needed -- Cloudflare's beacon detects SPA navigation via the History API.
**Warning signs:** Analytics showing significantly fewer page views than expected.

### Pitfall 7: Lighthouse SEO Score Drops from Missing Structured Data
**What goes wrong:** Lighthouse SEO audit flags missing meta description, missing canonical, or missing hreflang.
**Why it happens:** The SEO component is not wired up to all pages, or props are not passed correctly.
**How to avoid:** Verify with `npm run build && npx lighthouse` locally before pushing. Add article page URL to lighthouserc.json for CI.
**Warning signs:** Lighthouse SEO score below 90.

## Code Examples

Verified patterns from official sources:

### BaseLayout Integration with ClientRouter and SEO
```astro
---
// Source: https://docs.astro.build/en/guides/view-transitions/
import { ClientRouter } from "astro:transitions";
import SEO from "@/components/seo/SEO.astro";
import "@/styles/global.css";
import Header from "@/components/layout/Header.astro";
import Footer from "@/components/layout/Footer.astro";

interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  publishedDate?: Date;
  translationMap?: Record<string, string>;
}

const {
  title,
  description = "Blog technique -- IA x Ingenierie x UX",
  image,
  type = "website",
  publishedDate,
  translationMap,
} = Astro.props;
const lang = Astro.currentLocale ?? "en";
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} -- sebc.dev</title>
    <meta name="description" content={description} />
    <SEO
      title={title}
      description={description}
      image={image}
      type={type}
      publishedDate={publishedDate}
      translationMap={translationMap}
    />
    <ClientRouter />
    <!-- fonts, sitemap link, etc. -->
  </head>
  <body><!-- ... --></body>
</html>
```

### RSS Feed Endpoint
```typescript
// Source: https://docs.astro.build/en/recipes/rss/
// src/pages/en/rss.xml.ts
import rss from "@astrojs/rss";
import { getArticlesByLocale, getArticleUrl } from "@/lib/articles";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = await getArticlesByLocale("en");
  return rss({
    title: "sebc.dev",
    description: "Technical blog -- AI x Engineering x UX",
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: getArticleUrl(article),
    })),
    customData: `<language>en</language>`,
  });
}
```

### Script Migration Pattern (astro:after-swap to astro:page-load)
```javascript
// Source: https://events-3bg.pages.dev/jotter/astro/scripts/
// BEFORE (current pattern):
function initScrollReveal() {
  const observer = new IntersectionObserver(/* ... */);
  document.querySelectorAll(".fade-up:not(.in-view)")
    .forEach((el) => observer.observe(el));
}
initScrollReveal();
document.addEventListener("astro:after-swap", initScrollReveal);

// AFTER (with ClientRouter):
document.addEventListener("astro:page-load", () => {
  const observer = new IntersectionObserver(/* ... */);
  document.querySelectorAll(".fade-up:not(.in-view)")
    .forEach((el) => observer.observe(el));
});
// No explicit init call needed -- astro:page-load fires on initial load too
```

### Hreflang for Non-Article Pages
```astro
---
// For pages like /en/about, /en/search -- simple path-based alternation
const lang = Astro.currentLocale ?? "en";
const otherLang = lang === "en" ? "fr" : "en";
const currentPath = Astro.url.pathname;
const otherPath = currentPath.replace(`/${lang}/`, `/${otherLang}/`);

const translationMap = {
  [lang]: currentPath,
  [otherLang]: otherPath,
};
---
<BaseLayout translationMap={translationMap} />
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<ViewTransitions />` | `<ClientRouter />` | Astro 5.0 (Dec 2024) | Import renamed, no functional change |
| `@astrojs/rss` v3 returning object | `@astrojs/rss` v4 returning Response | 2024 | `rss()` now returns `Response` directly from GET |
| `entry.render()` | `render(entry)` from `astro:content` | Astro 5.0 | Import pattern changed |
| `entry.slug` | `entry.id` | Astro 5.0 | Content collection ID convention changed |

**Deprecated/outdated:**
- `<ViewTransitions />`: Renamed to `<ClientRouter />` in Astro 5. The old name still works but is deprecated.
- `@astrojs/rss` `drafts` option: Removed in v4.0.0. Filter drafts yourself before passing to `items`.
- Native `@view-transition` CSS: While the future direction, ClientRouter is still the recommended Astro approach for full browser compatibility (as of Feb 2026).

## Open Questions

1. **OG Default Image**
   - What we know: An OG image (1200x630px) is needed as a fallback for pages without article-specific images. The `public/images/` directory is currently empty.
   - What's unclear: What the branded default image should look like (logo, colors, text).
   - Recommendation: Create a simple branded image using the dark theme colors (canvas background + teal accent + "sebc.dev" text). This can be a static PNG placed at `public/images/og-default.png`.

2. **Cloudflare Analytics: Automatic vs Manual**
   - What we know: Cloudflare Pages can auto-inject the analytics beacon when enabled in the dashboard. No code changes needed.
   - What's unclear: Whether the auto-injection interferes with View Transitions or requires valid HTML structure checks.
   - Recommendation: Use automatic injection via dashboard. It is the simplest and officially recommended approach for Cloudflare Pages. If it causes issues, fall back to manual `<script>` tag in BaseLayout.

3. **View Transition Animations**
   - What we know: ClientRouter provides default `fade` animations. Custom `slide` and named transitions are available.
   - What's unclear: Whether default fade is sufficient or if specific elements (header, content area) should have custom transitions.
   - Recommendation: Start with default fade. Add custom transitions only if the default feels insufficient after testing.

4. **Lighthouse Article Page Coverage**
   - What we know: The current `lighthouserc.json` tests `/en/`, `/fr/`, and `/en/search`. No article pages are tested.
   - What's unclear: Whether article pages (with JSON-LD) should be added to Lighthouse CI.
   - Recommendation: Add at least one article page URL to `lighthouserc.json` to verify JSON-LD and article-specific SEO.

## Sources

### Primary (HIGH confidence)
- [Astro View Transitions Guide](https://docs.astro.build/en/guides/view-transitions/) - ClientRouter setup, lifecycle events, fallback
- [Astro View Transitions API Reference](https://docs.astro.build/en/reference/modules/astro-transitions/) - Complete API, props, events
- [Astro RSS Recipe](https://docs.astro.build/en/recipes/rss/) - @astrojs/rss setup, content collection integration
- [Google Article Structured Data](https://developers.google.com/search/docs/appearance/structured-data/article) - BlogPosting schema fields, validation
- [Cloudflare Pages Web Analytics](https://developers.cloudflare.com/pages/how-to/web-analytics/) - Auto-injection setup

### Secondary (MEDIUM confidence)
- [Bag of Tricks: ClientRouter vs @view-transition](https://events-3bg.pages.dev/jotter/astro-view-transitions/) - Comparison, recommendations
- [Bag of Tricks: Script Patterns](https://events-3bg.pages.dev/jotter/astro/scripts/) - astro:after-swap vs astro:page-load migration
- [@astrojs/rss CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro-rss/CHANGELOG.md) - v4.0.15 current, Response-based API

### Tertiary (LOW confidence)
- None. All findings verified against primary or secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries are official Astro ecosystem packages with verified current versions
- Architecture: HIGH - Patterns verified against official Astro docs and Google structured data documentation
- Pitfalls: HIGH - Script migration issue verified by counting actual `astro:after-swap` usages in codebase (11 found); other pitfalls from official docs
- View Transitions: HIGH - ClientRouter API verified against official Astro 5 reference docs
- Cloudflare deployment: HIGH - Existing deploy workflow and wrangler config already functional

**Research date:** 2026-02-10
**Valid until:** 2026-03-10 (stable domain, Astro 5 patterns well-established)
