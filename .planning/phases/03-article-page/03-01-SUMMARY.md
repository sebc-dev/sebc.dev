---
phase: 03-article-page
plan: 01
subsystem: "config + data"
tags:
  - expressive-code
  - rehype
  - i18n
  - article-data
dependency_graph:
  requires:
    - "01-01: i18n routing structure"
    - "01-02: global CSS variables"
    - "02-01: article content collection"
  provides:
    - "EC integration for code block rendering"
    - "Heading anchor generation"
    - "Article page CSS foundation"
    - "Related articles query function"
    - "Article page i18n strings"
  affects:
    - "03-02: All article page components depend on this foundation"
tech_stack:
  added:
    - "astro-expressive-code: Code block rendering with copy buttons, language labels"
    - "rehype-autolink-headings: Automatic heading anchor generation"
    - "hastscript: HTML AST node creation for rehype plugins"
  patterns:
    - "EC integration BEFORE mdx() in integrations array (critical ordering)"
    - "Rehype plugin chain: rehypeHeadingIds → rehypeAutolinkHeadings"
    - "Related article scoring: category match (+2), tag match (+1 each)"
key_files:
  created: []
  modified:
    - "astro.config.mjs: EC + rehype plugin configuration"
    - "src/styles/global.css: Heading anchor, TOC, progress bar, prose image styles"
    - "src/lib/articles.ts: Added getRelatedArticles()"
    - "src/i18n/ui.ts: Added 10 article page i18n keys (EN + FR)"
    - "package.json: Added EC, rehype-autolink-headings, hastscript"
decisions:
  - "EC placed before mdx() integration (EC must process code blocks before MDX)"
  - "Removed markdown.shikiConfig (replaced by EC configuration)"
  - "Removed pre.astro-code CSS selector (EC uses figure wrapper structure)"
  - "Related articles scored by category (+2) and tag overlap (+1 per shared tag)"
  - "Heading anchors use append behavior with # icon in span"
metrics:
  duration: "2 min"
  tasks: 2
  files_modified: 4
  dependencies_installed: 3
  completed: "2026-02-09"
---

# Phase 3 Plan 1: Article Page Foundation Summary

**One-liner:** Configured Expressive Code for syntax highlighting, added rehype heading anchors with hash links, extended article data layer with related article scoring, and added complete i18n strings for article page UI.

## Tasks Completed

### Task 1: Install and configure Expressive Code + rehype heading anchors
**Commit:** df59d02
**Status:** ✅ Complete

Installed `astro-expressive-code`, `rehype-autolink-headings`, and `hastscript`. Updated `astro.config.mjs` to place EC integration **before** `mdx()` (critical ordering for code block processing). Configured EC with `github-dark-default` theme and custom style overrides matching design system colors. Added rehype plugin chain for automatic heading ID generation and anchor link appending. Removed obsolete `markdown.shikiConfig` block and `pre.astro-code` CSS selector (EC generates its own HTML structure with `<figure>` wrappers). Added CSS for heading anchors (opacity on hover), TOC active state, reading progress bar transform, and prose image borders.

**Files modified:**
- `astro.config.mjs`
- `src/styles/global.css`
- `package.json`, `package-lock.json`

### Task 2: Extend article data layer and add i18n strings
**Commit:** 543ba46
**Status:** ✅ Complete

Added `getRelatedArticles()` function to `src/lib/articles.ts` that scores articles by category match (+2 points) and tag overlap (+1 point per shared tag), returning up to 3 most relevant articles. Extended `src/i18n/ui.ts` with 10 new article page translation keys in both English and French: `backToArticles`, `toc`, `share`, `tags`, `relatedArticles`, `shareTwitter`, `shareLinkedin`, `shareDevto`, `copyLink`, `linkCopied`.

**Files modified:**
- `src/lib/articles.ts`
- `src/i18n/ui.ts`

## Verification Results

✅ `npm run build` passes with Expressive Code active (ec.0vx5m.js, ec.xecu1.css generated)
✅ `npx astro check` reports 0 errors, 0 warnings
✅ `getRelatedArticles` exported from articles.ts
✅ All 10 i18n keys present in both EN and FR locales
✅ Heading anchor styles, TOC active styles, reading progress styles added to global.css
✅ Pre-commit hooks pass (Prettier, ESLint)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prettier formatting in articles.ts**
- **Found during:** Task 2 commit
- **Issue:** Pre-commit hook failed due to Prettier formatting of `getRelatedArticles()` function
- **Fix:** Ran `npx prettier --write src/lib/articles.ts` to apply project formatting rules
- **Files modified:** `src/lib/articles.ts`
- **Commit:** 543ba46 (included in Task 2 commit after formatting)

## Success Criteria Verification

- ✅ astro-expressive-code installed and configured **before** mdx() in integrations
- ✅ markdown.shikiConfig removed
- ✅ pre.astro-code CSS selector removed
- ✅ rehype-autolink-headings configured with rehypeHeadingIds before it
- ✅ global.css has heading anchor, TOC active, reading progress, and prose image styles
- ✅ getRelatedArticles() returns scored related articles by category and tag overlap
- ✅ All article page i18n strings exist in EN and FR
- ✅ Build passes cleanly with EC processing code blocks

## Integration Points

**Upstream dependencies satisfied:**
- i18n routing structure (01-01) ✅
- Global CSS variables (01-02) ✅
- Article content collection (02-01) ✅

**Downstream consumers enabled:**
- 03-02: ArticleLayout, TableOfContents, ShareButtons, RelatedArticles components can now use this foundation

## Self-Check: PASSED

Verified created/modified files exist:
```
✅ FOUND: astro.config.mjs
✅ FOUND: src/styles/global.css
✅ FOUND: src/lib/articles.ts
✅ FOUND: src/i18n/ui.ts
✅ FOUND: package.json
```

Verified commits exist:
```
✅ FOUND: df59d02 (Task 1: EC + rehype configuration)
✅ FOUND: 543ba46 (Task 2: Data layer + i18n)
```

Verified EC output in build:
```
✅ FOUND: dist/_astro/ec.0vx5m.js
✅ FOUND: dist/_astro/ec.xecu1.css
```

All files committed, all tests pass, build succeeds with EC integration active.
