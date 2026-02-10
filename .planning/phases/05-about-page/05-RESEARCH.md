# Phase 5: About Page - Research

**Researched:** 2026-02-10
**Domain:** Astro static page, Tailwind CSS v4, i18n, design system consistency
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Philosophie d'abord -- ouvrir sur le "learn in public" et l'intersection IA x Ingenierie x UX
- Page minimale : philosophie + courte bio + liens sociaux (pas de parcours pro detaille)
- Trois blocs visuels pour les piliers (IA, Ingenierie, UX) -- chacun avec icone + court texte
- Chaque bloc pilier est cliquable et redirige vers la page search pre-filtree par ce pillar tag
- CTA en fin de page : "Decouvrir mes articles" -- lien vers la home ou search
- Registre conversationnel -- comme parler a un collegue dev, direct et accessible
- Premiere personne (je/I) -- personnel et authentique
- Le texte sera fourni par l'utilisateur -- Claude cree la structure/composants avec des placeholders
- Layout hero + sections : grand bloc hero en haut (photo + accroche philosophie), puis sections empilees
- Photo reelle de profil dans le hero
- Icones sociales (GitHub, Twitter/X, LinkedIn, dev.to) integrees au hero, sous la photo
- Icones seules sans labels texte -- minimaliste
- Hero sobre et coherent avec le design system -- fond void/canvas, pas de gradient ni glow special
- Animations legeres : scroll-reveal (existant) + hover effects sur les blocs piliers + transitions subtiles
- Hover des blocs piliers : bordure ou ombre teal (glow teal) -- coherent avec le design system
- Pas de rich interactions (pas de parallaxe, flip, expand)

### Claude's Discretion
- Choix des icones pour chaque pilier (IA, Ingenierie, UX)
- Espacement et typographie exacte du hero
- Disposition responsive des blocs piliers (grille, flex)
- Traitement visuel exact du CTA en fin de page

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

## Summary

Phase 5 replaces the existing placeholder About pages (`src/pages/en/about.astro` and `src/pages/fr/about.astro`) with a full implementation following a hero + sections layout. The page is purely static Astro with Tailwind CSS v4, using BaseLayout. No new libraries or dependencies are needed -- everything required already exists in the codebase.

The primary technical consideration is the **pillar tag linking**. The user decided that each pillar block (IA, Ingenierie, UX) should link to the search page pre-filtered by that pillar tag. However, the current search page does NOT support pillar tag filtering -- it only has `category` and `tag` (regular tags) via Pagefind. This means the implementation must either: (a) add pillar tag support to the search page, or (b) use a simpler approach like linking to a text search for the pillar name. This is the most significant planning consideration.

**Primary recommendation:** Build the About page as two static `.astro` pages (EN + FR) with shared components. For pillar block links, use the search page's `tags` URL param mechanism, which requires adding pillar tags to the Pagefind tag filter index in `ArticleLayout.astro`. Add new i18n keys for all About page text placeholders.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Page framework | Already the project framework |
| Tailwind CSS | v4 | Styling | Already configured via `@tailwindcss/vite` |
| BaseLayout.astro | n/a | Page layout wrapper | Used by all pages in the project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `src/i18n/utils.ts` | n/a | `getLangFromUrl()`, `useTranslations()` | For all translatable text |
| `src/i18n/ui.ts` | n/a | Translation string definitions | Add `about.*` keys |
| `src/lib/pillarTags.ts` | n/a | Pillar color classes | Reuse for pillar block styling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline SVG icons | Icon library (lucide-astro) | Project uses inline SVG everywhere; adding a library would be inconsistent |
| Shared About component | Two separate pages | Pages are already duplicated pattern (en/fr search are separate files) |

**Installation:**
```bash
# No installation needed -- everything is already in the project
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   ├── en/about.astro          # EN About page (replace existing)
│   └── fr/about.astro          # FR About page (replace existing)
├── components/
│   └── about/                  # NEW: About-specific components (optional)
│       └── PillarBlock.astro   # Reusable pillar block component
├── i18n/
│   └── ui.ts                   # Add about.* translation keys
└── lib/
    └── pillarTags.ts           # Already exists, reuse color classes
```

### Pattern 1: Page Layout (Hero + Sections)
**What:** The About page follows the hero + stacked sections pattern already used across the site.
**When to use:** All content pages in this project.
**Example:**
```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import { getLangFromUrl, useTranslations } from "@/i18n/utils";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<BaseLayout title={t("nav.about")} description={t("about.description")}>
  <!-- Hero section -->
  <section class="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24 fade-up">
    <!-- Photo + philosophy + social icons -->
  </section>

  <!-- Pillar blocks section -->
  <section class="max-w-6xl mx-auto px-6 lg:px-8 py-16 fade-up">
    <!-- 3 pillar blocks -->
  </section>

  <!-- CTA section -->
  <section class="max-w-6xl mx-auto px-6 lg:px-8 py-16 fade-up">
    <!-- CTA link to articles -->
  </section>
</BaseLayout>
```

### Pattern 2: Social Icons (Matching Footer Pattern)
**What:** The footer already defines social link icons using inline SVG with a data-driven pattern.
**When to use:** Reproducing social icons in the About hero.
**Key detail:** Footer uses GitHub, Twitter, LinkedIn, RSS. About needs GitHub, Twitter/X, LinkedIn, dev.to (different set). The dev.to icon SVG exists in `ShareButtons.astro` (uses `fill="currentColor"` not stroke).
**Example:**
```astro
<!-- Footer icon pattern (text-text-secondary hover:text-teal-bright per prior decision 01-02) -->
<a href="https://github.com/sebc"
   class="text-text-secondary hover:text-teal-bright transition-colors"
   aria-label="GitHub"
   target="_blank" rel="noopener noreferrer">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5..."/>
  </svg>
</a>
```

### Pattern 3: Pillar Blocks with Link to Search
**What:** Three clickable cards, each representing a pillar (IA, Ingenierie, UX), linking to the search page.
**When to use:** About page pillar section.
**Key consideration:** Pillar tags use unique color classes from `src/lib/pillarTags.ts`:
- IA: `bg-purple-500/15 border-purple-500/30 text-purple-400`
- Ingenierie: `bg-teal/15 border-teal/30 text-teal-bright`
- UX: `bg-amber-500/15 border-amber-500/30 text-amber-400`

### Pattern 4: Scroll Reveal Animation (Existing)
**What:** BaseLayout already includes an IntersectionObserver that adds `.in-view` to `.fade-up` elements.
**When to use:** Any section that should animate in on scroll.
**Example:** Simply add `class="fade-up"` to the section. The BaseLayout script handles the rest.

### Anti-Patterns to Avoid
- **Creating a shared About layout component:** The project pattern is to have separate EN/FR page files (see `search.astro`). Do NOT create a single parametrized component -- keep the two-file pattern.
- **Using `entry.render()` for content:** This is Astro 4 syntax. Content on About page is hardcoded in the page template, not from collections.
- **Adding Tailwind v3 `@apply` without `@reference`:** In Tailwind v4, `<style>` blocks need `@reference "../styles/global.css"` for `@apply` to work.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll reveal | Custom IntersectionObserver | Existing `fade-up` class + BaseLayout script | Already implemented and working |
| Pillar color mapping | Switch statement in page | `getPillarColorClass()` from `src/lib/pillarTags.ts` | Already handles accent normalization |
| i18n text | Hardcoded strings | `useTranslations()` pattern from `src/i18n/utils.ts` | Consistent with all other pages |
| Social icon SVG paths | New icon set | Copy from Footer.astro (GitHub, Twitter, LinkedIn) + ShareButtons.astro (dev.to) | Exact same icons already in codebase |

**Key insight:** This page requires zero new libraries. Every building block exists in the codebase -- the work is composition and styling, not invention.

## Common Pitfalls

### Pitfall 1: Pillar Block Links Don't Work with Search
**What goes wrong:** The pillar blocks link to `/{lang}/search?tags=IA` but the search page's tag filter only contains regular tags (typescript, css, etc.), not pillar tags (IA, Ingenierie, UX). Pillar tags are NOT indexed by Pagefind.
**Why it happens:** Pillar tags are a separate field from `tags` in the content schema. The `ArticleLayout.astro` only indexes `tags` and `category` for Pagefind, not `pillarTags`.
**How to avoid:** Two options:
1. **Recommended:** Add pillar tags to the Pagefind tag index in `ArticleLayout.astro` by adding `<meta data-pagefind-filter="tag[content]" content={pillar} />` for each pillar tag. This makes pillar tags searchable alongside regular tags. Then link from About to `/{lang}/search?tags={pillarTag}`.
2. **Alternative:** Use a text search query instead: `/{lang}/search?q=IA`. Less precise but requires no search page changes.
**Warning signs:** Clicking a pillar block on About leads to zero results on the search page.

### Pitfall 2: Accented Characters in Pillar Tag URLs
**What goes wrong:** The "Ingenierie" pillar tag is actually `"Ingénierie"` (with accent). URL encoding must be correct.
**Why it happens:** The `encodeURIComponent("Ingénierie")` produces `Ing%C3%A9nierie`. The search page must decode this correctly.
**How to avoid:** Use `encodeURIComponent()` when building the URL (like `ArticleCard.astro` does for categories). The search page's `readStateFromUrl()` uses `URLSearchParams` which handles decoding.
**Warning signs:** Pillar tag filter chip shows garbled text or doesn't match.

### Pitfall 3: Duplicate EN/FR Pages Drift
**What goes wrong:** Two About pages with identical structure but different text get out of sync during maintenance.
**Why it happens:** The project pattern is separate files per locale (see search.astro is duplicated EN/FR).
**How to avoid:** Keep the HTML structure identical between EN and FR. Use i18n translation keys for ALL text (even placeholder text). Only the `lang` variable and translated content should differ.
**Warning signs:** Layout differences between EN and FR About pages.

### Pitfall 4: Profile Photo Path
**What goes wrong:** The profile photo is referenced but doesn't exist in the project.
**Why it happens:** No `public/` images or `src/assets/` directory exists yet. The `public/` directory only contains `_headers`.
**How to avoid:** Plan for the image path. Use a placeholder path (e.g., `/images/profile.jpg`) and document that the user needs to provide the actual image. The image should go in `public/images/` for static serving without Astro image optimization.
**Warning signs:** Broken image on the About page.

### Pitfall 5: Social Link URLs Are Placeholder
**What goes wrong:** Footer already has social links with placeholder URLs (`https://github.com/sebc`). About page social icons must use the same URLs for consistency.
**Why it happens:** Social URLs are hardcoded in `Footer.astro`, not centralized.
**How to avoid:** Use the exact same URLs from `Footer.astro`. Consider extracting social links into a shared data file (`src/lib/socialLinks.ts`) to avoid duplication, but this is optional scope.
**Warning signs:** Different URLs for the same platform between Footer and About page.

### Pitfall 6: WCAG Contrast on Social Icons
**What goes wrong:** Icons use wrong color that fails WCAG AA contrast on canvas background.
**Why it happens:** Prior decision 01-02 established: social icons use `text-text-secondary hover:text-teal-bright` (NOT `text-text-muted`).
**How to avoid:** Follow the established pattern from Footer.astro: `class="text-text-secondary hover:text-teal-bright transition-colors"`.
**Warning signs:** Lighthouse accessibility score drops below 0.9.

## Code Examples

Verified patterns from the existing codebase:

### Social Icon Data Pattern (from Footer.astro)
```typescript
// Source: src/components/layout/Footer.astro lines 9-34
const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/sebc",
    external: true,
    icon: `<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5..."/>`,
  },
  // ... Twitter, LinkedIn
];
```

### dev.to Icon SVG (from ShareButtons.astro)
```html
<!-- Source: src/components/article/ShareButtons.astro lines 88-93 -->
<!-- Note: dev.to uses fill, not stroke -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
  <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"></path>
</svg>
```

### Pillar Color Classes (from pillarTags.ts)
```typescript
// Source: src/lib/pillarTags.ts
const pillarClasses = {
  IA: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  Ingenierie: "bg-teal/15 border-teal/30 text-teal-bright",
  UX: "bg-amber-500/15 border-amber-500/30 text-amber-400",
} as const;
```

### i18n Pattern (from all pages)
```astro
---
// Source: src/pages/en/index.astro
import { getLangFromUrl, useTranslations } from "@/i18n/utils";
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
```

### Search Page URL Params (for pillar block links)
```typescript
// Source: src/pages/en/search.astro lines 577-593
// State read from URL:
// q=, cat=, tags= (comma-separated), from=, to=, rtMin=, rtMax=
// Tags filter uses: params.get("tags")?.split(",").filter(Boolean)
// Pillar block link format: /{lang}/search?tags={encodedPillarTag}
```

### Existing Hover Pattern for Cards (from mockup, consistent with design system)
```css
/* Source: global.css design tokens */
/* Teal glow hover effect for cards */
hover:border-teal/30  /* or */  hover:shadow-[0_0_16px_var(--color-teal-glow)]
```

## Pillar Icon Recommendations (Claude's Discretion)

Based on the project's inline SVG style (Lucide-like, 24x24 viewBox, stroke-based):

### IA (AI/Intelligence Artificielle)
**Recommendation:** Brain/neural network icon
```html
<!-- Brain icon (Lucide "brain") -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
  <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
  <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
  <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
  <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
  <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
  <path d="M6 18a4 4 0 0 1-1.967-.516"/>
  <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
</svg>
```

### Ingenierie (Engineering)
**Recommendation:** Code/terminal icon (consistent with the site's `>_` branding)
```html
<!-- Code icon (Lucide "code-2") -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m18 16 4-4-4-4"/>
  <path d="m6 8-4 4 4 4"/>
  <path d="m14.5 4-5 16"/>
</svg>
```

### UX (User Experience)
**Recommendation:** Layout/design icon
```html
<!-- Layout icon (Lucide "layout") -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="18" x="3" y="3" rx="2"/>
  <path d="M3 9h18"/>
  <path d="M9 21V9"/>
</svg>
```

## Responsive Layout Recommendation (Claude's Discretion)

### Pillar Blocks Grid
- **Mobile (< sm):** Single column stack (`grid-cols-1`)
- **Tablet (sm):** Single column stack (blocks are wide enough at sm)
- **Desktop (lg):** Three columns side by side (`grid-cols-3`)
- Gap: `gap-6` (consistent with article card grid)

### CTA Treatment
- Centered text block with a prominent link
- Use `text-teal-bright hover:text-teal-hover` for the link (consistent with design system)
- Could be a button-like element: `border border-teal text-teal-bright hover:bg-teal/15 px-6 py-3 rounded-xs`

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Mockup `about.html` (timeline, tech stack, projects) | Minimal page (philosophy + pillars + social + CTA) | Phase 5 CONTEXT.md decision | Much simpler page, no timeline/projects/newsletter |
| `@astrojs/tailwind` | `@tailwindcss/vite` | Astro 5.2 | Use `@reference` in style blocks |

**Deprecated/outdated:**
- The `docs/design-research/about.html` mockup is explicitly discarded per CONTEXT.md. It contained timeline, tech stack grid, projects section, and newsletter form -- none of which are in scope.

## Open Questions

1. **Pillar tag search integration**
   - What we know: Pillar tags (IA, Ingenierie, UX) are separate from regular tags in the content schema. The search page only filters by `category` and `tag` (regular tags). Pillar tags are NOT indexed by Pagefind.
   - What's unclear: Should we add pillar tags to the Pagefind `tag` filter, or create a separate `pillar` filter, or use a text search query?
   - Recommendation: Add pillar tags to the Pagefind `tag` index in `ArticleLayout.astro`. This is the simplest approach -- it makes pillar tags appear in the search sidebar under "Tags" and work with `?tags=IA` URL params. No search page JS changes needed. The trade-off is that pillar tags and regular tags are mixed in the same filter section, but this is acceptable given the small number of pillar tags.

2. **Profile photo file**
   - What we know: No image assets exist in the project yet (`public/` only has `_headers`). A real profile photo is required per decisions.
   - What's unclear: What format and dimensions should the photo be?
   - Recommendation: Use a placeholder `<img>` tag pointing to `/images/profile.jpg` (or `.webp`). Create `public/images/` directory. The user will provide the actual photo. Recommended size: 200x200 or 256x256, square crop, WebP format for performance.

3. **Social link URLs centralization**
   - What we know: Social URLs are hardcoded in `Footer.astro`. About page will need the same URLs (minus RSS, plus dev.to).
   - What's unclear: Should we extract to a shared module?
   - Recommendation: For this phase, hardcode in the About page (matching Footer). Extracting to `src/lib/socialLinks.ts` is a nice refactor but can be deferred -- it's a two-file duplication, not a maintenance nightmare.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/pages/en/about.astro`, `src/pages/fr/about.astro` -- current placeholder pages
- Codebase analysis: `src/pages/en/search.astro` -- search URL params and filter system
- Codebase analysis: `src/layouts/ArticleLayout.astro` -- Pagefind filter indexing
- Codebase analysis: `src/components/layout/Footer.astro` -- social icon pattern and URLs
- Codebase analysis: `src/components/article/ShareButtons.astro` -- dev.to icon SVG
- Codebase analysis: `src/lib/pillarTags.ts` -- pillar color class mapping
- Codebase analysis: `src/i18n/ui.ts` -- current translation keys
- Codebase analysis: `src/styles/global.css` -- design tokens and animation classes
- Codebase analysis: `src/content.config.ts` -- pillarTags schema definition

### Secondary (MEDIUM confidence)
- Codebase analysis: `docs/design-research/about.html` -- discarded mockup (referenced for understanding what was rejected)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new libraries needed, everything exists in codebase
- Architecture: HIGH - Page structure follows established patterns (BaseLayout, i18n, fade-up)
- Pitfalls: HIGH - All identified from direct codebase analysis (Pagefind indexing gap, WCAG contrast rules, accent encoding)

**Research date:** 2026-02-10
**Valid until:** 2026-03-10 (stable -- no external dependencies to change)
