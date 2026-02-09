# Requirements: sebc.dev

**Defined:** 2026-02-09
**Core Value:** Le site incarne les valeurs defendues (UX, performance, qualite) tout en permettant une publication reguliere d'articles. Le medium est le message.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Layout & Navigation

- [ ] **LAYO-01**: User can see a sticky header with navigation links (Accueil, Recherche, A propos), logo (>_), and backdrop blur on scroll
- [ ] **LAYO-02**: User can switch between FR and EN via language toggle in header, navigating to the equivalent page in the other language
- [ ] **LAYO-03**: User can see a footer with site description, social links (GitHub, Twitter/X, LinkedIn, RSS), glow-line separator, and copyright
- [ ] **LAYO-04**: User experiences smooth page transitions via View Transitions (ClientRouter) when navigating between pages
- [ ] **LAYO-05**: User sees fade-up scroll-reveal animations on sections and article cards as they scroll into view

### Home Page

- [ ] **HOME-01**: User can see a featured article prominently displayed at the top of the home page with image, metadata, and description
- [ ] **HOME-02**: User can browse articles in a responsive grid (1/2/3 columns) with cards showing image, date, reading time, category, tags, and excerpt
- [ ] **HOME-03**: User can filter articles by category using filter buttons that toggle active state

### Article Page

- [ ] **ARTI-01**: User can read a full MDX article with Expressive Code blocks (copy button, language labels, line highlighting, editor frames)
- [ ] **ARTI-02**: User can navigate article sections via a sticky TOC sidebar (desktop) with scroll-spy highlighting the current section
- [ ] **ARTI-03**: User can see a reading progress bar at the top of the page that fills as they scroll through the article
- [ ] **ARTI-04**: User can see article metadata: date, estimated reading time, category, tags, and pillar tags (IA, Ingenierie, UX)
- [ ] **ARTI-05**: User can share the article via Twitter/X, LinkedIn, dev.to, or copy the link to clipboard
- [ ] **ARTI-06**: User can click heading anchor links to copy section URLs
- [ ] **ARTI-07**: User can discover related articles at the bottom of the page (matched by shared tags/category)
- [ ] **ARTI-08**: User can see pillar tags with distinctive visual treatment identifying the article's thematic intersection

### Search Page

- [ ] **SRCH-01**: User can search articles full-text using Pagefind custom JS API (not default widget) styled to match the design system
- [ ] **SRCH-02**: User can filter search results by category and tags via sidebar filters
- [ ] **SRCH-03**: User can toggle between grid and list views for search results
- [ ] **SRCH-04**: User can see active filter chips and remove individual filters
- [ ] **SRCH-05**: User arrives on search page with pre-applied filters when clicking a category or tag link from any page

### About Page

- [ ] **ABOU-01**: User can read a personal presentation and philosophy of the blog (learn in public, IA x Ingenierie x UX)
- [ ] **ABOU-02**: User can access social media links (GitHub, Twitter/X, LinkedIn, dev.to)

### SEO & Discoverability

- [ ] **SEO-01**: Each page has proper Open Graph meta tags (og:title, og:description, og:image, og:url, og:type)
- [ ] **SEO-02**: Each page has Twitter Card meta tags (summary_large_image)
- [ ] **SEO-03**: Each article page has JSON-LD structured data (BlogPosting schema with headline, datePublished, author, image, description)
- [ ] **SEO-04**: Each page has canonical URL and hreflang alternate links for both EN and FR versions
- [ ] **SEO-05**: RSS feeds are available for both languages (/en/rss.xml, /fr/rss.xml) with autodiscovery links in head

### i18n

- [ ] **I18N-01**: All UI strings (navigation, labels, buttons, dates, empty states) are translated in both FR and EN via centralized dictionary
- [ ] **I18N-02**: All pages are accessible via locale-prefixed URLs (/en/... and /fr/...)
- [ ] **I18N-03**: Language switcher links to the equivalent page in the other locale (not just the homepage)

### Infrastructure & Performance

- [ ] **INFR-01**: Site is deployed on Cloudflare Pages with static output
- [ ] **INFR-02**: Cloudflare Analytics is integrated (auto-injected or manual script)
- [ ] **INFR-03**: All pages are responsive mobile-first (375px, 640px, 768px, 1024px breakpoints)
- [ ] **INFR-04**: Dark theme passes WCAG AA contrast ratios (4.5:1 body text, 3:1 large text)
- [ ] **INFR-05**: Lighthouse scores >= 90 for Performance, Accessibility, and SEO on all pages

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Enhancement

- **CONT-01**: Custom MDX components library (Callout, Aside, FileTree, Steps, TabGroup)
- **CONT-02**: Dynamic OG image generation from article frontmatter (satori-based)
- **CONT-03**: Series/collection navigation for multi-part articles
- **CONT-04**: Interactive Astro island demos in articles

### Engagement

- **ENGM-01**: Newsletter / email subscription (Buttondown or ConvertKit)
- **ENGM-02**: Comment system (Giscus via GitHub Discussions)

### Design

- **DESG-01**: Light theme toggle
- **DESG-02**: Enhanced About page with timeline, tech grid, projects showcase

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time code playgrounds (Sandpack) | 200KB+ bundle, kills Core Web Vitals, requires React runtime |
| AI-powered features (chatbot, AI search) | Requires server infrastructure, disproportionate complexity |
| Analytics dashboard / view counts | Needs server-side persistence, "0 views" is demotivating |
| Multi-author support | Solo blog, YAGNI |
| Pagination with page numbers | <50 articles year 1, unnecessary routing complexity with i18n |
| Google Analytics | Privacy concern for dev audience, Cloudflare Analytics is privacy-first |
| Light theme | Dark-first is the brand identity, doubles design work |
| Newsletter at launch | Zero subscribers, needs email provider + GDPR compliance |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAYO-01 | Phase 1: Foundation | Pending |
| LAYO-02 | Phase 1: Foundation | Pending |
| LAYO-03 | Phase 1: Foundation | Pending |
| LAYO-04 | Phase 6: SEO, Polish & Deployment | Pending |
| LAYO-05 | Phase 1: Foundation | Pending |
| HOME-01 | Phase 2: Home Page | Pending |
| HOME-02 | Phase 2: Home Page | Pending |
| HOME-03 | Phase 2: Home Page | Pending |
| ARTI-01 | Phase 3: Article Page | Pending |
| ARTI-02 | Phase 3: Article Page | Pending |
| ARTI-03 | Phase 3: Article Page | Pending |
| ARTI-04 | Phase 3: Article Page | Pending |
| ARTI-05 | Phase 3: Article Page | Pending |
| ARTI-06 | Phase 3: Article Page | Pending |
| ARTI-07 | Phase 3: Article Page | Pending |
| ARTI-08 | Phase 3: Article Page | Pending |
| SRCH-01 | Phase 4: Search Page | Pending |
| SRCH-02 | Phase 4: Search Page | Pending |
| SRCH-03 | Phase 4: Search Page | Pending |
| SRCH-04 | Phase 4: Search Page | Pending |
| SRCH-05 | Phase 4: Search Page | Pending |
| ABOU-01 | Phase 5: About Page | Pending |
| ABOU-02 | Phase 5: About Page | Pending |
| SEO-01 | Phase 6: SEO, Polish & Deployment | Pending |
| SEO-02 | Phase 6: SEO, Polish & Deployment | Pending |
| SEO-03 | Phase 6: SEO, Polish & Deployment | Pending |
| SEO-04 | Phase 6: SEO, Polish & Deployment | Pending |
| SEO-05 | Phase 6: SEO, Polish & Deployment | Pending |
| I18N-01 | Phase 1: Foundation | Pending |
| I18N-02 | Phase 1: Foundation | Pending |
| I18N-03 | Phase 1: Foundation | Pending |
| INFR-01 | Phase 6: SEO, Polish & Deployment | Pending |
| INFR-02 | Phase 6: SEO, Polish & Deployment | Pending |
| INFR-03 | Phase 1: Foundation | Pending |
| INFR-04 | Phase 1: Foundation | Pending |
| INFR-05 | Phase 6: SEO, Polish & Deployment | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0

---
*Requirements defined: 2026-02-09*
*Last updated: 2026-02-09 after roadmap creation*
