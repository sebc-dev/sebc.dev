# Pitfalls Research

**Domain:** Bilingual developer blog (Astro 5 + Cloudflare Pages + Tailwind CSS v4 + Pagefind + MDX)
**Researched:** 2026-02-09
**Confidence:** HIGH (verified against official docs and multiple sources)

## Critical Pitfalls

### Pitfall 1: Tailwind CSS v4 Utility Scale Renames Break Visual Design

**What goes wrong:**
Every `rounded`, `shadow`, `blur`, and `drop-shadow` class without an explicit size suffix renders differently in Tailwind v4 than v3. The bare `rounded` became `rounded-sm` (2px smaller corners), `shadow` became `shadow-sm` (smaller shadow), and so on. The old `-sm` variants now map to `-xs`. Any design-report-based component using these classes will look subtly wrong -- smaller corners, weaker shadows -- without errors.

**Why it happens:**
Tailwind v4 renamed the default scale to ensure every value has an explicit name. The bare utility class (e.g. `rounded`) still exists but maps to what was previously the `-sm` size. Developers copying v3-era class names or referencing older documentation apply the wrong visual treatment without realizing it.

**How to avoid:**
- Use the explicit Tailwind v4 scale from day one: `rounded-sm` (was `rounded`), `rounded-xs` (was `rounded-sm`), `shadow-sm` (was `shadow`), `shadow-xs` (was `shadow-sm`).
- Cross-reference the design report's border-radius and shadow tokens against the Tailwind v4 scale: `rounded-xs`=2px, `rounded-sm`=4px (Tailwind v4 default), `rounded-md`=6px, `rounded-lg`=8px.
- Full rename table:

| v3 class | v4 equivalent | Visual change if not updated |
|----------|---------------|------------------------------|
| `shadow-sm` | `shadow-xs` | Shadow shrinks from sm to xs |
| `shadow` | `shadow-sm` | Shadow shrinks |
| `rounded-sm` | `rounded-xs` | Corners 2px instead of 4px |
| `rounded` | `rounded-sm` | Corners 4px instead of 6px |
| `blur-sm` | `blur-xs` | Less blur |
| `blur` | `blur-sm` | Less blur |
| `outline-none` | `outline-hidden` | Different outline behavior |
| `ring` (3px) | `ring-3` (explicit) | Ring width defaults to 1px |

- Additionally, the `!important` modifier moved from prefix to suffix: `!flex` is now `flex!`.
- Gradient utility renamed: `bg-gradient-to-r` is now `bg-linear-to-r`.

**Warning signs:**
- Components look "flatter" or "tighter" than design specs.
- Border radius appears smaller than mockups.
- Shadows barely visible compared to design report.

**Phase to address:**
Foundation/Layout phase -- establish a design-token-to-Tailwind mapping document before building any components.

---

### Pitfall 2: Tailwind v4 @apply Fails in Astro Component Style Blocks Without @reference

**What goes wrong:**
Using `@apply` inside `<style>` blocks in `.astro` components throws the error "Cannot apply unknown utility class X" because Tailwind v4 processes each component's `<style>` block as an isolated CSS module. The style block has no access to theme variables, custom utilities, or the Tailwind configuration defined in your global CSS file.

**Why it happens:**
Tailwind v4 treats component-scoped styles (Vue `<style scoped>`, Svelte `<style>`, Astro `<style>`) as separate CSS modules processed independently from your main stylesheet. Unlike v3 where `@apply` worked everywhere because of a global config, v4 requires explicit imports.

**How to avoid:**
Three strategies, in order of preference:
1. **Prefer utility classes in markup** (Tailwind's recommended approach). Avoid `<style>` blocks entirely for Tailwind utilities. Use class attributes directly.
2. **Use CSS custom properties** from the `@theme` block: `background: var(--color-teal)` works everywhere without `@reference`.
3. **When @apply is unavoidable**, add `@reference` at the top of the style block pointing to your global CSS:
   ```astro
   <style>
   @reference "../../styles/global.css";
   .my-class {
     @apply bg-teal text-text-primary;
   }
   </style>
   ```
   The project memory already notes this pattern (`@reference "../styles/global.css"`), but the path must be correct relative to each component file.

**Warning signs:**
- Build errors mentioning "Cannot apply unknown utility class".
- Styles working in global CSS but not in component `<style>` blocks.
- Inconsistent behavior between components at different directory depths (wrong relative path).

**Phase to address:**
Foundation phase -- decide on the styling convention (utility-in-markup vs @reference) as a project standard before building components. Document the convention in a contributing guide or component template.

---

### Pitfall 3: Pagefind data-pagefind-body Opt-In Creates Silent Indexing Gaps

**What goes wrong:**
Adding `data-pagefind-body` to your article layout to scope search indexing to article content silently excludes every other page (homepage, about, category listings) from search results. No error, no warning -- those pages simply disappear from search.

**Why it happens:**
Pagefind's indexing behavior has a binary toggle: once any page on the site has `data-pagefind-body`, ALL pages without it are excluded from the index. This is by design (to prevent nav/footer content from polluting results) but the behavior is global and silent.

**How to avoid:**
- **Strategy A (recommended for a blog):** Add `data-pagefind-body` to the article layout's `<main>` content area. Do NOT add it to non-article pages unless they should be searchable. Accept that only articles appear in search -- this is usually the correct behavior for a tech blog.
- **Strategy B:** Add `data-pagefind-body` to every layout that should be searchable, including the about page and any standalone pages.
- **Strategy C:** Do not use `data-pagefind-body` at all. Instead, use `data-pagefind-ignore` on elements to exclude (nav, footer, sidebar). This indexes everything by default.
- **Always:** add `data-pagefind-ignore` to navigation, header, footer, and sidebar elements to prevent them from appearing in search snippets.

**Warning signs:**
- Search returns no results for content that exists on non-article pages.
- After adding `data-pagefind-body` to articles, the about page or other pages stop appearing in search.

**Phase to address:**
Search implementation phase -- decide the scoping strategy before building the search page. Test with `pagefind --site dist` locally and verify the index contains the expected number of pages.

---

### Pitfall 4: Cloudflare Pages Trailing Slash Conflict With trailingSlash: "never"

**What goes wrong:**
The project configures `trailingSlash: "never"` in `astro.config.mjs`, but Cloudflare Pages has its own opinionated trailing-slash behavior. For pages generated as `index.html` inside a directory (e.g., `/en/about/index.html`), Cloudflare Pages will serve them at `/en/about/` WITH a trailing slash, redirecting `/en/about` to `/en/about/`. This creates 301 redirect chains, hurts SEO with potential duplicate canonical URLs, and contradicts Astro's configured behavior.

**Why it happens:**
Cloudflare Pages automatically adds trailing slashes to directories and removes `.html` extensions. This is hardcoded behavior that cannot be configured on Pages (unlike Workers with Static Assets, which has a `serve_directly` option).

**How to avoid:**
- **Option A (pragmatic):** Change to `trailingSlash: "always"` to match Cloudflare Pages' default behavior. This eliminates redirect chains and matches how Cloudflare actually serves the files.
- **Option B:** Keep `trailingSlash: "never"` but generate flat files (`/en/about.html` instead of `/en/about/index.html`). Astro does this by default for non-index pages, but verify the output structure in `dist/`.
- **Option C:** Migrate from Cloudflare Pages to Cloudflare Workers with Static Assets (supported in Astro 6+), which allows configuring trailing-slash behavior.
- **For canonical URLs:** Always derive canonical URLs from `Astro.url` which respects the `trailingSlash` config, and ensure the sitemap integration matches.

**Warning signs:**
- Lighthouse reports redirect chains on internal links.
- Google Search Console shows duplicate URLs with/without trailing slashes.
- Internal links behave differently in dev (Astro handles routing) vs production (Cloudflare handles routing).

**Phase to address:**
Infrastructure/Foundation phase -- validate the trailing-slash behavior on a staging deployment BEFORE building out pages. Test with `wrangler pages dev dist` locally.

---

### Pitfall 5: i18n 404 Page Broken With prefixDefaultLocale: true

**What goes wrong:**
With `prefixDefaultLocale: true`, custom 404 pages do not display correctly for URLs that lack a valid locale prefix. Visiting `/nonexistent` shows a blank page or Cloudflare's default error, not your custom 404. URLs with locale prefixes like `/en/nonexistent` or `/fr/nonexistent` work correctly.

**Why it happens:**
Astro generates `404.html` at the root of the build output, but with `prefixDefaultLocale: true`, the routing logic expects all paths to begin with a locale prefix. Unprefixed paths fall through without matching the 404 handler. This is a known Astro issue (GitHub #12750).

**How to avoid:**
- Create `src/pages/404.astro` that renders a generic 404 page (this becomes `/404.html` in the build output, which Cloudflare Pages serves for any unmatched route).
- Additionally create locale-specific 404 pages: `src/pages/en/404.astro` and `src/pages/fr/404.astro` for properly localized error pages.
- For Cloudflare Pages specifically: the platform looks for `/404.html` in the root and uses it as a fallback. Ensure this file exists and renders properly without locale context.
- Consider adding a `_redirects` file in `public/` to catch common patterns: `/ /en 302`.

**Warning signs:**
- Visiting a random URL without locale prefix shows a blank page.
- 404 pages render but show the wrong language.
- The root `/404.html` file is missing from the `dist/` output.

**Phase to address:**
Layout/Foundation phase -- create the 404 pages early, test on Cloudflare Pages staging deployment.

---

### Pitfall 6: Content Collection entry.id Includes Folder Path in Glob Loader

**What goes wrong:**
When using the `glob()` loader with a base of `./src/content/articles` and content organized in subdirectories (e.g., by language or category like `fr/mon-article.mdx` or `2024/my-article.mdx`), the generated `entry.id` includes the full relative path: `fr/mon-article` instead of just `mon-article`. This breaks URL generation if you expect `entry.id` to be a clean slug, and can cause duplicate content if the same article exists as both `en/my-article.mdx` and `fr/mon-article.mdx`.

**Why it happens:**
The glob() loader generates IDs from the full file path relative to the `base` directory, then slugifies it with github-slugger. Subdirectory names become part of the ID. The project's schema uses a `lang` field in frontmatter rather than directory-based language separation, but if the content structure changes, this becomes a problem.

**How to avoid:**
- **Keep content flat** within the articles directory (no subdirectories for language). Use the `lang` frontmatter field to differentiate, which the schema already supports.
- If subdirectories are needed, use the `generateId` option in the `glob()` loader to customize ID generation:
  ```typescript
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/articles",
    generateId: ({ entry, data }) => {
      // Strip directory prefix, use just the filename
      return entry.split('/').pop()?.replace(/\.(md|mdx)$/, '') ?? entry;
    },
  }),
  ```
- **For URL generation:** Always derive the URL from a combination of `entry.data.lang` and a clean slug (either `entry.id` or a custom `translationSlug` field), not from `entry.id` alone.

**Warning signs:**
- Article URLs contain unexpected path segments (`/en/articles/fr/mon-article` instead of `/en/articles/mon-article`).
- `getCollection()` returns IDs with slashes in them.
- Dynamic routes with `[...id]` generate unexpected nested paths.

**Phase to address:**
Content architecture phase -- decide the content directory structure and ID generation strategy before creating article files.

---

### Pitfall 7: Cloudflare Auto Minify Breaks Island Hydration

**What goes wrong:**
Cloudflare's "Auto Minify" feature (in Speed > Optimization > Content Optimization) can mangle JavaScript in a way that breaks Astro's island hydration. The browser console shows "Hydration completed but contains mismatches" and interactive components fail to initialize.

**Why it happens:**
Cloudflare's server-side minification modifies JavaScript and HTML after the build, potentially altering the structure that Astro's hydration system relies on to match server-rendered HTML with client-side components.

**How to avoid:**
- **Disable Auto Minify** in Cloudflare dashboard: Speed > Optimization > Content Optimization > uncheck JavaScript, CSS, and HTML minification.
- Rely on Astro's built-in `compressHTML: true` and Vite's build-time minification instead -- these are build-time optimizations that Astro's hydration system understands.
- For the current project (`output: "static"` with minimal islands), this is lower risk but still applies to any `client:*` directive components.

**Warning signs:**
- Interactive components work in dev but break in production.
- Console errors about hydration mismatches on Cloudflare-deployed site.
- JavaScript-heavy islands (search UI, language switcher) fail silently.

**Phase to address:**
Deployment/Infrastructure phase -- configure Cloudflare settings as part of the initial deployment setup.

---

### Pitfall 8: Pagefind Multilingual Index Depends on html lang Attribute

**What goes wrong:**
Pagefind uses the `<html lang="...">` attribute to determine which language index to build for each page. If the `lang` attribute is wrong, missing, or inconsistent, pages end up in the wrong language index. Users searching in French get English results, or vice versa.

**Why it happens:**
Pagefind automatically creates separate indexes per language by reading the `lang` attribute on the `<html>` element at build time, and loads the matching index at runtime by checking the same attribute. The project's `BaseLayout.astro` correctly uses `Astro.currentLocale ?? "en"` for the lang attribute, but the fallback behavior and edge cases need attention.

**How to avoid:**
- Verify that `Astro.currentLocale` returns the correct locale for every page. With `prefixDefaultLocale: true`, this should work for `/en/*` and `/fr/*` routes.
- After building, inspect the Pagefind output in `dist/_pagefind/` -- there should be separate index files for `en` and `fr`.
- Ensure the root `index.astro` redirect page (which has `lang="en"` by default) is not indexed by Pagefind (add `data-pagefind-ignore` to its body or rely on the redirect not generating meaningful content).
- For the search page UI: initialize Pagefind on the search page without specifying a language override -- it will auto-detect from the page's `lang` attribute. The `/en/search` page will search English content; `/fr/search` will search French content.

**Warning signs:**
- Search returns results in the wrong language.
- Running `pagefind --site dist` shows unexpected language detection ("Found 0 pages for language: fr").
- The Pagefind output directory contains only one language index instead of two.

**Phase to address:**
Search implementation phase -- verify multilingual indexing immediately after the first successful build with content in both languages.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding translation strings in components | Faster initial development | Every new string requires finding/editing components; no translation file for non-dev translators | Never -- set up a translation utility from day one, even if it starts as a simple key-value object |
| Using Google Fonts CDN instead of self-hosting | Zero setup, fast to implement | Render-blocking external request, GDPR privacy concerns (Google tracking), CLS from font swap, dependency on third-party availability | MVP only -- migrate to self-hosted fonts before production launch |
| Skipping `data-pagefind-body` scoping | All pages indexed, search "works" | Nav/footer text pollutes search results, search snippets show boilerplate instead of content | Never for a content site -- always scope to main content |
| Using `compressHTML: true` without testing code blocks | Smaller HTML output | Can strip whitespace inside `<pre>` code blocks in MDX articles, breaking code formatting | Acceptable if code blocks render correctly in production; test with representative content |
| Keeping the Cloudflare adapter for a pure static site | Familiar setup, `wrangler types` works | Unnecessary build complexity, adapter warning noise, potential conflicts if Astro version changes | Only if you plan to add server endpoints or server islands later |

## Integration Gotchas

Common mistakes when connecting components of this stack.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Astro sitemap + i18n | Not configuring the `i18n` option on the sitemap integration, so hreflang tags are missing from the sitemap | Pass `i18n: { defaultLocale: 'en', locales: { en: 'en-US', fr: 'fr-FR' } }` to the sitemap() integration in `astro.config.mjs` |
| MDX + Shiki code highlighting | Expecting the `<Code />` component to inherit `shikiConfig` from `astro.config.mjs` -- it does not | Pass theme and language as props directly to `<Code />`, or use fenced code blocks in MDX which DO inherit shikiConfig |
| MDX + custom components via Content collections | Defining custom components in the MDX file itself instead of passing them via the `<Content components={...} />` prop | Import custom components in the rendering page/layout and pass them to `<Content />`. Components defined in MDX files may lose their styles and scripts when rendered through content collections |
| Pagefind + Astro build pipeline | Running `pagefind` before `astro build` completes, or referencing Pagefind assets that do not exist yet at build time | The build script correctly chains: `astro build && pagefind --site dist`. Reference Pagefind CSS/JS in templates knowing they will exist after indexing. In dev mode, Pagefind search will not work (no index exists) |
| Tailwind v4 @theme + Shiki code blocks | Custom theme colors in @theme (e.g., `--color-void`) do not automatically apply to Shiki-generated code blocks, which use their own inline styles | Style Shiki code blocks via `pre.astro-code` in global CSS using `var(--color-void)` with `!important` to override inline styles, as already done in the project's `global.css` |
| i18n language switcher | Using `getRelativeLocaleUrl(locale)` in a language switcher -- this redirects to the ROOT page of the target locale, not the equivalent page | Build the switcher URL by replacing the locale segment in `Astro.url.pathname`: e.g., swap `/en/articles/my-post` to `/fr/articles/my-post`. Verify the target page exists (may not have a translation) |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading ALL Shiki languages in config | Dev server startup takes 5-10+ seconds, build time increases | Only add languages you actually use in articles to `shikiConfig.langs`. Never add Shiki's bundled language list manually | Noticeable with >5 custom languages |
| Google Fonts render-blocking stylesheet | LCP delayed by 200-500ms, CLS from font swap visible on slow connections | Self-host fonts with `font-display: swap` and `@font-face` declarations, or use `astro-google-fonts-optimizer` integration | Noticeable on 3G/slow connections; affects Lighthouse scores immediately |
| Pagefind loading full index for large sites | Initial search takes 1-2s as the full index downloads | Pagefind already chunks indexes automatically. Ensure `data-pagefind-body` scoping reduces index size. For a blog with <500 articles, this is unlikely to be an issue | >1000 pages without scoping |
| IntersectionObserver on every element | Layout jank on mobile when hundreds of elements observed, animation stutters | Limit `.fade-up` and `.section-title` observers to above-the-fold and key sections. Disconnect observers after animation completes | >50 observed elements on a single page |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Google Fonts CDN violates GDPR in EU | Font requests to Google expose visitor IP addresses, violating privacy regulations in certain jurisdictions | Self-host fonts or use a GDPR-compliant CDN. Critical for a French-language blog with European audience |
| Draft articles accessible in production | Content with `draft: true` renders at a guessable URL if not filtered in `getStaticPaths` | Filter drafts in `getCollection()`: `filter: ({ data }) => import.meta.env.PROD ? !data.draft : true` |
| Exposing Cloudflare API tokens in CI/CD | Wrangler deploy commands need `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` | Use CI/CD secrets (GitHub Actions secrets, not env files). Never commit `.env` with tokens. The `wrangler.toml` should not contain sensitive values |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Search page with no results message in wrong language | French user sees English "No results found" | Localize all Pagefind UI strings. Pagefind supports UI translations but they must be configured per-language page |
| Language switcher links to non-existent translations | User clicks FR on an English-only article, gets a 404 | Check if the translation exists (via `translationSlug` field) before showing the language switcher link. Show "Not available in French" or hide the switcher |
| Code blocks not horizontally scrollable on mobile | Long code lines get cut off or cause page-wide horizontal scroll | Already handled in `global.css` with `overflow-x: auto` on `pre.astro-code`. Verify with real code samples on mobile viewport |
| Flash of unstyled text (FOUT) from Google Fonts | Text shifts/resizes visibly as custom font loads, especially on slow connections | Use `font-display: swap` (already implicit in Google Fonts URL parameter `&display=swap`). Add fallback metrics with `size-adjust` for minimal CLS |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **i18n routing:** Often missing hreflang tags in `<head>` -- verify every page has `<link rel="alternate" hreflang="en" href="..." />` and `<link rel="alternate" hreflang="fr" href="..." />` and `<link rel="alternate" hreflang="x-default" href="..." />`
- [ ] **Sitemap:** Often missing i18n configuration on the sitemap integration -- verify `sitemap-index.xml` contains localized entries with hreflang attributes
- [ ] **Canonical URLs:** Often wrong with i18n prefix -- verify `<link rel="canonical">` matches the actual URL including locale prefix (`/en/articles/...` not `/articles/...`)
- [ ] **404 pages:** Often only the root 404 exists -- verify `/en/404.html` and `/fr/404.html` exist in build output AND that the root `/404.html` works for non-prefixed URLs
- [ ] **Pagefind search:** Often tested only in one language -- verify search works independently in both `/en/search` and `/fr/search` with correct results per language
- [ ] **OG images:** Often using a generic site image -- verify each article has a unique `og:image` meta tag with absolute URL (including `https://sebc.dev`)
- [ ] **RSS feed:** Often missing or only in one language -- verify feeds exist for both languages if implemented
- [ ] **Draft filtering:** Often works in dev but drafts leak in production -- verify `astro build` output does NOT contain draft articles
- [ ] **Trailing slash consistency:** Often different between dev and prod -- verify internal links work without redirect chains on Cloudflare Pages

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Tailwind v4 scale renames (wrong shadow/rounded) | LOW | Search and replace utility classes across all templates. Use `npx @tailwindcss/upgrade` if starting from v3 classes |
| @apply without @reference | LOW | Add `@reference` to affected style blocks, or refactor to utility classes in markup |
| Pagefind indexing gaps | LOW | Add/remove `data-pagefind-body` attributes, rebuild and re-index. No data loss |
| Trailing slash mismatch | MEDIUM | Change `trailingSlash` config, update all internal links, set up redirects for any indexed URLs. May need Cloudflare redirect rules |
| Broken 404 with i18n | LOW | Create missing 404 pages, redeploy. Consider a `_redirects` file for edge cases |
| Wrong entry.id from glob loader | MEDIUM | Add `generateId` to glob config, update all `getStaticPaths` and link generation code that depends on `entry.id` |
| Cloudflare Auto Minify breaking hydration | LOW | Disable in Cloudflare dashboard, redeploy. Instant fix |
| Wrong Pagefind language index | LOW | Fix `lang` attribute in layout, rebuild. Pagefind re-indexes automatically |
| Google Fonts GDPR issue | MEDIUM | Download fonts, add to `public/fonts/`, create `@font-face` declarations, remove Google Fonts `<link>` tags. May need cache purge |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Tailwind v4 scale renames | Foundation/Design System | Visual comparison of built components against design report specs |
| @apply without @reference | Foundation/Component Architecture | Build succeeds with `<style>` blocks using @apply; or document convention to avoid @apply |
| Pagefind indexing gaps | Search Implementation | Run `pagefind --site dist` and verify page count matches expected articles |
| Trailing slash conflict | Infrastructure/Deployment | Deploy to Cloudflare Pages staging, verify zero redirect chains with curl or Lighthouse |
| i18n 404 broken | Layout/Error Pages | Visit random URLs with and without locale prefix on staging deployment |
| entry.id includes folder path | Content Architecture | Log `entry.id` values from `getCollection()` and verify they match expected URL slugs |
| Cloudflare Auto Minify | Deployment Setup | Disable Auto Minify in Cloudflare dashboard; test interactive components on production |
| Pagefind wrong language index | Search Implementation | Build with content in both languages, verify `dist/_pagefind/` contains separate language indexes |
| Google Fonts GDPR | Foundation/Typography | Self-host fonts before EU-facing production launch |
| compressHTML whitespace | Content/Articles | Build a test article with code blocks, verify formatting in production HTML |
| Language switcher wrong URL | i18n/Navigation | Click language switcher on every page type (home, article, search, 404) and verify correct destination |
| MDX custom components losing styles | Content/Article Layout | Render a test article with custom components via content collections, verify styles and scripts work |
| Sitemap missing hreflang | SEO/Metadata | Inspect generated `sitemap-0.xml` for xhtml:link alternate entries |
| OG images wrong URL | SEO/Metadata | Share article URLs in social media preview tools (Twitter Card Validator, Facebook Debugger) |

## Sources

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) -- utility renames, @reference, gradient changes (HIGH confidence)
- [Tailwind CSS v4 Compatibility Docs](https://tailwindcss.com/docs/compatibility) -- @apply in style blocks, CSS module behavior (HIGH confidence)
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) -- glob loader, entry.id, generateId (HIGH confidence)
- [Astro i18n Routing Docs](https://docs.astro.build/en/guides/internationalization/) -- prefixDefaultLocale, redirectToDefaultLocale (HIGH confidence)
- [Astro Syntax Highlighting Docs](https://docs.astro.build/en/guides/syntax-highlighting/) -- Shiki config, Code component (HIGH confidence)
- [Astro Client-Side Scripts Docs](https://docs.astro.build/en/guides/client-side-scripts/) -- deduplication, is:inline (HIGH confidence)
- [Astro Sitemap Integration Docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) -- i18n hreflang config (HIGH confidence)
- [Pagefind Multilingual Docs](https://pagefind.app/docs/multilingual/) -- lang attribute detection, separate indexes (HIGH confidence)
- [Pagefind Indexing Docs](https://pagefind.app/docs/indexing/) -- data-pagefind-body behavior (HIGH confidence)
- [Cloudflare Pages Serving Docs](https://developers.cloudflare.com/pages/configuration/serving-pages/) -- trailing slash behavior, 404 handling (HIGH confidence)
- [Astro 404 with i18n Issue #12750](https://github.com/withastro/astro/issues/12750) -- 404 page display bug with prefixDefaultLocale (MEDIUM confidence)
- [Tailwind @apply Issue #15952](https://github.com/tailwindlabs/tailwindcss/issues/15952) -- @reference requirement confirmed (HIGH confidence)
- [Astro compressHTML Issue #7556](https://github.com/withastro/astro/issues/7556) -- whitespace removal in pre blocks (MEDIUM confidence)
- [Cloudflare Trailing Slash Discussion](https://community.cloudflare.com/t/urls-redirects-and-the-trailing-slash/688724) -- Pages opinionated trailing slash behavior (MEDIUM confidence)
- [Astro MDX Component Gotchas](https://blog.kizu.dev/astro-mdx-components/) -- custom component rendering edge cases (MEDIUM confidence)

---
*Pitfalls research for: Bilingual Astro 5 developer blog on Cloudflare Pages*
*Researched: 2026-02-09*
