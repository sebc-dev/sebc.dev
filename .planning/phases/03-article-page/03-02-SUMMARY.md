---
phase: 03-article-page
plan: 02
subsystem: "article components + layout"
tags:
  - article-layout
  - toc
  - reading-progress
  - share-buttons
  - mobile-ux
  - expressive-code
dependency_graph:
  requires:
    - "03-01: EC + rehype config, CSS foundation, getRelatedArticles, i18n strings"
    - "02-02: ArticleCard component for related articles"
    - "01-02: Header, LangSwitch components"
    - "01-03: BaseLayout"
  provides:
    - "Complete article reading experience at /en/articles/[id] and /fr/articles/[id]"
    - "Mobile TOC with floating FAB and slide-in panel"
    - "Mobile tap-to-copy for code blocks"
    - "Cross-language article linking via translationSlug"
  affects:
    - "Phase 4: Search page can link to article pages"
    - "Phase 6: SEO meta tags, View Transitions on article pages"
tech_stack:
  patterns:
    - "translationMap prop chain: ArticleLayout → BaseLayout → Header → LangSwitch"
    - "Mobile TOC: fixed FAB + slide-in overlay panel with backdrop"
    - "Mobile code copy: tap-to-copy with fixed toast feedback"
    - "EC CSS overrides: tooltip theming, flat header bar, language labels via script"
    - "Width breakpoint (max-width: 1023px) for mobile detection (not hover media query)"
key_files:
  created:
    - "src/components/article/PillarTag.astro"
    - "src/components/article/ArticleHeader.astro"
    - "src/components/article/ShareButtons.astro"
    - "src/components/article/TableOfContents.astro"
    - "src/components/article/RelatedArticles.astro"
    - "src/components/ui/ReadingProgress.astro"
    - "src/layouts/ArticleLayout.astro"
    - "src/pages/en/articles/[id].astro"
    - "src/pages/fr/articles/[id].astro"
  modified:
    - "src/styles/global.css: EC custom frame design, mobile copy toast, heading anchors, prose styles"
    - "src/layouts/BaseLayout.astro: Added translationMap prop passthrough"
    - "src/components/layout/Header.astro: Added translationMap prop passthrough"
    - "src/components/layout/LangSwitch.astro: Uses translationMap for article language switching"
    - "src/content/articles/*.mdx: Added fenced code blocks to 4 seed articles"
    - "astro.config.mjs: Moved rehypePlugins to top-level markdown config"
decisions:
  - "rehypePlugins must go in top-level markdown config, NOT on mdx() — otherwise EC's plugins get overridden"
  - "translationSlug frontmatter field for cross-language article linking"
  - "Mobile TOC as slide-in panel from right (not dropdown) for full-screen navigation"
  - "Mobile code copy uses max-width: 1023px (Chrome DevTools doesn't emulate hover media query)"
  - "Fixed-position toast on document.body for mobile copy feedback (avoids scroll container issues)"
  - "EC tooltip themed with --ec-frm-tooltipSuccessBg/Fg CSS variables"
  - "Double-RAF for toast animation to ensure paint before transition"
metrics:
  duration: "45 min (including iterative design fixes during checkpoint)"
  tasks: 2
  files_created: 9
  files_modified: 6
  checkpoint_fixes: 16
  completed: "2026-02-09"
---

# Phase 3 Plan 2: Article Components & Layout Summary

**One-liner:** Built complete article reading experience with 6 components, ArticleLayout, dynamic routes, mobile TOC, tap-to-copy code blocks, cross-language linking, and custom Expressive Code theming.

## Tasks Completed

### Task 1: Create article page components
**Commit:** e6d50c1
**Status:** ✅ Complete

Created 6 article components matching the design-research mockup:
- **PillarTag.astro**: Inline badge with per-pillar colors (IA=purple, Ingenierie=teal, UX=amber)
- **ArticleHeader.astro**: Back link, cover image with category badge, title, description, metadata row (date, reading time), pillar tags
- **ShareButtons.astro**: Twitter/X, LinkedIn, dev.to, copy link with URL-based share intents
- **TableOfContents.astro**: Scroll-spy TOC with IntersectionObserver, h2/h3 indentation, active state highlighting
- **RelatedArticles.astro**: 2-column grid using ArticleCard component
- **ReadingProgress.astro**: Fixed scaleX progress bar at top of viewport (z-60 above sticky header)

### Task 2: Create ArticleLayout and dynamic route pages
**Commit:** f3ebf85
**Status:** ✅ Complete

Created ArticleLayout with 2-column grid (content + sidebar), dynamic route pages for EN and FR using getStaticPaths. Layout includes ReadingProgress, ArticleHeader, prose content slot, RelatedArticles, and sidebar with TOC, tags, and share buttons. Heading anchor copy script handles click-to-copy section URLs.

### Checkpoint Fixes (16 iterations)
During human verification, the following issues were identified and fixed:

1. **b94fbc0** - Added fenced code blocks to 4 seed MDX articles (EC had no content to render)
2. **9051227** - Moved rehypePlugins from mdx() to top-level markdown config (EC plugins were being overridden)
3. **044517f** - Restyled EC to match design mockup (flat header bar, custom frame design)
4. **ef2c89f** - Fixed EC header red line (tab indicator), copy button position, language labels on all blocks
5. **febdf81** - Language label right-aligned in header, copy button inside code block (not header)
6. **f9332d3** - Removed border from EC copy button (::before and div)
7. **67bdeb2** - Cross-language article switching via translationSlug prop chain through 4 components
8. **2632317** - Mobile TOC: floating FAB button + slide-in panel with backdrop blur
9. **e7c7485** - Mobile tap-to-copy code blocks with clipboard API
10. **53b0ac5** - Width breakpoint (max-width: 1023px) instead of hover media query for mobile detection
11. **fb03608 → 9730332** - Mobile copy toast iterations: from per-block badge to fixed-position centered pill
12. **be1191b → 23c6e08** - Design system alignment: rounded-xs on copy toast, restored FAB to rounded-full
13. **9f80a4b** - EC tooltip themed with --ec-frm-tooltipSuccessBg/Fg CSS variables (teal on surface)
14. **e02752a** - EC tooltip arrow border color (border-inline-start-color)

## Verification Results

✅ `npm run build` passes with all 6 article pages generated (3 EN + 3 FR)
✅ Article pages render MDX content with Expressive Code blocks
✅ EC code blocks show flat header bar with filename/language label, copy button in code area
✅ TOC scroll-spy highlights active section on desktop
✅ Reading progress bar fills proportionally on scroll
✅ Share buttons open correct URLs, copy link works
✅ Heading anchors copy section URLs to clipboard on click
✅ Related articles show at bottom matched by category/tags
✅ Pillar tags display correct colors (IA=purple, Ingenierie=teal, UX=amber)
✅ Language switching works on article pages via translationSlug
✅ Mobile TOC slide-in panel opens/closes correctly
✅ Mobile tap-to-copy shows fixed toast feedback
✅ EC tooltip matches theme teal on desktop
✅ All labels correct in both EN and FR

## Deviations from Plan

### Enhancements Beyond Plan Scope (User-Requested During Checkpoint)

**1. Mobile TOC (not in original plan)**
- User requested floating FAB button + slide-in sidebar for mobile TOC navigation
- Implemented with overlay backdrop, slide transition, and auto-close on link click

**2. Mobile tap-to-copy (not in original plan)**
- User requested tap-to-copy since hover copy buttons don't work on mobile
- Implemented with clipboard API, fixed toast feedback, double-RAF for smooth animation

**3. Cross-language article linking (bug fix)**
- LangSwitch did simple path replacement but article IDs differ per language
- Fixed with translationSlug frontmatter field and translationMap prop chain

**4. EC tooltip theming (visual refinement)**
- Default EC tooltip didn't match site theme
- Override with CSS variables for teal color scheme

### Auto-fixed Issues

**1. [Rule 3] rehypePlugins placement**
- rehypePlugins on mdx() overrode EC's injected plugins
- Moved to top-level markdown config

**2. [Rule 3] Chrome DevTools mobile detection**
- hover:none media query not emulated in Chrome DevTools
- Switched to max-width: 1023px breakpoint

## Success Criteria Verification

- ✅ ARTI-01: Code blocks have copy button, language labels, editor frames via EC
- ✅ ARTI-02: Desktop sticky TOC sidebar with scroll-spy highlighting
- ✅ ARTI-03: Reading progress bar at top fills on scroll
- ✅ ARTI-04: Article metadata visible (date, reading time, category, tags, pillar tags)
- ✅ ARTI-05: Share via Twitter/X, LinkedIn, dev.to, copy link all functional
- ✅ ARTI-06: Heading anchors copy section URLs to clipboard
- ✅ ARTI-07: Related articles at bottom matched by tags/category
- ✅ ARTI-08: Pillar tags with distinctive colors (purple, teal, amber)
- ✅ Both EN and FR article pages render with correct locale labels
- ✅ Mobile TOC and tap-to-copy provide full mobile experience

## Integration Points

**Upstream dependencies satisfied:**
- 03-01: EC + rehype config, CSS foundation, getRelatedArticles, i18n ✅
- 02-02: ArticleCard component ✅
- 01-02: Header, LangSwitch ✅
- 01-03: BaseLayout ✅

**Downstream consumers enabled:**
- Phase 4: Search page can link to article pages at /[lang]/articles/[id]
- Phase 6: Article pages ready for SEO meta tags, View Transitions, Lighthouse audit

## Self-Check: PASSED

Verified created files exist:
```
✅ FOUND: src/components/article/PillarTag.astro
✅ FOUND: src/components/article/ArticleHeader.astro
✅ FOUND: src/components/article/ShareButtons.astro
✅ FOUND: src/components/article/TableOfContents.astro
✅ FOUND: src/components/article/RelatedArticles.astro
✅ FOUND: src/components/ui/ReadingProgress.astro
✅ FOUND: src/layouts/ArticleLayout.astro
✅ FOUND: src/pages/en/articles/[id].astro
✅ FOUND: src/pages/fr/articles/[id].astro
```

All files committed, checkpoint approved, article reading experience complete.
