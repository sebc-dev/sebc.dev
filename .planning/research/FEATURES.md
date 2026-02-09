# Feature Research

**Domain:** Premium technical developer blog (personal, bilingual FR/EN)
**Researched:** 2026-02-09
**Confidence:** HIGH -- based on direct analysis of 8+ premium dev blogs and verified ecosystem patterns

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or amateur.

#### Content Display

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Syntax-highlighted code blocks | Every premium dev blog has them. Developers will not read unstyled code. | LOW | Astro ships Shiki built-in. Use Expressive Code integration for frames, copy button, line highlighting. Already standard in Astro ecosystem. |
| Copy-to-clipboard on code blocks | Josh Comeau, Tania Rascia, Kent Dodds -- all have it. Developers copy code constantly. | LOW | Expressive Code includes this out of the box. Zero custom work. |
| Estimated reading time | Every blog in the reference set shows it (Kent Dodds: "5 min read", Tania Rascia, Josh Comeau). Sets reader expectations. | LOW | Calculate from word count at build time. ~200 WPM for technical content. Store in frontmatter or compute in layout. |
| Publication date | Universal across all reference blogs. Developers judge content freshness by date. | LOW | Already in content schema. Format with Intl.DateTimeFormat for locale-aware display (FR/EN). |
| Category and tag display | Kent Dodds has 20+ topic filters. Tania Rascia uses categories. Cassidy Williams has 10 tag categories. Content without taxonomy feels unsearchable. | LOW | Already in content schema (category, tags, pillarTags). Clickable links to search page with pre-applied filters. |
| Responsive design (mobile-first) | Over 50% of dev traffic is mobile. Non-responsive = immediate bounce. | MEDIUM | Design report specifies breakpoints (375px/640px/768px/1024px). All layouts grid-based with Tailwind responsive utilities. |
| Dark theme done well | 80%+ of developers prefer dark mode. This project is dark-first by design choice -- but it must be executed with proper contrast. | MEDIUM | Design tokens already defined (5 surface levels, 3 text levels). Validate WCAG AA contrast ratios (4.5:1 minimum for body text, 3:1 for large text). #a0a0a0 on #181818 = 7.4:1 ratio -- passes. |

#### Navigation and Discovery

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Sticky header with navigation | Josh Comeau, Kent Dodds, Tania Rascia, Sara Soueidan -- all have persistent navigation. Users expect to reach any page from anywhere. | LOW | Design report specifies: `sticky top-0 bg-canvas/90 backdrop-blur-lg`. 3 nav items + language switcher. |
| Full-text search | Kent Dodds has topic-based search. Josh Comeau uses Algolia. Cassidy Williams has tag filtering. Readers of technical content need to find specific topics. | MEDIUM | Pagefind already in the stack. Generates client-side index at build time. Style with design tokens. Add `data-pagefind-filter` attributes for category/tag filtering. |
| Article listing with cards | Every reference blog has some form of article grid/list. Josh Comeau: category pages. Tania Rascia: grid with thumbnails. Kent Dodds: featured + chronological list. | MEDIUM | Design report specifies grid (1/2/3 columns) with image, metadata, tags. Both grid and list views designed. |
| Language switcher (FR/EN) | For a bilingual blog, this is non-negotiable. Users who land on wrong language will leave. | LOW | i18n routing already set up. Switcher in header per design report. Link each article to its translation via `translationSlug` in schema. |

#### Article Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Table of contents (TOC) | Josh Comeau has heading-linked numbered sections. Tania Rascia added TOC in v7.0 redesign. Long-form technical articles without TOC feel unprofessional. | MEDIUM | Astro provides `headings` from rendered markdown. Display in sticky sidebar on desktop (design report: `lg:grid-cols-[1fr_240px]`). Hide on mobile. Highlight current section with scroll spy. |
| Reading progress indicator | Already in design report. Josh Comeau popularized it. Sets reading expectations on long articles. | LOW | Fixed bar at top of page. JS: `scrollTop / (scrollHeight - clientHeight) * 100`. Tiny script, no framework needed. |
| Share buttons | Brief explicitly calls out: Twitter/X, LinkedIn, dev.to, copy link. Kent Dodds and Sara Soueidan have social links. Developers share good content. | LOW | Static links using share URLs (no API needed). Twitter: `https://twitter.com/intent/tweet?url=...&text=...`. LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=...`. Copy link: Clipboard API. |
| Related articles | Josh Comeau shows related posts. Tania Rascia links related content. Keeps readers engaged and reduces bounce rate. | MEDIUM | Match by shared tags/category. Display 2-3 articles at bottom of post. Already in design report layout. |
| MDX rendering with custom components | Josh Comeau's entire blog identity is built on interactive MDX components. Sara Soueidan uses custom callouts. This is what makes a dev blog feel premium vs generic. | MEDIUM | Astro MDX integration already installed. Create reusable components: Callout/Aside, CodeBlock (via Expressive Code), and potentially interactive demos later. |

#### SEO and Discoverability

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Open Graph meta tags | Lee Robinson has full OG setup with `summary_large_image`. Without OG tags, shared links look broken on social media. | LOW | Add to BaseLayout: og:title, og:description, og:image, og:url, og:type. Per-page override in article layout. Image: 1200x630px minimum. |
| Twitter Card meta tags | Same as OG -- broken preview on Twitter/X = lost clicks. | LOW | `twitter:card=summary_large_image`, twitter:title, twitter:description, twitter:image. Falls back to OG if absent, but explicit is better. |
| Structured data (JSON-LD) | Article schema improves CTR by 20-30% per industry studies. Google uses it for rich results. Critical for a blog targeting search traffic. | MEDIUM | JSON-LD in article pages: `@type: BlogPosting`, headline, datePublished, dateModified, author, image, description. Add `@type: WebSite` with SearchAction on home. |
| Canonical URLs | Essential for bilingual sites to avoid duplicate content penalties. | LOW | Set `<link rel="canonical">` per page. For translations, use `hreflang` alternates pointing to each language version. |
| RSS feed | Sara Soueidan, Tania Rascia, Cassidy Williams, Kent Dodds -- all have RSS. Developer audience uses RSS readers heavily. Not having one signals "not serious." | LOW | Use `@astrojs/rss`. Create `/en/rss.xml` and `/fr/rss.xml`. Add autodiscovery `<link>` in `<head>`. Include full article content or description. |
| Sitemap | Already in stack (`@astrojs/sitemap`). Search engines need it. | LOW | Already configured. Verify bilingual URLs are included with hreflang annotations. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but create the "premium" feeling.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Expressive Code blocks (frames, diff, line highlighting, collapsible sections) | Josh Comeau's code blocks are legendary. Expressive Code gives similar quality for free: editor/terminal window frames, line markers, diff highlighting, collapsible regions, line numbers. Goes beyond "syntax highlighting" into "teaching tool." | LOW | `astro-expressive-code` package. Drop-in Astro integration. Themes customizable to match design tokens. This is the single highest-ROI differentiator for a dev blog. |
| View Transitions (smooth page navigation) | Lee Robinson uses View Transitions API for SPA-like feel. Astro has first-class support via `ClientRouter`. Turns static MPA into buttery-smooth navigation. Feels modern, premium, app-like. | LOW | Add `<ClientRouter />` to BaseLayout. Named transitions on shared elements (header, article cards). Two lines of code for basic setup. Progressive enhancement -- works without JS. |
| Scroll-reveal animations (fade-up, stagger) | Josh Comeau's micro-interactions define his brand. The design report already specifies fade-up with IntersectionObserver and stagger delays. Turns a static page into something alive. | LOW | Already designed. Small inline `<script>` in BaseLayout. CSS keyframes + `.in-view` class toggle. No library needed. |
| Pillar tag system (IA / Ingenierie / UX) | Unique editorial position at the intersection of three domains. No other dev blog frames content this way. Visual pillar indicators on article cards create instant brand recognition. | LOW | Already in content schema as `pillarTags`. Design visual treatment: colored dots, icons, or badges per pillar. Three colors or icons that become brand signatures. |
| Custom MDX components (Callout, Aside, interactive demos) | Josh Comeau's `<Aside>` component, interactive widgets, and custom demos are what make his blog unmistakable. Sara Soueidan uses callouts for accessibility notes. Custom components transform articles from "text with code" into "interactive learning experiences." | MEDIUM | Start with 3-5 foundational components: `<Callout>` (info/warning/tip variants), `<Aside>` (sidenote), `<FileTree>`, `<Steps>`, `<TabGroup>`. Add interactive demos later. Each component leverages design tokens for consistent styling. |
| OG image generation (dynamic) | Lee Robinson, Kent Dodds -- their shared links always have beautiful, branded preview cards. Auto-generated OG images with article title, category, and branding create professional social presence without manual design work. | HIGH | Use `satori` or `@vercel/og` equivalent for Astro. Generate at build time from article frontmatter. Template: dark background, article title, pillar tag, branding. Defer to v1.x if time-constrained -- static fallback OG image works for launch. |
| Hreflang + translation linking | Most bilingual dev blogs handle i18n poorly. Proper hreflang signals, with visible "Read in English / Lire en francais" links on each article, show polish. Google rewards proper implementation with better multilingual ranking. | MEDIUM | Already have `translationSlug` in schema. Add `<link rel="alternate" hreflang="en" href="...">` and `<link rel="alternate" hreflang="fr" href="...">` to each article. Add visible translation link near article header. |
| Cloudflare Analytics (privacy-first) | No cookie banner needed. Sara Soueidan uses no third-party tracking. Privacy-first analytics aligns with developer audience values. "No cookies" is a trust signal. | LOW | Already decided in PROJECT.md. Single `<script>` tag from Cloudflare dashboard. Zero configuration. No GDPR cookie consent needed. |
| Code block language labels | Visual indicator of language (CSS, TypeScript, Bash) on each code block header. Small detail that aids scanning. | LOW | Expressive Code shows language labels in editor frames by default. Matches design report's code block header spec. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this specific project.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Comment system (Giscus, Disqus) | "Engagement," "community building" | Adds JavaScript weight. Requires GitHub account (Giscus) or third-party service (Disqus). Moderation burden with zero audience. Comments on most dev blogs are either spam or "great article!" -- not valuable discussion. Josh Comeau and Dan Abramov have NO comments. Lee Robinson has no comments. | Defer entirely. Use Twitter/X and LinkedIn share buttons instead. If engagement emerges, add Giscus in v2 when there is actual audience to moderate. PROJECT.md already lists this as out of scope. |
| Newsletter/email subscription | "Build an audience," "capture leads" | Requires email service provider (ConvertKit, Buttondown). GDPR compliance for FR audience. Template design. Sending infrastructure. Maintenance burden. Zero subscribers at launch = discouraging. | Defer to v2. RSS feed serves the "subscribe" use case for the developer audience. Add newsletter when publishing cadence is established (3+ months of regular content). PROJECT.md already lists this as out of scope. |
| Light theme toggle | "Accessibility," "user preference" | Design is "Minimal Depth" -- specifically dark-first. Building a quality light theme doubles the design work. Dan Abramov has dark mode. The design tokens are all dark-optimized. Half-baked light mode is worse than no light mode. | Stay dark-only for v1. Ensure WCAG AA contrast compliance in dark mode. If user demand emerges, consider adding light theme in v2 with dedicated design pass. PROJECT.md lists this as out of scope. |
| Real-time code playgrounds (Sandpack) | "Interactive learning," "Josh Comeau does it" | Josh Comeau's playgrounds are 100K+ lines of custom code. Sandpack adds ~200KB+ to client bundle. Kills Core Web Vitals. Enormous implementation complexity for a solo dev blog. Requires React runtime on pages. | Use Expressive Code for static, beautifully annotated code blocks. For truly interactive demos, use Astro islands with small, targeted components. Link to CodeSandbox/StackBlitz for "try it yourself" experiences. |
| AI-powered features (chatbot, AI search, AI summaries) | "Cutting edge," "AI x Engineering niche" | Requires server-side infrastructure (not static). API costs. Hallucination risk on technical content. Maintenance burden. Cloudflare Workers could technically support this, but complexity is disproportionate to value for a personal blog. | Write about AI instead of building AI features into the blog. Pagefind provides excellent client-side search without any AI. If ever needed, explore Cloudflare Workers AI in a future iteration. |
| Analytics dashboard / view counts | "Social proof," "popularity metrics" | Requires server-side hit counting or third-party service. MongoDB/Redis for persistence (Josh Comeau uses this). Privacy concerns. "0 views" on new articles is demotivating. Vanity metric that doesn't serve the "learn in public" mission. | Use Cloudflare Analytics for private author-facing stats. Do not display view counts publicly. Focus on content quality, not popularity metrics. |
| Multi-author support | "Future-proofing" | Solo blog. Adding author system adds schema complexity, routing complexity, and layout variants for zero benefit. YAGNI (You Ain't Gonna Need It). | Single author assumed everywhere. No author field needed in display. If guest posts ever happen, handle with a simple frontmatter field, not a full author system. |
| Pagination with page numbers | "Standard blog pattern" | With <50 articles (year 1), pagination is unnecessary complexity. Adds routing complexity with i18n. | Use "Load more" button on home page or show all articles with client-side filtering. Add pagination when article count exceeds 20-30. Start simple. |

## Feature Dependencies

```
[Content Collection Schema]
    |-- requires --> [MDX Integration] (already installed)
    |-- requires --> [i18n Routing] (already configured)
    |
    |-- enables --> [Article Page]
    |                   |-- requires --> [BaseLayout + Design Tokens]
    |                   |-- requires --> [Expressive Code] (code blocks)
    |                   |-- requires --> [TOC Component]
    |                   |-- requires --> [Reading Progress]
    |                   |-- enables  --> [Share Buttons]
    |                   |-- enables  --> [Related Articles]
    |                   |-- enables  --> [SEO Meta + JSON-LD]
    |
    |-- enables --> [Home Page]
    |                   |-- requires --> [ArticleCard Component]
    |                   |-- requires --> [Category Filters]
    |                   |-- enables  --> [Featured Article]
    |
    |-- enables --> [Search Page]
    |                   |-- requires --> [Pagefind Integration]
    |                   |-- requires --> [Filter UI (categories, tags)]
    |                   |-- enhances --> [Tag/Category Links from Articles]
    |
    |-- enables --> [RSS Feed]
                        |-- requires --> [@astrojs/rss]

[Header Component]
    |-- requires --> [BaseLayout]
    |-- requires --> [Language Switcher]
    |-- requires --> [Navigation Links]

[Footer Component]
    |-- requires --> [BaseLayout]
    |-- requires --> [Social Links]
    |-- requires --> [GlowLine Component]

[View Transitions]
    |-- requires --> [BaseLayout] (ClientRouter component)
    |-- enhances --> [All Page Navigation]

[Scroll Animations]
    |-- requires --> [BaseLayout] (IntersectionObserver script)
    |-- enhances --> [All Pages]

[OG Image Generation]
    |-- requires --> [Article Page SEO]
    |-- conflicts with --> [v1 Timeline] (defer if time-constrained)
```

### Dependency Notes

- **Article Page requires Expressive Code:** Code blocks are central to a dev blog. Install `astro-expressive-code` before building article layout, so code styling is resolved early.
- **Search Page requires Pagefind + Filter attributes:** Pagefind indexes at build time. `data-pagefind-filter` attributes must be on article templates before Pagefind can filter by category/tag. Build article page first, then search.
- **Home Page requires ArticleCard:** The card component is shared between home, search results, and related articles. Build it as a standalone component first.
- **View Transitions enhance all navigation:** Add `ClientRouter` to BaseLayout early. It affects all page transitions and must be tested across all pages.
- **RSS Feed requires content collection:** Build after articles are rendering correctly so feed content is validated.
- **OG Image Generation conflicts with v1 timeline:** Satori-based generation is complex. Use a static fallback OG image for launch. Add dynamic generation in v1.x.

## MVP Definition

### Launch With (v1)

Minimum viable product -- what's needed to publish and share articles confidently.

- [ ] **BaseLayout + Header + Footer** -- structural foundation, every page needs this
- [ ] **Article page with full MDX rendering** -- the core product; includes Expressive Code blocks, TOC sidebar, reading progress, metadata (date, reading time, category, tags), share buttons
- [ ] **Home page with article grid** -- featured article + card grid with category filters
- [ ] **Search page with Pagefind** -- full-text search with category/tag filtering
- [ ] **About page** -- personal presentation (simplified, design to be reworked per PROJECT.md)
- [ ] **SEO foundation** -- OG tags, Twitter cards, JSON-LD structured data, hreflang, canonical URLs, RSS feed
- [ ] **View Transitions** -- smooth page navigation (low effort, high impact)
- [ ] **Scroll animations** -- fade-up entrance animations (already designed, low effort)
- [ ] **Responsive design** -- mobile-first, all breakpoints tested
- [ ] **Cloudflare Analytics** -- single script tag

### Add After Validation (v1.x)

Features to add once the blog is live and content is being published regularly.

- [ ] **Dynamic OG image generation** -- trigger: first time sharing an article and wanting branded social cards
- [ ] **Custom MDX components library** -- trigger: writing articles that need callouts, asides, file trees, step-by-step guides
- [ ] **Interactive demos (Astro islands)** -- trigger: writing an article that truly needs interactivity beyond static code blocks
- [ ] **RSS feed with full content** -- trigger: readers requesting full content in feed readers
- [ ] **Enhanced Pagefind UI** -- trigger: article count exceeds 15-20 and default UI feels limiting
- [ ] **Reading time remaining in sidebar** -- trigger: writing very long articles (20+ min reads)

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Newsletter / email subscription** -- why defer: needs email service, GDPR compliance, template design, zero audience at launch
- [ ] **Comment system (Giscus)** -- why defer: needs audience first, moderation burden, GitHub dependency
- [ ] **Light theme** -- why defer: doubles design work, dark-first is the brand identity
- [ ] **Series/collection navigation** -- why defer: need multiple related articles first; `series` field already in schema for when ready
- [ ] **Article view counts** -- why defer: needs server-side infrastructure, "0 views" is demotivating on new content
- [ ] **Multi-language RSS feeds** -- why defer: verify demand from audience analytics first

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Expressive Code blocks | HIGH | LOW | P1 |
| Article page (MDX + TOC + progress + share) | HIGH | MEDIUM | P1 |
| Home page (featured + grid + filters) | HIGH | MEDIUM | P1 |
| Header + Footer + BaseLayout | HIGH | MEDIUM | P1 |
| SEO meta (OG, Twitter, JSON-LD, hreflang) | HIGH | LOW | P1 |
| RSS feed | HIGH | LOW | P1 |
| View Transitions | MEDIUM | LOW | P1 |
| Scroll animations | MEDIUM | LOW | P1 |
| Search page (Pagefind + filters) | HIGH | MEDIUM | P1 |
| About page | MEDIUM | MEDIUM | P1 |
| Cloudflare Analytics | MEDIUM | LOW | P1 |
| Responsive polish | HIGH | MEDIUM | P1 |
| Custom MDX components (Callout, Aside) | MEDIUM | MEDIUM | P2 |
| Dynamic OG images | MEDIUM | HIGH | P2 |
| Enhanced Pagefind filters | LOW | MEDIUM | P2 |
| Interactive Astro island demos | MEDIUM | HIGH | P3 |
| Newsletter | LOW | HIGH | P3 |
| Comment system | LOW | MEDIUM | P3 |
| Light theme | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch -- the blog does not work without these
- P2: Should have, add within first month of publishing
- P3: Nice to have, future consideration based on audience feedback

## Competitor Feature Analysis

| Feature | Josh Comeau | Dan Abramov | Tania Rascia | Sara Soueidan | Kent Dodds | Lee Robinson | Cassidy Williams | sebc.dev Plan |
|---------|-------------|-------------|--------------|---------------|------------|--------------|------------------|---------------|
| Dark mode | Yes (toggle) | Yes (default) | Yes (toggle) | No (light) | Yes (toggle) | Yes (toggle) | No (light) | Dark only (brand choice) |
| Syntax highlighting | Shiki + custom | Basic | Yes | Yes | Yes | Yes | Basic | Expressive Code (premium) |
| Copy code button | Yes | No | Yes | No | Yes | No | No | Yes (Expressive Code) |
| Code line highlighting | Yes (custom) | No | No | No | No | No | No | Yes (Expressive Code) |
| Code editor frames | Yes (custom) | No | No | No | No | No | No | Yes (Expressive Code) |
| TOC sidebar | Yes | No | Yes (v7) | No | No | No | No | Yes (sticky sidebar) |
| Reading progress | Yes | No | No | No | No | No | No | Yes (top bar) |
| Reading time | Yes | No | Yes | No | Yes | No | No | Yes |
| Search | Algolia | None | None | None | Topic filters | None | Tag filters | Pagefind + filters |
| Share buttons | No | No | No | No | No | No | No | Yes (Twitter, LinkedIn, dev.to, copy) |
| RSS feed | No | Yes | Yes | Yes | Yes | No | Yes | Yes |
| Comments | No | No | No | No | No | No | No | No (v2 consideration) |
| Newsletter | Yes | No | No | Yes | Yes | Yes (Substack) | Yes | No (v2 consideration) |
| i18n / bilingual | No | Yes (community) | No | No | No | No | No | Yes (FR/EN native) |
| Interactive demos | Yes (Sandpack) | No | No | No | No | No | No | Astro islands (v1.x) |
| View transitions | No | No | No | No | No | Yes | No | Yes (ClientRouter) |
| Animations | Yes (extensive) | Minimal | Minimal | Minimal | Minimal | Minimal | Minimal | Scroll reveal + hover (designed) |
| Structured data | Yes | No | No | Yes | No | Yes | Yes | Yes (JSON-LD) |
| OG images | Dynamic | Static | Static | Static | Dynamic | Dynamic | Static | Static v1, dynamic v1.x |
| Categories/tags | Yes | No | Yes | No | Yes (20+) | No | Yes (10) | Yes (category + tags + pillar tags) |
| Related articles | Yes | No | No | No | No | No | No | Yes |

### Key Competitive Insights

1. **No blog in the reference set has everything.** Dan Abramov has almost nothing -- and it works because his content is exceptional. Josh Comeau has everything -- and it works because the features ARE the content.

2. **sebc.dev occupies a unique position:** bilingual (only Abramov has community translations), dark-first with scroll animations (Josh Comeau territory but lighter), full search with filters (Kent Dodds territory), and the pillar tag system (IA/Ingenierie/UX) which nobody else has.

3. **The biggest gap in reference blogs is search.** Most premium dev blogs have NO search at all. Pagefind with category/tag filters is a genuine differentiator.

4. **Nobody else combines i18n + premium code blocks + search + animations.** This combination at launch would immediately position sebc.dev as technically polished.

5. **Content quality trumps features.** Dan Abramov proves that a minimalist blog with great writing wins. Features should enhance content, never distract from it.

## Sources

- [Josh Comeau - How I Built My Blog v2](https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/) -- HIGH confidence, primary source
- [Dan Abramov - Overreacted.io](https://overreacted.io/) -- HIGH confidence, direct inspection
- [Tania Rascia - taniarascia.com](https://www.taniarascia.com/) -- HIGH confidence, direct inspection
- [Sara Soueidan - sarasoueidan.com](https://www.sarasoueidan.com/) -- HIGH confidence, direct inspection
- [Kent C. Dodds - kentcdodds.com/blog](https://kentcdodds.com/blog) -- HIGH confidence, direct inspection
- [Lee Robinson - leerob.com/blog](https://leerob.com/blog) -- HIGH confidence, direct inspection
- [Cassidy Williams - cassidoo.co/blog](https://cassidoo.co/blog/) -- HIGH confidence, direct inspection
- [Expressive Code documentation](https://expressive-code.com/key-features/code-component/) -- HIGH confidence, official docs
- [Pagefind documentation](https://pagefind.app/) -- HIGH confidence, official docs
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/) -- HIGH confidence, official docs
- [Astro RSS recipe](https://docs.astro.build/en/recipes/rss/) -- HIGH confidence, official docs
- [Schema.org structured data for blogs](https://comms.thisisdefinition.com/insights/ultimate-guide-to-structured-data-for-seo) -- MEDIUM confidence, industry guide
- [Open Graph best practices](https://blog.codewithram.dev/blog/open-graph-for-social-sharing.html) -- MEDIUM confidence, developer guide
- [Dark mode accessibility / WCAG](https://www.accessibilitychecker.org/blog/dark-mode-accessibility/) -- MEDIUM confidence, accessibility guide

---
*Feature research for: sebc.dev premium technical developer blog*
*Researched: 2026-02-09*
