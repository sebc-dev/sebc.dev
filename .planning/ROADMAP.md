# Roadmap: sebc.dev

## Overview

Build a premium bilingual (FR/EN) technical blog from the existing Astro 5 + Cloudflare foundation to a fully functional site with four pages (Home, Article, Search, About), polished design, and production-ready SEO. The roadmap follows a strict dependency chain: layout foundation first, then pages in order of reuse (Home establishes ArticleCard, Article is the core product, Search depends on content to index, About is independent), with SEO and deployment polish applied last across all pages.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Layout shell, i18n system, shared components, and design token validation (completed 2026-02-09)
- [x] **Phase 2: Home Page** - Featured article, article grid with cards, category filtering (completed 2026-02-09)
- [x] **Phase 3: Article Page** - Full MDX rendering, TOC, reading progress, share buttons, related articles (completed 2026-02-09)
- [x] **Phase 4: Search Page** - Custom Pagefind search UI with filters, grid/list toggle (completed 2026-02-10)
- [x] **Phase 5: About Page** - Personal presentation and social links (completed 2026-02-10)
- [x] **Phase 6: SEO, Polish & Deployment** - Meta tags, structured data, RSS, View Transitions, analytics, Lighthouse validation (completed 2026-02-10)

## Phase Details

### Phase 1: Foundation
**Goal**: Users can navigate between locale-prefixed pages via a sticky header with language switching, see a consistent footer, and experience scroll-reveal animations -- all responsive and accessible from the start.
**Depends on**: Nothing (first phase)
**Requirements**: LAYO-01, LAYO-02, LAYO-03, LAYO-05, I18N-01, I18N-02, I18N-03, INFR-03, INFR-04
**Success Criteria** (what must be TRUE):
  1. User sees a sticky header with navigation links (Accueil, Recherche, A propos), the >_ logo, and backdrop blur effect when scrolling
  2. User can click the language toggle in the header and navigate to the equivalent page in the other language (FR <-> EN)
  3. User sees a footer with site description, social links (GitHub, Twitter/X, LinkedIn, RSS), glow-line separator, and copyright on every page
  4. User sees fade-up scroll-reveal animations on sections as they scroll into view
  5. All UI strings (navigation, labels, buttons, date formats) display correctly in both FR and EN, and all pages are accessible via locale-prefixed URLs (/en/..., /fr/...)
**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md -- i18n translation system, GlowLine component, WCAG contrast documentation
- [x] 01-02-PLAN.md -- Layout components (Nav, LangSwitch, Header, Footer)
- [x] 01-03-PLAN.md -- BaseLayout integration, placeholder pages, 404, visual verification

### Phase 2: Home Page
**Goal**: Users land on the home page and can browse articles through a featured article hero and a filterable responsive grid of article cards.
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03
**Success Criteria** (what must be TRUE):
  1. User sees a featured article prominently displayed at the top of the home page with image, metadata, and description
  2. User can browse articles in a responsive grid (1 column on mobile, 2 on tablet, 3 on desktop) with cards showing image, date, reading time, category, tags, and excerpt
  3. User can filter articles by category using filter buttons that visually toggle their active state and immediately update the displayed articles
**Plans:** 2 plans

Plans:
- [x] 02-01-PLAN.md -- Seed MDX articles, article data access layer, date utility, Tag component, i18n strings
- [x] 02-02-PLAN.md -- FeaturedArticle, ArticleCard, CategoryFilter components, home page wiring, visual verification

### Phase 3: Article Page
**Goal**: Users can read a full MDX article with premium code blocks, navigate via TOC, track reading progress, share the article, and discover related content.
**Depends on**: Phase 2 (reuses ArticleCard for related articles)
**Requirements**: ARTI-01, ARTI-02, ARTI-03, ARTI-04, ARTI-05, ARTI-06, ARTI-07, ARTI-08
**Success Criteria** (what must be TRUE):
  1. User can read a full MDX article with Expressive Code blocks that include copy button, language labels, line highlighting, and editor frames
  2. User can navigate article sections via a sticky TOC sidebar on desktop, with scroll-spy highlighting the current section as they scroll
  3. User sees a reading progress bar at the top of the page that fills proportionally as they scroll through the article
  4. User can see article metadata (date, reading time, category, tags, pillar tags with distinctive visual treatment) and share the article via Twitter/X, LinkedIn, dev.to, or copy link
  5. User can discover related articles at the bottom of the page and click heading anchor links to copy section URLs
**Plans:** 2 plans

Plans:
- [x] 03-01-PLAN.md -- Expressive Code + rehype config, global CSS updates, article data layer (getRelatedArticles), i18n strings
- [x] 03-02-PLAN.md -- Article components (PillarTag, ArticleHeader, ShareButtons, TOC, ReadingProgress, RelatedArticles), ArticleLayout, dynamic route pages, visual verification

### Phase 4: Search Page
**Goal**: Users can search articles full-text and filter results by category, tags, and view mode using a custom-styled Pagefind integration.
**Depends on**: Phase 3 (needs articles with data-pagefind-body to index)
**Requirements**: SRCH-01, SRCH-02, SRCH-03, SRCH-04, SRCH-05
**Success Criteria** (what must be TRUE):
  1. User can type in a search field and see full-text search results rendered in the site's design system (not Pagefind default widget)
  2. User can filter search results by category and tags via sidebar filters, and see active filter chips that can be individually removed
  3. User can toggle between grid and list views for search results
  4. User arrives on search page with pre-applied filters when clicking a category or tag link from any other page
**Plans:** 3 plans

Plans:
- [x] 04-01-PLAN.md -- Pagefind instrumentation on ArticleLayout, getTags helper, search i18n strings
- [x] 04-02-PLAN.md -- Complete EN/FR search pages with Pagefind integration, sidebar filters, grid/list toggle, URL sync
- [x] 04-03-PLAN.md -- Cross-page pre-filter links (category badges, tags), visual verification checkpoint

### Phase 5: About Page
**Goal**: Users can learn about the blog author, the "learn in public" philosophy, and find social media links.
**Depends on**: Phase 1 (uses BaseLayout and foundation components only)
**Requirements**: ABOU-01, ABOU-02
**Success Criteria** (what must be TRUE):
  1. User can read a personal presentation covering the blog's philosophy (learn in public, IA x Ingenierie x UX intersection) in both FR and EN
  2. User can access social media links (GitHub, Twitter/X, LinkedIn, dev.to) from the About page
**Plans:** 2 plans

Plans:
- [x] 05-01-PLAN.md -- i18n keys, Pagefind pillar tag indexing, PillarBlock component
- [x] 05-02-PLAN.md -- EN/FR About pages (hero, pillar blocks, social icons, CTA), visual verification

### Phase 6: SEO, Polish & Deployment
**Goal**: Every page has proper SEO meta tags, structured data, RSS feeds, View Transitions, analytics, and passes Lighthouse audits -- the site is production-ready.
**Depends on**: Phases 1-5 (all pages must exist for cross-cutting verification)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, LAYO-04, INFR-01, INFR-02, INFR-05
**Success Criteria** (what must be TRUE):
  1. Every page has correct Open Graph and Twitter Card meta tags, and article pages have JSON-LD BlogPosting structured data
  2. Every page has canonical URL and hreflang alternate links pointing to both EN and FR versions
  3. RSS feeds are available at /en/rss.xml and /fr/rss.xml with autodiscovery links in the HTML head
  4. User experiences smooth page transitions via View Transitions (ClientRouter) when navigating between pages
  5. Site is deployed on Cloudflare Pages with Cloudflare Analytics integrated, and all pages score >= 90 on Lighthouse Performance, Accessibility, and SEO
**Plans:** 3 plans

Plans:
- [x] 06-01-PLAN.md -- SEO components (OG, Twitter Cards, canonical/hreflang, RSS autodiscovery), JsonLd component, RSS feed endpoints, wiring into all pages
- [x] 06-02-PLAN.md -- View Transitions (ClientRouter) + migration of all 11 scripts from astro:after-swap to astro:page-load
- [x] 06-03-PLAN.md -- Default OG image, Lighthouse CI config update, quality validation, Cloudflare Analytics checkpoint

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation | 3/3 | ✓ Complete | 2026-02-09 |
| 2. Home Page | 2/2 | ✓ Complete | 2026-02-09 |
| 3. Article Page | 2/2 | ✓ Complete | 2026-02-09 |
| 4. Search Page | 3/3 | ✓ Complete | 2026-02-10 |
| 5. About Page | 2/2 | ✓ Complete | 2026-02-10 |
| 6. SEO, Polish & Deployment | 3/3 | ✓ Complete | 2026-02-10 |
