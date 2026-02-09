---
phase: 03-article-page
verified: 2026-02-09T18:46:52Z
status: human_needed
score: 8/8 must-haves verified (automated)
human_verification:
  - test: "Reading progress bar fills on scroll"
    expected: "Teal bar at top of viewport fills proportionally as user scrolls through article content"
    why_human: "Requires runtime scroll interaction to verify scaleX transform updates correctly"
  - test: "TOC scroll-spy highlights active section"
    expected: "As user scrolls, current heading highlighted in teal in sticky sidebar TOC"
    why_human: "Requires IntersectionObserver firing during real scroll behavior"
  - test: "Mobile TOC slide-in panel"
    expected: "FAB button visible on mobile, opens slide-in panel from right with backdrop, links close panel"
    why_human: "Requires viewport resize and touch interaction"
  - test: "Mobile tap-to-copy code blocks"
    expected: "Tapping a code block on mobile copies its content and shows fixed toast feedback"
    why_human: "Requires mobile viewport and clipboard API interaction"
  - test: "Heading anchor copy to clipboard"
    expected: "Hovering h2/h3 shows # link, clicking copies section URL and updates browser hash"
    why_human: "Requires hover interaction and clipboard API verification"
  - test: "Share button URLs open correctly"
    expected: "Twitter/LinkedIn/dev.to buttons open correct share intent URLs in new tabs"
    why_human: "Requires clicking links and verifying external service pages load with correct prefill"
  - test: "Expressive Code visual rendering"
    expected: "Code blocks show flat header bar with language label, copy button in code area, github-dark-default theme"
    why_human: "Visual verification of EC rendered output against design mockup"
  - test: "Pillar tag colors match design"
    expected: "IA=purple, Ingenierie=teal, UX=amber with correct bg/border/text color combos"
    why_human: "Visual color verification"
---

# Phase 3: Article Page Verification Report

**Phase Goal:** Users can read a full MDX article with premium code blocks, navigate via TOC, track reading progress, share the article, and discover related content.
**Verified:** 2026-02-09T18:46:52Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can read a full MDX article with Expressive Code blocks showing copy button, language labels, line highlighting, and editor frames | VERIFIED | `astro-expressive-code` configured before `mdx()` in `astro.config.mjs` (line 32 vs 48). Theme `github-dark-default` with design system overrides. 4/6 seed articles have fenced code blocks. EC CSS override styles in `global.css` (lines 149-277). Build generates EC assets (`ec.*.js`, `ec.*.css`). `shikiConfig` removed, `pre.astro-code` CSS removed. |
| 2 | User can navigate article sections via a sticky TOC sidebar on desktop with scroll-spy highlighting the current section | VERIFIED | `TableOfContents.astro` (74 lines) filters h2/h3 headings, renders as nav with `data-toc-link` anchors, includes IntersectionObserver scroll-spy script with `rootMargin: "-80px 0px -66% 0px"`. `ArticleLayout.astro` places TOC in `aside.hidden.lg:block > div.sticky.top-24`. `.toc-link.active` CSS in `global.css` (line 298-301). Mobile TOC via FAB + slide-in panel (lines 54-144 in ArticleLayout). |
| 3 | User sees a reading progress bar at the top of the page that fills as they scroll | VERIFIED | `ReadingProgress.astro` (33 lines) renders fixed `div#reading-progress` at `z-[60]` with `scaleX(0)` initial transform. Script uses `getBoundingClientRect()` + scroll listener (`passive: true`) to compute progress ratio. `#reading-progress` CSS in `global.css` (lines 304-307) sets `transform-origin: left` and transition. Rendered at top of `ArticleLayout` before content. |
| 4 | User can see article metadata including date, reading time, category, tags, and pillar tags with distinctive color styling | VERIFIED | `ArticleHeader.astro` (127 lines) renders: back link with SVG arrow, cover image with category badge (conditional), h1 title, description paragraph, metadata row with calendar SVG + `formatDate()`, clock SVG + readingTime + i18n, PillarTag components for each `pillarTags` entry, and Tag components for each tag. All wired with `getLangFromUrl` and `useTranslations`. |
| 5 | User can share the article via Twitter/X, LinkedIn, dev.to, or copy the link | VERIFIED | `ShareButtons.astro` (152 lines) builds 3 URL-based share intents (Twitter, LinkedIn, dev.to) with `target="_blank" rel="noopener noreferrer"` and correct URL encoding. Copy button uses `data-copy-url` attribute with clipboard API script. Visual feedback on copy (class toggle + aria-label change). All 4 buttons styled consistently. i18n aria-labels from `article.shareTwitter`, etc. |
| 6 | User can click heading anchor links to copy section URLs | VERIFIED | `rehype-autolink-headings` configured in `astro.config.mjs` (lines 19-29) with `behavior: "append"` and `.heading-anchor` class. `ArticleLayout.astro` script `initHeadingAnchorCopy()` intercepts clicks, copies URL with hash via `navigator.clipboard.writeText`, updates URL via `history.pushState`, adds `text-teal-bright` visual feedback for 1500ms. `.heading-anchor` CSS in `global.css` (lines 279-295) handles hover reveal. |
| 7 | User can discover related articles at the bottom of the page | VERIFIED | `RelatedArticles.astro` (28 lines) conditionally renders when `articles.length > 0`, uses `ArticleCard` in 2-column grid. `ArticleLayout.astro` calls `getRelatedArticles(article)` (line 22). `getRelatedArticles()` in `src/lib/articles.ts` (lines 31-53) scores by category (+2) and shared tags (+1 each), returns up to 3 articles. |
| 8 | Pillar tags have distinctive visual treatment: IA=purple, Ingenierie=teal, UX=amber | VERIFIED | `PillarTag.astro` (35 lines) normalizes pillar text (strips accents for comparison), maps to: IA=`bg-purple-500/15 border-purple-500/30 text-purple-400`, Ingenierie=`bg-teal/15 border-teal/30 text-teal-bright`, UX=`bg-amber-500/15 border-amber-500/30 text-amber-400`. Renders as `inline-flex` badge with `font-code`. Used in `ArticleHeader.astro` (line 114-116). |

**Score:** 8/8 truths verified (automated)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `astro.config.mjs` | EC integration before mdx(), rehype plugins, shikiConfig removed | VERIFIED | EC at line 32, mdx() at line 48. rehypePlugins in top-level markdown config. No shikiConfig. |
| `src/styles/global.css` | EC styles, heading anchor, TOC active, reading progress, prose image styles | VERIFIED | 314 lines. EC custom frame design (lines 149-277), heading anchors (278-295), TOC active (297-301), reading progress (303-307), prose images (309-313). |
| `src/lib/articles.ts` | getRelatedArticles() function | VERIFIED | 53 lines. Exports `getRelatedArticles()` with category/tag scoring algorithm. |
| `src/i18n/ui.ts` | Article page i18n keys in EN and FR | VERIFIED | 10 article keys present in both EN (lines 23-32) and FR (lines 49-58): backToArticles, toc, share, tags, relatedArticles, shareTwitter, shareLinkedin, shareDevto, copyLink, linkCopied. |
| `src/components/article/PillarTag.astro` | Pillar tag badge with per-pillar colors | VERIFIED | 35 lines (min 15). Accent-normalized comparison, 3-color map. |
| `src/components/article/ArticleHeader.astro` | Article title, description, cover image, metadata row, pillar tags | VERIFIED | 127 lines (min 40). Back link, conditional cover image, h1, description, metadata with date/reading time/pillar tags, tag list. |
| `src/components/article/ShareButtons.astro` | Social share links for Twitter, LinkedIn, dev.to, copy link | VERIFIED | 152 lines (min 30). 3 URL-based share links + copy button with clipboard API. |
| `src/components/article/TableOfContents.astro` | Sticky sidebar TOC with scroll-spy and h2/h3 indentation | VERIFIED | 74 lines (min 40). h2/h3 filter, data-toc-link, IntersectionObserver scroll-spy, pl-3/pl-5 indentation. |
| `src/components/article/RelatedArticles.astro` | Related articles section using ArticleCard | VERIFIED | 28 lines (min 20). Conditional render, 2-column grid, ArticleCard reuse. |
| `src/components/ui/ReadingProgress.astro` | Fixed reading progress bar at top of viewport | VERIFIED | 33 lines (min 10). Fixed div with scaleX transform, scroll listener with getBoundingClientRect. |
| `src/layouts/ArticleLayout.astro` | Article page layout with 2-column grid, sidebar, content area | VERIFIED | 298 lines (min 30). 2-column grid, sticky sidebar, mobile TOC, heading anchor copy, mobile code copy, language switching via translationMap. |
| `src/pages/en/articles/[id].astro` | EN dynamic article route with getStaticPaths | VERIFIED | 22 lines. Exports getStaticPaths filtering lang=en, uses render() from astro:content, passes Content+headings to ArticleLayout. |
| `src/pages/fr/articles/[id].astro` | FR dynamic article route with getStaticPaths | VERIFIED | 22 lines. Identical pattern to EN with lang=fr filter. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `astro.config.mjs` | `astro-expressive-code` | Integration placed before mdx() | WIRED | Line 32 (EC) precedes line 48 (mdx). Package installed and resolved. |
| `astro.config.mjs` | `rehype-autolink-headings` | mdx rehypePlugins (top-level markdown) | WIRED | Lines 19-29 in top-level `markdown.rehypePlugins` with rehypeHeadingIds before rehypeAutolinkHeadings. |
| `src/lib/articles.ts` | `astro:content` | getCollection query filtered by locale | WIRED | `getArticlesByLocale` uses `getCollection("articles")` with lang filter. `getRelatedArticles` calls `getArticlesByLocale`. |
| `src/pages/en/articles/[id].astro` | `ArticleLayout.astro` | imports and renders with article + headings props | WIRED | Imports ArticleLayout, passes `article={article} headings={headings}`, wraps `<Content />`. |
| `ArticleLayout.astro` | `TableOfContents.astro` | passes headings array | WIRED | Line 148: `<TableOfContents headings={headings} />`. |
| `ArticleLayout.astro` | `src/lib/articles.ts` | calls getRelatedArticles() | WIRED | Line 9: imports `getRelatedArticles`. Line 22: `const relatedArticles = await getRelatedArticles(article)`. Line 51: `<RelatedArticles articles={relatedArticles} />`. |
| `TableOfContents.astro` | `article :is(h2, h3)` | IntersectionObserver scroll-spy | WIRED | Line 44-45: queries `article :is(h2, h3)` headings. Lines 53-67: IntersectionObserver with threshold/rootMargin. |
| `ReadingProgress.astro` | article element | scroll event + getBoundingClientRect | WIRED | Lines 11-12: queries `article` element. Line 16: `getBoundingClientRect()`. Line 27: scroll listener. |
| `ShareButtons.astro` | external share URLs | URL-based share intents | WIRED | Lines 14-17: Twitter, LinkedIn, dev.to URLs with encodeURIComponent. Lines 29-90: anchor elements with target=_blank. |
| `ArticleLayout.astro` | `BaseLayout.astro` | translationMap prop chain | WIRED | Line 41: passes `translationMap={translationMap}`. Chain verified through BaseLayout -> Header -> LangSwitch (all accept and pass prop). |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| ARTI-01: MDX article with Expressive Code blocks | SATISFIED | None |
| ARTI-02: Sticky TOC sidebar with scroll-spy | SATISFIED | None |
| ARTI-03: Reading progress bar | SATISFIED | None |
| ARTI-04: Article metadata (date, reading time, category, tags, pillar tags) | SATISFIED | None |
| ARTI-05: Share via Twitter/X, LinkedIn, dev.to, copy link | SATISFIED | None |
| ARTI-06: Heading anchor links copy section URLs | SATISFIED | None |
| ARTI-07: Related articles at bottom | SATISFIED | None |
| ARTI-08: Pillar tags with distinctive visual treatment | SATISFIED | None |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/article/ShareButtons.astro` | 143 | `console.error("Failed to copy URL:", error)` | Info | Error logging for clipboard failure -- appropriate error handling, not a stub |
| `src/layouts/ArticleLayout.astro` | 186 | `console.error("Failed to copy URL:", error)` | Info | Error logging for heading anchor clipboard failure -- appropriate |

No blocker or warning-level anti-patterns found. The two console.error calls are appropriate error handling for clipboard API failures.

### Human Verification Required

### 1. Reading Progress Bar Scroll Behavior
**Test:** Visit `/en/articles/en-building-design-system`, scroll through the article
**Expected:** Teal bar at top of viewport fills proportionally from left to right as content scrolls
**Why human:** Requires runtime scroll interaction to verify scaleX transform updates

### 2. TOC Scroll-Spy Highlighting
**Test:** On desktop (>= 1024px), scroll through article sections
**Expected:** Current section highlighted in teal in sticky sidebar TOC, active state moves as scroll position changes
**Why human:** IntersectionObserver behavior depends on real scroll events and viewport geometry

### 3. Mobile TOC Slide-In Panel
**Test:** Resize to mobile width (< 1024px), tap FAB button in bottom-right corner
**Expected:** Panel slides in from right with backdrop blur, contains TOC links, closes on link click or backdrop click
**Why human:** Requires viewport resize and touch/click interaction

### 4. Mobile Tap-to-Copy Code Blocks
**Test:** On mobile viewport, tap a code block
**Expected:** Code is copied to clipboard, centered toast appears saying "Copied!" (or "Copie!" in FR)
**Why human:** Requires mobile viewport detection and clipboard API

### 5. Heading Anchor Copy
**Test:** Hover over any h2/h3 heading in article
**Expected:** "#" symbol appears on hover, clicking copies section URL to clipboard, URL hash updates, anchor briefly turns teal
**Why human:** Hover interaction + clipboard API + visual feedback timing

### 6. Share Buttons
**Test:** Click Twitter, LinkedIn, dev.to share buttons
**Expected:** Each opens correct share intent URL in new tab with article title and URL pre-filled
**Why human:** Requires verifying external service pages load correctly

### 7. Expressive Code Visual Rendering
**Test:** View code blocks in article pages
**Expected:** Flat header bar with language label right-aligned, copy button in code area, github-dark-default syntax theme, themed tooltip on copy success
**Why human:** Visual comparison against design mockup required

### 8. Pillar Tag Colors
**Test:** View article header metadata area
**Expected:** IA badges are purple, Ingenierie badges are teal, UX badges are amber
**Why human:** Color verification requires visual inspection

### 9. Cross-Language Article Switching
**Test:** On EN article page, click language switch to FR
**Expected:** Navigates to FR translation of the same article (not generic FR homepage)
**Why human:** Requires verifying translationSlug resolves correctly in browser

### Gaps Summary

No automated gaps found. All 13 artifacts exist, are substantive (well above minimum line counts), and are properly wired together. The build passes cleanly with 0 errors and 0 warnings from `astro check`. All 8 ARTI requirements have supporting code in place.

The phase delivered beyond plan scope: mobile TOC (FAB + slide-in panel), mobile tap-to-copy code blocks, cross-language article linking via translationSlug, and EC tooltip theming. These were user-requested enhancements during the checkpoint.

9 items flagged for human verification -- all involve runtime behavior (scroll, hover, click, clipboard API) or visual appearance that cannot be verified by static code analysis alone.

---

_Verified: 2026-02-09T18:46:52Z_
_Verifier: Claude (gsd-verifier)_
