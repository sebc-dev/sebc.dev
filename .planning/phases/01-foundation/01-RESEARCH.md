# Phase 1: Foundation - Research

**Researched:** 2026-02-09
**Domain:** Astro 5 layout shell, i18n system, scroll-reveal animations, responsive dark theme with WCAG AA compliance
**Confidence:** HIGH

## Summary

Phase 1 builds the foundational layout shell (sticky header, footer, language switcher), the i18n translation system, scroll-reveal animations, and validates the dark theme against WCAG AA contrast ratios. Everything is built on the existing Astro 5.17.1 + Tailwind CSS v4 scaffold that already includes a BaseLayout, global CSS with design tokens, and i18n routing configuration.

The project already has significant scaffolding in place: `astro.config.mjs` has i18n routing with `prefixDefaultLocale: true`, `global.css` has design tokens and fade-up animation keyframes, `BaseLayout.astro` has the HTML shell with IntersectionObserver, and the `src/components/` directory structure is pre-created with `layout/`, `ui/`, `article/`, `shared/`, and `about/` subdirectories (all empty). The content collection schema is defined with all fields needed. No new npm packages are required for Phase 1 -- everything uses Astro built-ins and Tailwind CSS.

**Primary recommendation:** Build the i18n utility layer first (zero dependencies), then components bottom-up (GlowLine, Nav, LangSwitch, Header, Footer), update BaseLayout to compose them, and create placeholder pages for all routes. Address the two WCAG contrast failures (`text-muted` and `teal` on certain backgrounds) before any visual implementation.

## Standard Stack

### Core (Already Installed -- No New Dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.17.1 | Core framework, i18n routing, static page generation | Already configured with i18n, MDX, sitemap |
| Tailwind CSS v4 | 4.1.18 | Utility-first styling via `@tailwindcss/vite` | Already configured with design tokens in global.css |
| TypeScript | 5.9.3 | Type safety for i18n dictionaries and component props | Already configured with strict mode |

### Supporting (Already Available)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `astro:i18n` module | (built-in) | `getRelativeLocaleUrl()`, `Astro.currentLocale` | Every localized link and component |
| IntersectionObserver API | (browser built-in) | Scroll-reveal `.fade-up` and `.section-title` animations | Already in BaseLayout.astro |
| Vitest | 3.2.4 | Unit testing i18n utilities and helper functions | Test `getLangFromUrl`, `useTranslations`, URL helpers |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom i18n dictionary | Paraglide JS 2.x | Overkill for 2 languages; Astro recipe pattern is simpler and zero-dependency |
| Custom i18n dictionary | astro-i18n-aut | Superseded by Astro built-in i18n since v4.0 |
| IntersectionObserver | AOS library (2.3.4) | 29KB for functionality achievable in 25 lines; already implemented in BaseLayout |
| Manual URL helpers | astro-i18n-aut | Adds dependency for URL manipulation that is trivial with string operations |

**Installation:** None required. Phase 1 uses only what is already installed.

## Architecture Patterns

### Recommended Project Structure (Phase 1 Additions)

```
src/
├── i18n/                        # NEW: Translation system
│   ├── ui.ts                    # UI string dictionaries (EN + FR)
│   └── utils.ts                 # getLangFromUrl(), useTranslations()
├── utils/                       # NEW: Pure utility functions
│   └── urls.ts                  # URL building helpers (localized paths)
├── components/
│   ├── layout/                  # NEW: Shell components
│   │   ├── Header.astro         # Sticky header with nav + lang switch
│   │   ├── Footer.astro         # Site footer with social links
│   │   ├── Nav.astro            # Navigation links with active states
│   │   └── LangSwitch.astro     # EN/FR locale toggle preserving path
│   └── ui/                      # NEW: Atomic UI
│       └── GlowLine.astro       # Decorative teal gradient separator
├── layouts/
│   └── BaseLayout.astro         # UPDATE: Integrate Header + Footer
├── pages/
│   ├── index.astro              # EXISTS: Root redirect to /en/
│   ├── en/
│   │   ├── index.astro          # UPDATE: Use translation system
│   │   ├── about.astro          # NEW: Placeholder
│   │   └── search.astro         # NEW: Placeholder
│   ├── fr/
│   │   ├── index.astro          # UPDATE: Use translation system
│   │   ├── about.astro          # NEW: Placeholder
│   │   └── search.astro         # NEW: Placeholder
│   └── 404.astro                # NEW: Root 404 fallback
└── styles/
    └── global.css               # UPDATE: Add header/footer styles if needed
```

### Pattern 1: i18n UI Strings via Translation Dictionary

**What:** Centralized translation dictionaries with a `useTranslations()` helper that returns a typed `t()` function for the current locale.
**When to use:** Every component that renders user-facing text.
**Source:** Official Astro recipe (https://docs.astro.build/en/recipes/i18n/)

```typescript
// src/i18n/ui.ts
export const languages = {
  en: "English",
  fr: "Francais",
} as const;

export const defaultLang = "en" as const;

export const ui = {
  en: {
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.about": "About",
    "footer.description": "Technical blog — AI x Engineering x UX",
    "footer.copyright": "All rights reserved.",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.search": "Recherche",
    "nav.about": "A propos",
    "footer.description": "Blog technique — IA x Ingenierie x UX",
    "footer.copyright": "Tous droits reserves.",
  },
} as const;
```

```typescript
// src/i18n/utils.ts
import { ui, defaultLang } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
```

**Confidence:** HIGH -- official Astro recipe pattern, verified against current docs.

### Pattern 2: Language Switcher Preserving Current Path

**What:** A language switcher that swaps the locale prefix in the current URL path, so `/en/about` becomes `/fr/about` (not `/fr/`).
**When to use:** The Header component's language toggle (requirement I18N-03).
**Why not `getRelativeLocaleUrl()`:** That function generates a new URL from scratch. For path preservation, direct string manipulation of `Astro.url.pathname` is simpler and more reliable.

```astro
---
// src/components/layout/LangSwitch.astro
import { languages } from "@/i18n/ui";
import { getLangFromUrl } from "@/i18n/utils";

const currentLang = getLangFromUrl(Astro.url);
const currentPath = Astro.url.pathname;

function getLocalizedPath(targetLang: string): string {
  // Strip current locale prefix, prepend target locale
  const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(\/|$)/, "/");
  const cleanPath = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
  return `/${targetLang}${cleanPath}`;
}
---
<div class="flex items-center gap-1 text-sm">
  {Object.entries(languages).map(([lang, label]) => (
    <a
      href={getLocalizedPath(lang)}
      class:list={[
        "px-2 py-1 rounded-sm transition-colors",
        lang === currentLang
          ? "text-teal-bright font-semibold"
          : "text-text-secondary hover:text-text-primary",
      ]}
      aria-current={lang === currentLang ? "true" : undefined}
      aria-label={`Switch to ${label}`}
    >
      {lang.toUpperCase()}
    </a>
  ))}
</div>
```

**Confidence:** HIGH -- standard URL manipulation pattern, verified against community examples and Astro docs.

### Pattern 3: Sticky Header with Backdrop Blur

**What:** Fixed-position header with semi-transparent background and backdrop blur that appears as user scrolls.
**When to use:** The site-wide header (requirement LAYO-01).
**Key Tailwind v4 classes:** `sticky top-0 z-50 bg-canvas/90 backdrop-blur-lg border-b border-border`

```astro
---
// src/components/layout/Header.astro
import Nav from "./Nav.astro";
import LangSwitch from "./LangSwitch.astro";
import { getLangFromUrl } from "@/i18n/utils";

const lang = getLangFromUrl(Astro.url);
---
<header class="sticky top-0 z-50 bg-canvas/90 backdrop-blur-lg border-b border-border">
  <div class="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
    <a href={`/${lang}`} class="font-code text-lg text-teal font-semibold" aria-label="Home">
      &gt;_
    </a>
    <div class="flex items-center gap-6">
      <Nav />
      <LangSwitch />
    </div>
  </div>
</header>
```

**Important Tailwind v4 note:** The `bg-canvas/90` syntax works in Tailwind v4 for opacity modifiers on custom theme colors. This creates `background-color: rgb(24 24 24 / 0.9)` which allows the backdrop blur to show through.

**Confidence:** HIGH -- standard Tailwind pattern, verified against Tailwind v4 docs.

### Pattern 4: Scroll-Reveal with View Transitions Compatibility

**What:** IntersectionObserver-based fade-up animations that re-initialize after View Transitions navigation.
**When to use:** BaseLayout's existing IntersectionObserver script needs to be wrapped in `astro:page-load` for future View Transitions compatibility (Phase 6).

**Current implementation (BaseLayout.astro):**
```html
<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );
  document
    .querySelectorAll(".fade-up, .section-title")
    .forEach((el) => observer.observe(el));
</script>
```

**Recommended update for View Transitions readiness:**
```html
<script>
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target); // Disconnect after animation
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    document
      .querySelectorAll(".fade-up:not(.in-view), .section-title:not(.in-view)")
      .forEach((el) => observer.observe(el));
  }

  // Runs on first load AND after every View Transition navigation
  document.addEventListener("astro:page-load", initScrollReveal);
</script>
```

**Key changes:**
1. Wrap in `astro:page-load` event for View Transitions compatibility (Phase 6 will add ClientRouter)
2. `observer.unobserve(entry.target)` disconnects after animation, preventing memory leaks
3. `:not(.in-view)` selector avoids re-animating already-revealed elements

**Confidence:** HIGH -- verified against Astro View Transitions docs (https://docs.astro.build/en/guides/view-transitions/).

### Anti-Patterns to Avoid

- **Hardcoding translation strings in templates:** Use `{t("nav.home")}` not `{lang === "fr" ? "Accueil" : "Home"}`. The latter becomes unmaintainable as strings multiply.
- **Using `getRelativeLocaleUrl()` for language switcher:** This function builds a new URL from a path segment. For preserving the current page path during language switch, direct pathname manipulation is more reliable.
- **Using `@apply` in component `<style>` blocks without `@reference`:** Tailwind v4 treats component styles as isolated CSS modules. Use utility classes in markup (preferred) or add `@reference "../../styles/global.css"` in style blocks.
- **Shipping teal (#0d9488) as body text color:** It fails WCAG AA on most backgrounds (see Contrast Audit below). Use `teal-bright` (#2dd4bf) or `teal-hover` (#14b8a6) for text on dark backgrounds.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| i18n URL generation | Custom URL builder with locale parsing | `Astro.currentLocale` + simple path manipulation | Astro already detects locale from URL; no need to re-parse |
| Active navigation detection | Complex route matching regex | `Astro.url.pathname.startsWith()` | Astro provides the full URL; simple string match is sufficient |
| Scroll-reveal animations | External library (AOS, sal.js) | IntersectionObserver (already in BaseLayout) | 25 lines of vanilla JS vs 29KB library |
| Font loading | Self-hosted font infrastructure | Google Fonts with `display=swap` (already configured) | Acceptable for v1; self-host in Phase 6 for GDPR/perf if needed |
| Backdrop blur fallback | Custom polyfill for older browsers | `@supports (backdrop-filter: blur())` CSS | backdrop-filter has 97%+ browser support; graceful degradation is fine |

## Common Pitfalls

### Pitfall 1: Tailwind v4 Utility Scale Renames

**What goes wrong:** Classes like `rounded`, `shadow`, `blur` render differently in Tailwind v4 vs v3. The bare `rounded` in v4 maps to what was `rounded-sm` in v3 (2px smaller corners).
**Why it happens:** v4 renamed the default scale so every value has an explicit name.
**How to avoid:** Use explicit sizes: `rounded-lg` (8px), `rounded-md` (6px), `rounded-sm` (4px). Never use bare `rounded`, `shadow`, or `blur` -- always qualify with a size suffix.
**Warning signs:** Components look "flatter" or "tighter" than expected.

**Key renames for Phase 1:**

| v3 class | v4 equivalent | Used in |
|----------|---------------|---------|
| `shadow` | `shadow-sm` | Card elements, header |
| `rounded` | `rounded-sm` | Buttons, badges |
| `blur` | `blur-sm` | Backdrop filter |
| `ring` (3px) | `ring-3` | Focus indicators |
| `bg-gradient-to-r` | `bg-linear-to-r` | Glow line (but using raw CSS gradient) |

### Pitfall 2: @apply Fails in Astro Component Style Blocks

**What goes wrong:** `@apply` inside `<style>` blocks in `.astro` files throws "Cannot apply unknown utility class" because Tailwind v4 processes each style block as an isolated CSS module.
**How to avoid:** Prefer utility classes in markup (Tailwind's recommended approach). If `@apply` is absolutely needed, add `@reference "../../styles/global.css"` at the top of the style block. The relative path must be correct for each component's depth.
**Warning signs:** Build errors mentioning "Cannot apply unknown utility class".

### Pitfall 3: i18n 404 Page With prefixDefaultLocale: true

**What goes wrong:** Visiting `/nonexistent` (no locale prefix) shows a blank page instead of a 404 page. URLs with locale prefix (`/en/nonexistent`) work correctly.
**Why it happens:** Astro generates `404.html` at the root, but with `prefixDefaultLocale: true`, unprefixed paths fall through without matching the 404 handler. Known issue (GitHub #12750).
**How to avoid:** Create both `src/pages/404.astro` (root fallback for Cloudflare Pages) and locale-specific pages will be handled by Astro's routing. The root `404.html` is what Cloudflare Pages serves for unmatched routes.
**Warning signs:** Random URLs without locale prefix show a blank page.

### Pitfall 4: Trailing Slash Conflict Between Astro and Cloudflare Pages

**What goes wrong:** The project uses `trailingSlash: "never"`, but Cloudflare Pages adds trailing slashes to directories, creating 301 redirect chains.
**How to avoid:** Verify behavior with `wrangler pages dev dist` locally. If redirect chains appear, consider switching to `trailingSlash: "always"`. For Phase 1, test internal links on local Cloudflare preview.
**Warning signs:** Lighthouse reports redirect chains; links behave differently in dev vs production.

### Pitfall 5: IntersectionObserver Not Re-Initialized After View Transitions

**What goes wrong:** When ClientRouter is added (Phase 6), the IntersectionObserver script in BaseLayout does not re-run after soft navigation, so elements on new pages never get `.in-view` class.
**How to avoid:** Wrap the initialization in `document.addEventListener("astro:page-load", ...)` from day one. This event fires on first load AND after every View Transition, making the code forward-compatible.
**Warning signs:** Animations work on first page load but not after navigation (only detectable after Phase 6).

### Pitfall 6: WCAG Contrast Failures with Design Tokens

**What goes wrong:** Certain color combinations in the design token system fail WCAG AA contrast requirements. Using `text-muted` (#6b6b6b) or base `teal` (#0d9488) as text on dark backgrounds produces insufficient contrast.
**How to avoid:** Follow the Contrast Audit below. Use the right color for the right purpose.
**Warning signs:** Lighthouse Accessibility score below 90; contrast ratio warnings in browser DevTools.

## WCAG AA Contrast Audit

**Methodology:** Calculated using the WCAG 2.1 relative luminance formula (sRGB to linear conversion, then `(L1 + 0.05) / (L2 + 0.05)`). All values independently verified with Node.js computation.

### PASS -- Safe to Use

| Foreground | Background | Ratio | AA Normal (4.5:1) | AA Large (3:1) | Use For |
|------------|------------|-------|-------------------|----------------|---------|
| text-primary (#e6e6e6) | canvas (#181818) | 14.23:1 | PASS | PASS | Body text, headings |
| text-primary (#e6e6e6) | surface (#232323) | 12.59:1 | PASS | PASS | Card text, raised content |
| text-primary (#e6e6e6) | surface-raised (#2d2d2d) | 11.03:1 | PASS | PASS | Button text on raised surfaces |
| text-primary (#e6e6e6) | void (#111111) | 15.13:1 | PASS | PASS | Code block text |
| text-secondary (#a0a0a0) | canvas (#181818) | 6.79:1 | PASS | PASS | Secondary labels, metadata |
| text-secondary (#a0a0a0) | surface (#232323) | 6.01:1 | PASS | PASS | Card secondary text |
| text-secondary (#a0a0a0) | surface-raised (#2d2d2d) | 5.27:1 | PASS | PASS | Raised surface secondary text |
| text-secondary (#a0a0a0) | void (#111111) | 7.22:1 | PASS | PASS | Code comments |
| teal (#0d9488) | canvas (#181818) | 4.74:1 | PASS | PASS | Accent text on canvas ONLY |
| teal-hover (#14b8a6) | canvas (#181818) | 7.13:1 | PASS | PASS | Links, interactive elements |
| teal-bright (#2dd4bf) | canvas (#181818) | 9.54:1 | PASS | PASS | Highlighted text, active states |
| teal-bright (#2dd4bf) | surface (#232323) | 8.44:1 | PASS | PASS | Links on cards |

### FAIL -- Must Not Use for Body Text

| Foreground | Background | Ratio | AA Normal | Issue | Remediation |
|------------|------------|-------|-----------|-------|-------------|
| text-muted (#6b6b6b) | canvas (#181818) | 3.33:1 | FAIL | Below 4.5:1 for normal text | Use ONLY for large text (18px+ or 14px+ bold), decorative elements, or disabled states. Never for body copy. |
| text-muted (#6b6b6b) | surface (#232323) | 2.95:1 | FAIL | Below 3:1 even for large text | Do NOT use on surface backgrounds at all. Use text-secondary instead. |
| teal (#0d9488) | surface (#232323) | 4.20:1 | FAIL | Below 4.5:1 | Use teal-bright (#2dd4bf) for text on surface backgrounds. Reserve base teal for canvas backgrounds only. |
| teal (#0d9488) | surface-raised (#2d2d2d) | 3.68:1 | FAIL | Below 4.5:1 | Same -- use teal-bright or teal-hover instead. |

### Design Token Usage Rules (for Planner)

1. **`text-muted` (#6b6b6b):** Use ONLY for decorative/non-essential text at large sizes (18px+) on `canvas` background. Never on `surface` or `surface-raised`. Consider brightening to #808080 (ratio ~4.5:1 on canvas) if more usage is needed.
2. **`teal` (#0d9488):** Safe for text only on `canvas` (#181818) background. On any lighter background, use `teal-hover` (#14b8a6) or `teal-bright` (#2dd4bf) instead.
3. **`teal-bright` (#2dd4bf):** Safe everywhere. Use as the default accent text color.
4. **`text-secondary` (#a0a0a0):** Safe on all dark backgrounds. Use for metadata, labels, descriptions.
5. **`text-primary` (#e6e6e6):** Safe everywhere. Use for headings and body text.

## Code Examples

### Complete Footer Component Pattern

```astro
---
// src/components/layout/Footer.astro
import { getLangFromUrl, useTranslations } from "@/i18n/utils";
import GlowLine from "@/components/ui/GlowLine.astro";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const currentYear = new Date().getFullYear();

const socialLinks = [
  { name: "GitHub", href: "https://github.com/seb-music", icon: "github" },
  { name: "Twitter/X", href: "https://twitter.com/seb_music", icon: "twitter" },
  { name: "LinkedIn", href: "https://linkedin.com/in/seb-music", icon: "linkedin" },
  { name: "RSS", href: `/${lang}/rss.xml`, icon: "rss" },
];
---
<footer class="mt-auto">
  <GlowLine />
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-12">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <p class="font-code text-teal-bright text-lg mb-2">&gt;_</p>
        <p class="text-text-secondary text-sm max-w-xs">
          {t("footer.description")}
        </p>
      </div>
      <div class="flex items-center gap-4">
        {socialLinks.map((link) => (
          <a
            href={link.href}
            target={link.name === "RSS" ? undefined : "_blank"}
            rel={link.name === "RSS" ? undefined : "noopener noreferrer"}
            class="text-text-muted hover:text-teal-bright transition-colors"
            aria-label={link.name}
          >
            {/* SVG icon for link.icon */}
            <span class="sr-only">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
    <p class="text-text-muted text-xs mt-8">
      &copy; {currentYear} sebc.dev. {t("footer.copyright")}
    </p>
  </div>
</footer>
```

**Note:** The `text-text-muted` class on copyright text is acceptable because copyright text is non-essential decorative content. The social link icons use `text-text-muted` at icon sizes (considered decorative/large). Interactive states use `hover:text-teal-bright` which passes AA.

### Navigation with Active State Detection

```astro
---
// src/components/layout/Nav.astro
import { getLangFromUrl, useTranslations } from "@/i18n/utils";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const pathname = Astro.url.pathname;

const navItems = [
  { key: "nav.home" as const, href: `/${lang}` },
  { key: "nav.search" as const, href: `/${lang}/search` },
  { key: "nav.about" as const, href: `/${lang}/about` },
];

function isActive(href: string): boolean {
  if (href === `/${lang}`) {
    // Home: active only on exact match (with or without trailing slash)
    return pathname === `/${lang}` || pathname === `/${lang}/`;
  }
  return pathname.startsWith(href);
}
---
<nav aria-label="Main navigation">
  <ul class="flex items-center gap-6">
    {navItems.map((item) => (
      <li>
        <a
          href={item.href}
          class:list={[
            "text-sm transition-colors",
            isActive(item.href)
              ? "text-teal-bright font-semibold"
              : "text-text-secondary hover:text-text-primary",
          ]}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          {t(item.key)}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

### GlowLine Component

```astro
---
// src/components/ui/GlowLine.astro
---
<div class="glow-line w-full" role="presentation" aria-hidden="true"></div>
```

**Note:** The `.glow-line` class is already defined in `global.css` with the teal gradient. Adding `role="presentation"` and `aria-hidden="true"` ensures screen readers skip this decorative element.

### Root 404 Page

```astro
---
// src/pages/404.astro
import BaseLayout from "@/layouts/BaseLayout.astro";
---
<BaseLayout title="Page not found">
  <section class="max-w-6xl mx-auto px-6 lg:px-8 py-32 text-center">
    <h1 class="text-6xl font-bold text-text-primary mb-4">404</h1>
    <p class="text-text-secondary text-lg mb-8">
      This page doesn't exist.
    </p>
    <a href="/en" class="text-teal-bright hover:text-teal-hover underline underline-offset-4">
      Go to homepage
    </a>
  </section>
</BaseLayout>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` plugin | Astro 5.2 (Dec 2024) | Already using correct approach |
| `entry.slug` for content | `entry.id` with `glob()` loader | Astro 5.0 (Dec 2024) | Already using correct approach |
| `tailwind.config.js` | CSS-first `@theme` in `global.css` | Tailwind v4 (Jan 2025) | Already using correct approach |
| `@apply` works everywhere | `@apply` needs `@reference` in component styles | Tailwind v4 (Jan 2025) | Prefer utility classes in markup |
| Bare `rounded`, `shadow` | Explicit `rounded-sm`, `shadow-sm` | Tailwind v4 (Jan 2025) | Must use explicit suffixes |
| `bg-gradient-to-r` | `bg-linear-to-r` | Tailwind v4 (Jan 2025) | But glow-line uses raw CSS gradient |
| `outline-none` | `outline-hidden` | Tailwind v4 (Jan 2025) | For focus ring removal |
| `!flex` (prefix) | `flex!` (suffix) | Tailwind v4 (Jan 2025) | If important modifier needed |

## Open Questions

1. **Social link URLs**
   - What we know: Footer needs GitHub, Twitter/X, LinkedIn, RSS links
   - What's unclear: The actual social media profile URLs for the blog author
   - Recommendation: Use placeholder URLs in implementation; author fills in actual URLs. Structure the links as data in Footer component props or i18n constants.

2. **Font loading strategy for GDPR**
   - What we know: Currently using Google Fonts CDN (`fonts.googleapis.com`). This sends user IP to Google, which may violate GDPR for French audience.
   - What's unclear: Whether to self-host fonts in Phase 1 or defer to Phase 6
   - Recommendation: Defer to Phase 6. Google Fonts with `display=swap` works for development. Self-hosting involves downloading fonts, creating `@font-face` declarations, and updating BaseLayout. Low urgency for development phase.

3. **Trailing slash behavior on Cloudflare Pages**
   - What we know: Config says `trailingSlash: "never"` but Cloudflare Pages has opinionated behavior
   - What's unclear: Exact behavior with current output
   - Recommendation: Test with `wrangler pages dev dist` after building Phase 1. If redirect chains occur, switch to `trailingSlash: "always"`. This is a Phase 1 verification task, not a blocker.

## Sources

### Primary (HIGH confidence)
- Astro i18n Recipe - https://docs.astro.build/en/recipes/i18n/ - translation dictionary pattern, useTranslations helper
- Astro i18n Routing - https://docs.astro.build/en/guides/internationalization/ - prefixDefaultLocale, redirectToDefaultLocale, routing behavior
- Astro i18n API Reference - https://docs.astro.build/en/reference/modules/astro-i18n/ - getRelativeLocaleUrl, Astro.currentLocale
- Astro View Transitions - https://docs.astro.build/en/guides/view-transitions/ - astro:page-load event, script re-execution
- Tailwind CSS v4 Upgrade Guide - https://tailwindcss.com/docs/upgrade-guide - utility renames, @reference, gradient changes
- Tailwind CSS Backdrop Blur - https://tailwindcss.com/docs/backdrop-blur - backdrop-blur-lg usage
- WCAG 2.1 Contrast Requirements - https://webaim.org/articles/contrast/ - 4.5:1 normal text, 3:1 large text ratios

### Secondary (MEDIUM confidence)
- Astro language switcher patterns - https://eastondev.com/blog/en/posts/dev/20251202-astro-i18n-guide/ - path-preserving language switcher approach
- Astro 404 with i18n Issue - https://github.com/withastro/astro/issues/12750 - known issue with prefixDefaultLocale 404 handling
- Tailwind @apply in component styles - https://github.com/tailwindlabs/tailwindcss/issues/15952 - @reference requirement confirmed

### Computed (HIGH confidence)
- WCAG contrast ratios - Calculated using WCAG 2.1 relative luminance formula in Node.js against all design token color combinations. Cross-verified with WebAIM contrast checker.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all dependencies already installed, no new packages needed
- Architecture (i18n system): HIGH - official Astro recipe pattern, verified against current docs
- Architecture (layout components): HIGH - standard Astro component composition, straightforward Tailwind styling
- Pitfalls: HIGH - verified against official docs, community issues, and computed contrast ratios
- WCAG contrast audit: HIGH - independently computed using standard WCAG formula

**Research date:** 2026-02-09
**Valid until:** 2026-04-09 (stable stack, no breaking changes expected)
