# Project Research Summary

**Project:** sebc.dev — Premium Technical Blog
**Domain:** Bilingual (FR/EN) developer blog with content at the intersection of AI, Engineering, and UX
**Researched:** 2026-02-09
**Confidence:** HIGH

## Executive Summary

This is a premium technical developer blog competing with the likes of Josh Comeau, Kent C. Dodds, and Lee Robinson. Research shows experts build these sites with modern static frameworks (Astro, Next.js), premium syntax highlighting (Expressive Code, Shiki), client-side search (Pagefind, Algolia), and strong SEO foundations. The differentiators are not novel features but polish: beautiful code blocks, smooth animations, excellent search, and MDX-powered interactive content.

The recommended approach is to build on the existing Astro 5 + Cloudflare + Tailwind v4 foundation with minimal additions: astro-seo for meta tags, Expressive Code for code blocks, and Pagefind JS API for custom search. Avoid heavy dependencies (no React islands, no animation frameworks, no comment systems at launch). Keep interactivity to vanilla JavaScript using IntersectionObserver and the Clipboard API. The bilingual nature (FR/EN) is a unique competitive advantage that most dev blogs lack, requiring careful i18n implementation from the start.

Key risks are: (1) Tailwind v4 breaking changes that make components look wrong without explicit utility renames, (2) Pagefind's silent indexing behavior that excludes pages without data-pagefind-body, (3) Cloudflare Pages' opinionated trailing-slash behavior conflicting with Astro's config, and (4) i18n 404 page handling with prefixDefaultLocale. These are all preventable with early configuration and staging deployment testing. The roadmap should prioritize foundation work (layouts, i18n, design tokens) before building features, and implement search last since it depends on having content to index.

## Key Findings

### Recommended Stack

The existing Astro 5.17.1 + Cloudflare + Tailwind v4 + Pagefind stack is correct for this domain. Research identified only 5 additional packages needed: 3 production deps (astro-seo, reading-time, mdast-util-to-string) and 2 dev deps (astro-expressive-code, rehype-autolink-headings). Everything else is either built into Astro, built into Pagefind, built into Cloudflare, or trivially implemented as a custom component.

**Core additions to existing stack:**

- **astro-seo v1.1.0**: SEO meta tags with OG/Twitter Card support — most mature Astro SEO library, 1:1 mapping to HTML tags, no magic
- **astro-expressive-code v0.41.6**: Premium code blocks with copy button, frames, diff highlighting, line markers — the single highest-ROI differentiator for a dev blog
- **reading-time + mdast-util-to-string**: Calculate "X min read" via official Astro recipe pattern
- **rehype-autolink-headings v7.1.0**: Clickable heading anchors — works with Astro's built-in heading IDs (no rehype-slug needed)
- **Pagefind JS API**: Custom search UI using Pagefind's JavaScript API instead of default widget — already installed, just use the API

**Key rejections:**

- NO React/Vue/Svelte islands for simple interactivity (TOC scroll spy, reading progress, copy buttons) — use inline `<script>` tags with vanilla JS
- NO heavy animation libraries (AOS, GSAP, Motion) — IntersectionObserver + CSS transitions is sufficient
- NO third-party i18n libraries — Astro's built-in `astro:i18n` module handles bilingual routing perfectly
- NO comment systems or newsletters at launch — defer to v2 after audience exists

### Expected Features

Research of 8 premium dev blogs (Josh Comeau, Kent Dodds, Tania Rascia, Dan Abramov, Lee Robinson, Sara Soueidan, Cassidy Williams) reveals clear feature expectations.

**Must have (table stakes):**

- Syntax-highlighted code blocks with copy button — universal across all reference blogs
- Estimated reading time, publication date, categories/tags — every blog shows these
- Dark theme with proper WCAG AA contrast — 80% of developers prefer dark mode
- Full-text search with filters — Kent Dodds and Josh Comeau use this; most blogs lack it (opportunity)
- Table of contents for long articles — Tania Rascia and Josh Comeau implement this
- Responsive design, mobile-first — over 50% of dev traffic is mobile
- Open Graph and Twitter Card meta tags — broken social previews = lost clicks
- RSS feed — developer audience heavily uses RSS readers
- Sticky navigation with language switcher — persistent nav is universal

**Should have (competitive differentiators):**

- Expressive Code blocks with frames, diff, line highlighting — matches Josh Comeau quality
- View Transitions for smooth navigation — Lee Robinson uses this for SPA feel
- Scroll-reveal animations — Josh Comeau's micro-interactions define his brand
- Pillar tag system (IA/Ingenierie/UX) — unique editorial position at intersection of three domains
- Custom MDX components (Callout, Aside, interactive demos) — Sara Soueidan's accessibility callouts, Josh Comeau's widgets
- Hreflang + visible translation linking — most bilingual blogs handle i18n poorly
- Cloudflare Analytics (privacy-first, no cookies) — aligns with developer values

**Defer (v2+):**

- Comment system (Giscus) — zero audience at launch, moderation burden
- Newsletter/email subscription — needs email service, GDPR compliance, template design
- Light theme toggle — dark-first is the brand identity; adding light theme doubles design work
- Dynamic OG image generation — use static fallback for v1, add Satori-based generation in v1.x
- Real-time code playgrounds (Sandpack) — adds 200KB+ bundle, kills Core Web Vitals

### Architecture Approach

Build on Astro's zero-JS-by-default philosophy with static rendering and minimal client-side interactivity. Use inline `<script>` tags in Astro components for simple DOM manipulation (scroll tracking, IntersectionObserver, clipboard API, filter toggles) rather than framework islands. Centralize i18n in a translation dictionary (`src/i18n/ui.ts`) with a `useTranslations()` helper. Centralize content queries in a data access layer (`src/lib/articles.ts`) to prevent duplicating `getCollection()` logic across pages. Use Pagefind's JS API for a fully custom search experience matching the design mockups.

**Major components:**

1. **BaseLayout + Header/Footer/Nav** — structural foundation with i18n-aware navigation and language switcher; owns fade-up animations via IntersectionObserver
2. **Article page ecosystem** — ArticleCard, FeaturedArticle, TOC, ReadingProgress, ShareButtons, RelatedArticles; article layout uses sidebar grid (lg:grid-cols-[1fr_240px]) for TOC/share/tags
3. **Search page with Pagefind** — custom search UI using Pagefind JS API with sidebar filters, grid/list toggle, and active filter chips; all search components coordinated by single page-level script
4. **Home page with category filters** — featured article + card grid with category filter buttons; client-side filtering with ~30 lines of vanilla JS
5. **Data access layer (lib/articles.ts)** — encapsulates all content collection queries (getArticlesByLocale, getFeaturedArticle, getRelatedArticles) with locale filtering and sorting

**Critical patterns:**

- i18n translation dictionary with `useTranslations(locale)` returning type-safe `t()` function
- Article queries abstracted to `lib/articles.ts` to prevent duplicate filter logic
- Inline `<script>` tags for interactivity, NOT framework islands (zero framework JS shipped)
- Pagefind JS API for custom search rather than default widget (full control over markup/behavior)

### Critical Pitfalls

Research identified 8 critical and 12 moderate pitfalls. Top 5 by impact:

1. **Tailwind v4 utility scale renames** — `rounded`, `shadow`, `blur` without explicit size suffixes render smaller in v4 than v3; requires explicit `-sm`/`-xs` suffixes and updated scale mapping. Prevention: establish design-token-to-Tailwind mapping document before building components.

2. **Tailwind v4 @apply requires @reference in Astro style blocks** — component-scoped `<style>` blocks cannot use `@apply` without `@reference "../styles/global.css"` directive. Prevention: prefer utility classes in markup; when @apply is unavoidable, add @reference with correct relative path.

3. **Pagefind data-pagefind-body silently excludes pages** — once any page has data-pagefind-body, ALL pages without it disappear from search index. Prevention: scope to article content only, add data-pagefind-ignore to nav/footer/sidebar.

4. **Cloudflare Pages trailing slash conflict** — Cloudflare Pages forces trailing slashes on directory-based routes, contradicting `trailingSlash: "never"` config, causing redirect chains. Prevention: change to `trailingSlash: "always"` to match Cloudflare behavior, or verify staging deployment.

5. **i18n 404 broken with prefixDefaultLocale** — unprefixed URLs show blank 404 instead of custom error page. Prevention: create root `/404.astro`, locale-specific `/en/404.astro` and `/fr/404.astro`, and test on Cloudflare Pages staging.

Additional moderate pitfalls: glob loader entry.id includes folder paths, Cloudflare Auto Minify breaks island hydration, Pagefind multilingual index depends on `<html lang>` attribute, Google Fonts CDN violates GDPR for EU audience, compressHTML may strip code block whitespace.

## Implications for Roadmap

Based on research, the roadmap should follow a strict dependency order: foundation first (layouts + i18n + data layer), then pages in order of complexity (home, article, search), with search last because it depends on content existing. Avoid the temptation to build features in parallel — the architecture patterns and i18n foundation must be solid before building pages.

### Phase 1: Foundation (Layout + i18n + Design System)

**Rationale:** Everything depends on BaseLayout, Header/Footer, i18n utilities, and correctly mapped Tailwind v4 design tokens. Building pages before this foundation leads to refactoring all pages later. ARCHITECTURE.md explicitly calls out this build order.

**Delivers:**
- BaseLayout with Header/Footer integrated
- i18n translation dictionary (ui.ts + utils.ts) with useTranslations() helper
- Language switcher component with locale detection
- Data access layer (lib/articles.ts) for content queries
- Design token verification (Tailwind v4 scale mapping to design report specs)
- Utility components (Tag, GlowLine)
- Date formatting utils with locale awareness

**Addresses:**
- Pitfall 1 (Tailwind v4 scale renames) — validate design tokens early
- Pitfall 2 (@apply requires @reference) — establish styling convention
- Pitfall 4 (trailing slash conflict) — configure and verify on staging
- Pitfall 5 (i18n 404 broken) — create root and locale-specific 404 pages

**Avoids:**
- Building pages with hardcoded i18n strings
- Duplicating content queries across pages
- Inconsistent visual design from wrong Tailwind scale

**Research flag:** SKIP research — Astro i18n, Tailwind v4, and layout patterns are well-documented.

---

### Phase 2: Home Page

**Rationale:** Simplest page with reusable components (ArticleCard) that other pages will use. Establishes the article card pattern used by search and related articles. ARCHITECTURE.md build order places this before article page.

**Delivers:**
- Article card components (CoverImage, ArticleMeta, ArticleCard, FeaturedArticle)
- Home page with featured article + article grid
- Category filter buttons with client-side filtering (vanilla JS)
- Pagination component (if needed for >10 articles)

**Addresses:**
- Must-have feature: article listing with cards (FEATURES.md table stakes)
- Architecture component: home page with category filters
- Responsive design validation (mobile-first grid)

**Uses:**
- lib/articles.ts queries (getArticlesByLocale, getFeaturedArticle)
- i18n for UI strings (filter labels, metadata labels)
- Tag component from Phase 1

**Avoids:**
- Building article page first (would duplicate card logic)

**Research flag:** SKIP research — standard Astro static page with straightforward filtering.

---

### Phase 3: Article Page

**Rationale:** Core product. Most complex page layout with sidebar grid, TOC, reading progress, share buttons. Requires ArticleLayout extending BaseLayout. Must come after home page so ArticleCard is reusable for related articles section.

**Delivers:**
- ArticleLayout with sidebar grid (lg:grid-cols-[1fr_240px])
- Table of contents with scroll spy (IntersectionObserver)
- Reading progress bar (scroll tracking)
- Share buttons (Twitter, LinkedIn, dev.to, copy link with Clipboard API)
- Related articles section (reuses ArticleCard from Phase 2)
- MDX rendering with Expressive Code blocks
- SEO meta tags with astro-seo (OG, Twitter Card, JSON-LD structured data)
- Hreflang alternates for translations
- RSS feed generation (@astrojs/rss)

**Addresses:**
- Must-have features: code blocks with copy button, TOC, reading progress, share buttons, reading time, SEO meta tags, RSS
- Differentiator features: Expressive Code frames/diff/line highlighting, scroll-reveal animations
- Architecture component: article page ecosystem

**Uses:**
- astro-seo for meta tags (from STACK.md)
- astro-expressive-code for code blocks (from STACK.md)
- rehype-autolink-headings for heading anchors (from STACK.md)
- reading-time + mdast-util-to-string via remark plugin (from STACK.md)
- ArticleCard from Phase 2 for related articles

**Avoids:**
- Pitfall 3 (Pagefind indexing gaps) — add data-pagefind-body to article content, data-pagefind-ignore to nav/footer/sidebar

**Research flag:** SKIP research for most features (standard patterns). CONSIDER research for JSON-LD structured data schema if unfamiliar.

---

### Phase 4: Search Page

**Rationale:** Most complex client-side interactivity. Depends on having articles published to index. Pagefind generates index during build, so this phase requires Phase 3 content to exist. Custom search UI using Pagefind JS API per ARCHITECTURE.md pattern.

**Delivers:**
- Search page layout with sidebar filters
- Custom search UI using Pagefind JS API (not default widget)
- Filter sidebar (categories, tags, reading time, date)
- Grid/list view toggle
- Active filter chips display
- Empty state for zero results
- Cmd+K keyboard shortcut
- Localized search (separate EN/FR indexes)

**Addresses:**
- Must-have feature: full-text search with filters (competitive advantage per FEATURES.md)
- Architecture component: search page with Pagefind
- Differentiator: search with filters (most dev blogs lack this)

**Uses:**
- Pagefind JS API (from STACK.md)
- ArticleCard or ResultCard variant for search results
- Filter UI components coordinated by single page script (per ARCHITECTURE.md pattern)

**Avoids:**
- Pitfall 3 (Pagefind indexing gaps) — verify articles have data-pagefind-body before indexing
- Pitfall 8 (wrong language index) — verify `<html lang>` attribute is correct, inspect dist/_pagefind/ for separate language indexes
- Using Pagefind default widget (fights custom design)

**Research flag:** MINOR research may be needed for Pagefind filter API if custom filters are complex. ARCHITECTURE.md provides pattern but may need API docs.

---

### Phase 5: About Page

**Rationale:** Simplest content page. Unique section components (Timeline, TechGrid) not reused elsewhere. Can be built independently after core blog functionality works.

**Delivers:**
- About page layout
- Section components (AboutHero, Timeline, TechGrid, ProjectCard, PhilosophyCard)
- Scroll-reveal animations (reuses IntersectionObserver from BaseLayout)

**Addresses:**
- Must-have feature: About page
- Responsive design validation for unique layouts

**Uses:**
- BaseLayout foundation from Phase 1
- Scroll-reveal animations already implemented in BaseLayout

**Avoids:**
- Overengineering — static sections, no complex state

**Research flag:** SKIP research — static content sections.

---

### Phase 6: Polish & Enhancements

**Rationale:** After all core pages work, add the finishing touches that elevate from "functional" to "premium."

**Delivers:**
- View Transitions (ClientRouter component in BaseLayout)
- Cloudflare Analytics script tag
- Sitemap i18n configuration validation
- Canonical URL verification across all pages
- Hreflang tag verification
- OG image fallback (static image for v1)
- Performance optimization (self-host Google Fonts if GDPR concern)
- Accessibility audit (WCAG AA contrast validation)

**Addresses:**
- Differentiator feature: View Transitions for smooth navigation
- Must-have: sitemap, canonical URLs, proper SEO
- Pitfall 9 (Google Fonts GDPR) — self-host fonts before EU launch
- All "Looks Done But Isn't" items from PITFALLS.md checklist

**Research flag:** SKIP research — checklist validation and config tweaks.

---

### Phase Ordering Rationale

This order strictly follows dependency chains discovered in research:

1. **Foundation before features** — i18n, layouts, and data access must be solid before building pages. ARCHITECTURE.md build order explicitly calls this out. Prevents refactoring all pages later.

2. **Home before article** — ArticleCard is reused by article page (related articles section) and search page (result cards). Building home first establishes the card pattern.

3. **Article before search** — Search depends on content existing to index. Pagefind generates index during build. Building search first means testing with no content.

4. **Search after article** — Search page is most complex client-side interactivity and least understood pattern. ARCHITECTURE.md notes Pagefind JS API is MEDIUM confidence. Build when everything else works.

5. **About page independent** — Can be built anytime after Phase 1, but deprioritized because it's not core blog functionality.

6. **Polish last** — View Transitions, analytics, and SEO validation require all pages to exist.

This ordering minimizes rework and avoids the pitfall of building features in parallel that depend on unstable foundations.

### Research Flags

**Phases needing deeper research during planning:**

- **Phase 4 (Search Page):** Pagefind JS API custom integration is MEDIUM confidence in ARCHITECTURE.md. May need API documentation review for filter state management and result rendering. Official Pagefind docs exist but the custom UI pattern with Astro is community-sourced.

**Phases with standard patterns (skip research-phase):**

- **Phase 1 (Foundation):** Astro i18n, layouts, Tailwind v4 are all official docs with HIGH confidence.
- **Phase 2 (Home Page):** Standard static page with article grid, well-documented patterns.
- **Phase 3 (Article Page):** Most features are standard Astro patterns (TOC from headings, scroll tracking, share buttons). Only JSON-LD structured data might need quick reference if unfamiliar.
- **Phase 5 (About Page):** Static content sections, zero novel patterns.
- **Phase 6 (Polish):** Checklist validation, no research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All packages verified via npm on 2026-02-09. Versions confirmed. Peer deps match. astro-seo 1.1.0, astro-expressive-code 0.41.6, reading-time 1.5.0 all recently published. Official Astro docs consulted for built-in features. |
| Features | HIGH | Direct analysis of 8 premium dev blogs with screenshots and feature inventories. Feature expectations validated across multiple sources. Competitive positioning clear. MVP definition informed by actual usage patterns. |
| Architecture | HIGH | Astro component patterns, i18n utilities, content collections all from official docs. IntersectionObserver and Clipboard API are standard browser APIs. Pagefind JS API documented officially. Structure follows Astro best practices. |
| Pitfalls | HIGH | Tailwind v4 pitfalls verified via official upgrade guide and GitHub issues. Pagefind behavior verified in official docs. Cloudflare Pages trailing slash confirmed via community discussions and docs. i18n 404 issue cross-referenced with Astro GitHub issue #12750. |

**Overall confidence:** HIGH

All four research dimensions achieved HIGH confidence through verification with official documentation, npm package inspection, direct competitor analysis, and cross-referencing multiple sources. No areas rely on single-source inference or speculation.

### Gaps to Address

Despite high confidence, there are areas requiring validation during implementation:

- **Pagefind custom search UI with Astro:** While Pagefind JS API is well-documented, the integration pattern with Astro's static build and locale-aware pages is community-sourced (MEDIUM confidence in ARCHITECTURE.md). Test thoroughly in both dev and production builds. Verify separate language indexes generate correctly.

- **Tailwind v4 @reference paths:** The @reference directive for enabling @apply in component style blocks requires correct relative paths. Different component directory depths need different paths. Decision needed: establish "no @apply" convention (use utilities in markup) or document @reference pattern with examples.

- **Translation completeness:** Content schema supports `translationSlug` for linking EN/FR versions of same article. Language switcher must handle cases where translation does not exist (show "Not available in French" or hide switcher). Decide UX pattern early.

- **Dynamic OG image generation:** Deferred to v1.x per FEATURES.md. Research mentions Satori or @vercel/og equivalent for Astro, but marked HIGH complexity. When implementing v1.x, will need dedicated research on Astro-compatible OG generation.

- **Staging deployment validation:** Multiple pitfalls (trailing slash, 404 pages, Cloudflare Auto Minify, Pagefind indexing) require Cloudflare Pages staging deployment to verify. Set up staging environment early in Phase 1.

None of these gaps block roadmap creation. They are implementation details to validate during the corresponding phases.

## Sources

### Primary (HIGH confidence)

- Astro Official Documentation — markdown/MDX, content collections, i18n routing, View Transitions, syntax highlighting, client-side scripts
- Tailwind CSS v4 Upgrade Guide — utility renames, @reference directive, gradient changes, CSS module behavior
- Pagefind Official Documentation — JS API, multilingual indexing, data-pagefind-body behavior, filter API
- Cloudflare Pages Documentation — trailing slash behavior, 404 handling, Web Analytics auto-injection
- npm package registry — verified versions for astro-seo 1.1.0, astro-expressive-code 0.41.6, reading-time 1.5.0, rehype-autolink-headings 7.1.0, mdast-util-to-string 4.0.0 on 2026-02-09
- Direct competitor analysis — inspected Josh Comeau (joshwcomeau.com), Kent C. Dodds (kentcdodds.com/blog), Tania Rascia (taniarascia.com), Dan Abramov (overreacted.io), Lee Robinson (leerob.com/blog), Sara Soueidan (sarasoueidan.com), Cassidy Williams (cassidoo.co/blog) for feature inventories

### Secondary (MEDIUM confidence)

- Astro GitHub Issues — #12750 (i18n 404 page bug with prefixDefaultLocale)
- Tailwind GitHub Issues — #15952 (@reference requirement confirmed)
- Community blog posts — Pagefind custom UI with Astro pattern, TOC with scroll spy in Astro (dev.to), structured data for SEO (industry guides)
- Cloudflare Community Forum — trailing slash discussion thread
- Schema.org structured data guides — BlogPosting schema for articles

### Tertiary (LOW confidence)

None. All findings validated with at least two sources or official documentation.

---
*Research completed: 2026-02-09*
*Ready for roadmap: yes*
