# Phase 3: Article Page - Research

**Researched:** 2026-02-09
**Domain:** Astro 5 dynamic article page with Expressive Code, TOC scroll-spy, reading progress, social sharing
**Confidence:** HIGH

## Summary

Phase 3 builds the full article reading experience: a dynamic `[id].astro` page that renders MDX content with premium code blocks (Expressive Code), a sticky table of contents with scroll-spy, a reading progress bar, article metadata display with pillar tag styling, social sharing (Twitter/X, LinkedIn, dev.to, copy link), heading anchor links, and related articles.

The existing codebase has a solid foundation: content collection with `glob()` loader, flat `{lang}-{slug}.mdx` naming, `getArticleUrl()` producing `/{lang}/articles/{entry.id}`, reusable `ArticleCard` component, `Tag` component with variants, established `prose` CSS styles, and the `astro:after-swap` event pattern for script initialization.

**Primary recommendation:** Use `astro-expressive-code` (v0.41.6) as an Astro integration placed **before** `mdx()` in the integrations array, replacing the existing `shikiConfig`. Use Astro's built-in `render()` function to get both `Content` and `headings` for the TOC. Build scroll-spy and reading progress with vanilla `IntersectionObserver` and `scroll` event respectively. Social share uses simple URL-based sharing (no third-party libraries). Heading anchors via `rehype-autolink-headings`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro-expressive-code` | ^0.41.6 | Code blocks with copy button, frames, line highlighting, language labels | Official Astro community integration, replaces bare Shiki, includes all ARTI-01 requirements out of the box |
| `rehype-autolink-headings` | ^7.1.0 | Add clickable anchor links to headings | Standard rehype plugin, works with Astro's built-in heading ID generation |
| `@astrojs/markdown-remark` | (bundled) | Provides `rehypeHeadingIds` for anchor link ordering | Already included with Astro, needed to ensure heading IDs exist before autolink plugin runs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `hastscript` | ^9.0.0 | Create HAST nodes for rehype plugin content | Required by rehype-autolink-headings for defining anchor element content |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `astro-expressive-code` | Raw `shikiConfig` (current) | Shiki alone lacks copy button, editor frames, line markers, and language labels. Would require building all of ARTI-01 from scratch |
| `rehype-autolink-headings` | Custom Astro heading components | More control but requires MDX component overrides for every heading level; rehype is simpler and more standard |
| Vanilla scroll-spy | `tocbot` or similar | External library adds weight and configuration for what is 20-30 lines of IntersectionObserver code |

**Installation:**
```bash
npm install astro-expressive-code rehype-autolink-headings hastscript
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  pages/
    en/articles/[id].astro     # Dynamic article page (EN)
    fr/articles/[id].astro     # Dynamic article page (FR)
  components/
    article/
      ArticleCard.astro        # (EXISTS) Reused for related articles
      FeaturedArticle.astro    # (EXISTS)
      CategoryFilter.astro     # (EXISTS)
      ArticleHeader.astro      # NEW - title, meta, pillar tags, share buttons
      TableOfContents.astro    # NEW - sticky sidebar TOC
      RelatedArticles.astro    # NEW - related articles section
      ShareButtons.astro       # NEW - social sharing links
      PillarTag.astro          # NEW - distinctive pillar tag badge
    ui/
      ReadingProgress.astro    # NEW - top reading progress bar
      Tag.astro                # (EXISTS)
  layouts/
    ArticleLayout.astro        # NEW - article-specific layout wrapping BaseLayout
  lib/
    articles.ts                # (EXISTS) - needs getRelatedArticles(), getArticleByLangAndId()
  i18n/
    ui.ts                      # (EXISTS) - needs new article page translation keys
```

### Pattern 1: Dynamic Article Route with getStaticPaths
**What:** Generate one page per article using content collection
**When to use:** For all article pages (this is the core pattern)
**Example:**
```typescript
// Source: Astro docs - Content Collections + getStaticPaths
// src/pages/en/articles/[id].astro
---
import { getCollection, render } from 'astro:content';
import ArticleLayout from '@/layouts/ArticleLayout.astro';

export async function getStaticPaths() {
  const articles = await getCollection('articles', (entry) => {
    return entry.data.lang === 'en' && !entry.data.draft;
  });
  return articles.map((article) => ({
    params: { id: article.id },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content, headings } = await render(article);
---
<ArticleLayout article={article} headings={headings}>
  <Content />
</ArticleLayout>
```

### Pattern 2: Scroll-Spy TOC with IntersectionObserver
**What:** Observe heading elements and highlight the active TOC link
**When to use:** Desktop sidebar TOC (ARTI-02)
**Example:**
```typescript
// Source: CSS-Tricks + dev.to Astro TOC patterns
// Inside <script> in TableOfContents.astro
function initScrollSpy() {
  const headings = document.querySelectorAll('article :is(h2, h3)');
  const tocLinks = document.querySelectorAll('[data-toc-link]');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          tocLinks.forEach((link) => link.classList.remove('active'));
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`[data-toc-link][href="#${id}"]`);
          activeLink?.classList.add('active');
        }
      }
    },
    { threshold: 1, rootMargin: '0px 0px -66% 0px' }
  );

  headings.forEach((heading) => observer.observe(heading));
}
initScrollSpy();
document.addEventListener('astro:after-swap', initScrollSpy);
```

### Pattern 3: Reading Progress Bar
**What:** Thin bar at top of page filling proportionally to scroll position
**When to use:** Article pages only (ARTI-03)
**Example:**
```typescript
// Source: W3Schools / DigitalOcean scroll indicator patterns
function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  const article = document.querySelector('article');
  if (!bar || !article) return;

  function updateProgress() {
    const rect = article.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const articleHeight = rect.height;
    const scrolled = window.scrollY - articleTop;
    const progress = Math.min(Math.max(scrolled / (articleHeight - window.innerHeight), 0), 1);
    bar.style.transform = `scaleX(${progress})`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}
initReadingProgress();
document.addEventListener('astro:after-swap', initReadingProgress);
```

### Pattern 4: Social Share URLs (No Third-Party Libraries)
**What:** Open share intent URLs in new windows
**When to use:** Share buttons (ARTI-05)
**Example:**
```typescript
// Share URL patterns (verified from official docs)
const shareUrls = {
  twitter: (url: string, title: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  linkedin: (url: string, title: string) =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  devto: (url: string, title: string) =>
    `https://dev.to/new?prefill=${encodeURIComponent(`---\ntitle: ${title}\npublished: false\n---\n\nOriginally posted at ${url}`)}`,
};

// Copy link with feedback
async function copyLink(url: string) {
  await navigator.clipboard.writeText(url);
  // Show "Copied!" feedback
}
```

### Pattern 5: Expressive Code Configuration for Dark Theme
**What:** Configure Expressive Code to match the site's dark theme (#181818 canvas)
**When to use:** astro.config.mjs setup
**Example:**
```javascript
// Source: Expressive Code configuration docs
import astroExpressiveCode from 'astro-expressive-code';

// In astro.config.mjs integrations array (BEFORE mdx())
astroExpressiveCode({
  themes: ['github-dark-default'],
  styleOverrides: {
    codeBackground: 'var(--color-void)',
    borderColor: 'var(--color-border)',
    borderRadius: '4px',
    codeFontFamily: 'var(--font-code)',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.6',
    codePaddingBlock: '1.25rem',
    codePaddingInline: '1.25rem',
    frames: {
      shadowColor: 'transparent',
    },
  },
}),
```

### Anti-Patterns to Avoid
- **Placing astro-expressive-code AFTER mdx() in integrations array:** EC must process code blocks before MDX. Always put `astroExpressiveCode()` before `mdx()`.
- **Keeping shikiConfig alongside Expressive Code:** EC replaces Astro's built-in Shiki processing. Remove `markdown.shikiConfig` from `astro.config.mjs` when adding EC to avoid conflicts.
- **Using `[...slug].astro` for flat IDs:** The article IDs contain no path separators (e.g., `en-building-design-system`), so use `[id].astro` not `[...slug].astro`.
- **Scroll event without passive flag:** Always use `{ passive: true }` for scroll listeners to avoid jank.
- **Using `astro:page-load` instead of `astro:after-swap`:** The project pattern is `astro:after-swap` which works with and without ClientRouter. Stay consistent.
- **Building custom code copy buttons:** Expressive Code includes this. Do not hand-roll.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code block copy button | Custom copy button with Clipboard API | `astro-expressive-code` built-in | EC handles accessibility, positioning, feedback animation, and terminal comment stripping |
| Code language labels | Custom language badge system | `astro-expressive-code` frames plugin | Automatic detection, proper positioning, consistent styling |
| Line highlighting in code | Custom rehype plugin for line marks | `astro-expressive-code` text markers | Supports `{1,4-8}`, `ins={}`, `del={}`, inline text marks, regex marks |
| Editor/terminal frames | Custom CSS wrappers around code blocks | `astro-expressive-code` frames plugin | Handles tab styling, terminal vs editor detection, title extraction |
| Heading ID generation | Custom slug generation | Astro built-in (github-slugger) | Already works, consistent across the ecosystem |
| Social share SDKs | Twitter/LinkedIn JavaScript SDKs | Simple URL-based sharing with `window.open` | No third-party JS, no privacy concerns, no bundle size impact |

**Key insight:** Expressive Code handles ALL of ARTI-01 (copy button, language labels, line highlighting, editor frames) out of the box. The entire requirement is satisfied by adding one integration.

## Common Pitfalls

### Pitfall 1: Expressive Code Integration Order
**What goes wrong:** Code blocks render as plain Shiki output without frames, copy buttons, or markers
**Why it happens:** `astro-expressive-code` is placed AFTER `mdx()` in the integrations array
**How to avoid:** Always list `astroExpressiveCode()` BEFORE `mdx()` in `integrations: [...]`
**Warning signs:** Code blocks look like they did before EC was added

### Pitfall 2: Conflicting Shiki Configuration
**What goes wrong:** Double processing of code blocks, unexpected theme application, or EC styles being overridden
**Why it happens:** The existing `markdown.shikiConfig` in `astro.config.mjs` conflicts with EC's internal Shiki usage
**How to avoid:** Remove the `markdown.shikiConfig` block entirely when adding EC. EC uses its own Shiki internally (v3.2.2). The existing `pre.astro-code` CSS styles in `global.css` should also be reviewed/removed since EC generates its own styling.
**Warning signs:** Code blocks have inconsistent styling or double borders

### Pitfall 3: Entry ID Mismatch in Dynamic Routes
**What goes wrong:** 404 errors for article URLs
**Why it happens:** The glob loader generates IDs from filenames (e.g., `en-building-design-system`), and `getArticleUrl()` builds `/${lang}/articles/${article.id}`. The dynamic route file must use `[id]` and `getStaticPaths` must return `params: { id: article.id }`.
**How to avoid:** Verify the entry ID matches the URL parameter name: `[id].astro` with `params: { id: article.id }`
**Warning signs:** Build succeeds but articles return 404

### Pitfall 4: TOC Scroll-Spy with Sticky Header
**What goes wrong:** Active TOC item is wrong because the IntersectionObserver triggers based on viewport top, not below the sticky header
**Why it happens:** The site has a sticky header (`sticky top-0 z-50`, height 64px / h-16). The rootMargin must account for this.
**How to avoid:** Set `rootMargin: '-80px 0px -66% 0px'` (header height + padding) to offset the observation zone below the header
**Warning signs:** TOC highlights the heading above the one actually in view

### Pitfall 5: Reading Progress Calculation
**What goes wrong:** Progress bar shows 100% before reaching article end, or doesn't reach 100% at the end
**Why it happens:** Calculating based on full document height instead of article element boundaries
**How to avoid:** Measure progress relative to the `<article>` element's bounding rect, not `document.scrollHeight`
**Warning signs:** Progress percentage is inaccurate

### Pitfall 6: Missing rehypeHeadingIds Before Autolink
**What goes wrong:** `rehype-autolink-headings` produces links with no `href` values
**Why it happens:** Astro injects heading IDs AFTER rehype plugins run. `rehype-autolink-headings` needs IDs to exist.
**How to avoid:** Import `rehypeHeadingIds` from `@astrojs/markdown-remark` and place it BEFORE `rehype-autolink-headings` in the `rehypePlugins` array
**Warning signs:** Anchor links exist but have empty or undefined href

### Pitfall 7: Duplicate Pages for EN and FR
**What goes wrong:** Wrong articles shown for wrong locale, or build errors
**Why it happens:** Using a single `[id].astro` at root level instead of locale-prefixed routes
**How to avoid:** Create separate `src/pages/en/articles/[id].astro` and `src/pages/fr/articles/[id].astro` files that filter by `lang === 'en'` and `lang === 'fr'` respectively in `getStaticPaths`. This matches the existing URL structure (`getArticleUrl` produces `/${lang}/articles/${id}`).
**Warning signs:** French articles appear on English routes or vice versa

### Pitfall 8: heading anchor copy vs navigation
**What goes wrong:** ARTI-06 requires clicking heading anchors to COPY the section URL, but `rehype-autolink-headings` default behavior NAVIGATES to the heading
**Why it happens:** Default anchor behavior is navigation, not clipboard copy
**How to avoid:** Add a client-side script that intercepts clicks on heading anchor links, copies the full URL (with hash) to clipboard, and shows visual feedback instead of (or in addition to) navigating
**Warning signs:** Clicking heading link scrolls instead of copying

## Code Examples

Verified patterns from official sources:

### Expressive Code Markdown Syntax for MDX Authors
```markdown
// Source: https://expressive-code.com/key-features/text-markers/

// Line highlighting
```js {1, 4-6}
const a = 1;     // line 1 highlighted
const b = 2;
const c = 3;
const d = 4;     // lines 4-6 highlighted
const e = 5;
const f = 6;
```

// Inserted/deleted lines
```js ins={3} del={1}
const old = true;     // deleted (red)
const keep = true;
const added = true;   // inserted (green)
```

// Editor frame with title
```js title="src/utils/helper.ts"
export function helper() { return true; }
```

// Terminal frame (auto-detected from language)
```bash title="Install dependencies"
npm install astro-expressive-code
```

// Inline text highlighting
```js "helper()"
const result = helper();
```
```

### Astro render() with Headings for TOC
```typescript
// Source: Astro docs - Content Collections
import { render } from 'astro:content';

const { Content, headings } = await render(article);
// headings = [{ depth: 2, slug: 'why-design-systems-matter', text: 'Why Design Systems Matter' }, ...]
```

### Related Articles Query
```typescript
// Source: Custom pattern based on existing lib/articles.ts
export async function getRelatedArticles(
  article: Article,
  limit = 3,
): Promise<Article[]> {
  const allArticles = await getArticlesByLocale(article.data.lang as 'en' | 'fr');
  const otherArticles = allArticles.filter((a) => a.id !== article.id);

  // Score by shared tags and category
  const scored = otherArticles.map((a) => {
    let score = 0;
    if (a.data.category === article.data.category) score += 2;
    for (const tag of a.data.tags) {
      if (article.data.tags.includes(tag)) score += 1;
    }
    return { article: a, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}
```

### rehype-autolink-headings Configuration
```javascript
// Source: Jan Mueller's heading anchors + Astro docs
// In astro.config.mjs markdown or mdx rehypePlugins
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { h } from 'hastscript';

// In mdx() config:
mdx({
  rehypePlugins: [
    rehypeHeadingIds,
    [rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: { class: 'heading-anchor', ariaHidden: true, tabIndex: -1 },
      content: h('span.heading-anchor-icon', '#'),
    }],
  ],
}),
```

### Pillar Tag Visual Treatment
```typescript
// PillarTag.astro - distinctive styling per pillar
const pillarStyles = {
  'IA': { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400' },
  'Ingenierie': { bg: 'bg-teal/15', border: 'border-teal/30', text: 'text-teal-bright' },
  'UX': { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400' },
} as const;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Bare `shikiConfig` in astro.config | `astro-expressive-code` integration | Stable since 0.37+ (Astro 5) | Get copy buttons, frames, markers for free |
| `entry.render()` | `import { render } from 'astro:content'` | Astro 5.0 | Must use new import syntax |
| `entry.slug` | `entry.id` | Astro 5.0 | Slug property removed, use id |
| `<ViewTransitions />` | `<ClientRouter />` | Astro 5.0 | Component renamed (not used in this project but relevant) |
| Scroll event for TOC highlighting | IntersectionObserver | 2020+ | Better performance, no scroll jank |
| Third-party social share widgets | Simple URL intent sharing | 2020+ | No JS SDKs, no tracking, no bundle size |

**Deprecated/outdated:**
- `markdown.shikiConfig` in `astro.config.mjs`: Still works but redundant when using Expressive Code (which uses its own Shiki v3.2.2 internally)
- `pre.astro-code` CSS in `global.css`: This selector targets Astro's default Shiki output. EC generates different HTML structure (`<figure>` with `<pre>` inside). The existing styles should be replaced.

## Open Questions

1. **EC theme matching**
   - What we know: EC supports `github-dark-default` theme and CSS variable references in `styleOverrides`
   - What's unclear: Whether `github-dark-default` closely matches the current Shiki theme (`github-dark-default` in shikiConfig) visually, and how EC's generated HTML structure interacts with existing `.prose` styles
   - Recommendation: Test EC with `github-dark-default` theme first since it matches the current shikiConfig theme. Use `styleOverrides` with CSS variables to match site colors. May need to update `.prose pre` styles.

2. **Heading anchor behavior: navigate vs copy**
   - What we know: ARTI-06 says "click heading anchor links to copy section URLs". `rehype-autolink-headings` adds navigation links.
   - What's unclear: Whether the requirement means ONLY copy (no navigation) or copy AS WELL AS navigate
   - Recommendation: Implement as copy-to-clipboard on click with visual feedback ("Copied!"), while also updating the URL hash (so the behavior is both useful and expected)

3. **TOC on mobile**
   - What we know: ARTI-02 specifies "sticky TOC sidebar on desktop". No mobile TOC behavior specified.
   - What's unclear: Whether to hide TOC entirely on mobile or provide an alternative (dropdown, floating button, etc.)
   - Recommendation: Hide TOC sidebar on mobile (`hidden lg:block`). Optionally add a mobile TOC as a collapsible section above the article content.

4. **Reading progress bar position relative to sticky header**
   - What we know: Header is `sticky top-0 z-50`. Progress bar should be "at the top of the page"
   - What's unclear: Whether progress bar sits above the header, below it, or overlays the bottom edge
   - Recommendation: Place progress bar at the very top of the viewport (`fixed top-0 z-[60]`) as a thin (2-3px) teal gradient bar, above the header for maximum visibility

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) - getStaticPaths, render(), headings
- [Expressive Code Configuration](https://expressive-code.com/reference/configuration/) - themes, styleOverrides, integration setup
- [Expressive Code Text Markers](https://expressive-code.com/key-features/text-markers/) - line/text marking syntax
- [Expressive Code Frames](https://expressive-code.com/key-features/frames/) - editor/terminal frames, copy button, titles
- [Expressive Code Themes](https://expressive-code.com/guides/themes/) - available built-in themes
- [Expressive Code Style Overrides](https://expressive-code.com/reference/style-overrides/) - CSS variable support
- [Expressive Code Release Notes](https://expressive-code.com/releases/) - v0.41.6 latest, Astro 5+ support confirmed
- [Astro Markdown Content](https://docs.astro.build/en/guides/markdown-content/) - automatic heading IDs, rehype plugins
- [Astro Syntax Highlighting](https://docs.astro.build/en/guides/syntax-highlighting/) - EC as community integration

### Secondary (MEDIUM confidence)
- [dev.to - TOC with Scroll Spy in Astro](https://dev.to/fazzaamiarso/add-toc-with-scroll-spy-in-astro-3d25) - IntersectionObserver pattern verified with MDN
- [Jan Mueller - Heading Anchors with Astro and rehype](https://janmueller.dev/blog/next-level-heading-anchors/) - rehype-autolink-headings configuration
- [Laura Chan - Heading links in Astro](https://lwkchan.com/blog/2025-05-24-heading-links-in-astro/) - component-based heading approach
- [CSS-Tricks - TOC with IntersectionObserver](https://css-tricks.com/table-of-contents-with-intersectionobserver/) - scroll-spy pattern
- [Twitter/X Web Intent Docs](https://developer.x.com/en/docs/x-for-websites/tweet-button/guides/web-intent) - share URL format
- [LinkedIn Share Docs](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin) - shareArticle URL format
- [anca.wtf - Replacing Shiki with EC](https://www.anca.wtf/posts/how-to-replace-a-plain-shiki-integration-with-expressive-code-in-your-astro-markdoc-setup/) - migration pattern

### Tertiary (LOW confidence)
- dev.to share URL format (via `https://dev.to/new?prefill=...`) - inferred from community usage, not officially documented by dev.to

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Expressive Code v0.41.6 confirmed compatible with Astro 5, well-documented, actively maintained
- Architecture: HIGH - Dynamic routes with getStaticPaths + content collections is the documented Astro pattern, render() with headings is built-in
- Pitfalls: HIGH - Integration order, shikiConfig conflict, and heading ID ordering are well-documented issues with clear solutions
- Social sharing URLs: MEDIUM - Twitter/LinkedIn formats verified from official docs; dev.to format is community-sourced
- TOC scroll-spy: HIGH - IntersectionObserver is the standard approach, well-documented across multiple authoritative sources

**Research date:** 2026-02-09
**Valid until:** 2026-03-11 (stable domain, 30 days)
