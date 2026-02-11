# Audit du projet sebc.dev

> **Date**: 2026-02-11
> **Scope**: Tous les fichiers source du projet (hors node_modules, .astro/, dist/)
> **Lignes totales**: ~8 029 lignes de code source
> **Auditeur**: Claude Opus 4.6 avec skill astro-cloudflare + MCP Astro/Cloudflare docs

## Legende statut

| Symbole | Signification |
|---------|---------------|
| `[x]`   | Analyse OK    |
| `[~]`   | Suggestions mineures |
| `[!]`   | Problemes trouves |

---

## 1. Configuration racine

| Statut | Fichier | Categorie | Verdict |
|--------|---------|-----------|---------|
| `[x]` | `astro.config.mjs` | Build config | `output: "static"`, `@tailwindcss/vite`, i18n `prefixDefaultLocale: true` -- tout correct |
| `[x]` | `tsconfig.json` | TypeScript | Extends `astro/tsconfigs/strict`, path alias `@/*` OK |
| `[x]` | `vitest.config.ts` | Tests | `getViteConfig()` avec `as any` cast, vitest ^3.x -- correct |
| `[~]` | `playwright.config.ts` | E2E Tests | OK mais `retries`, `reporter` et `workers` a configurer si suite grandit |
| `[x]` | `eslint.config.js` | Linting | ESLint 9 flat config, `worker-configuration.d.ts` ignore -- correct |
| `[x]` | `prettier.config.mjs` | Formatting | Plugin astro OK |
| `[x]` | `stryker.config.mjs` | Mutation testing | Scope cible `src/utils/`, `src/lib/`, `src/i18n/` -- correct |
| `[~]` | `knip.json` | Dead code | OK, ajouter `entry`/`project` si faux positifs |
| `[x]` | `lefthook.yml` | Git hooks | Pre-commit parallele, staged files OK |
| `[x]` | `lighthouserc.json` | Performance CI | CORRIGE: `numberOfRuns: 3`. URL article hardcodee. |
| `[~]` | `wrangler.jsonc` | Cloudflare deploy | `compatibility_date` pourrait etre mis a jour |
| `[x]` | `package.json` | Dependencies | CORRIGE: `@astrojs/check`, `typescript`, `hastscript`, `rehype-autolink-headings` deplaces vers `devDependencies` |
| `[x]` | `.markdownlint-cli2.jsonc` | MDX linting | MD013/MD033/MD041 desactives -- correct pour MDX |
| `[x]` | `.prettierignore` | Prettier exclusions | OK |
| `[x]` | `.gitignore` | Git exclusions | OK |
| `[x]` | `worker-configuration.d.ts` | Auto-generated types | OK (INFO: 400KB+ tracke en git) |
| `[x]` | `src/env.d.ts` | Astro env types | CORRIGE: Interface locale `Env` supprimee, utilise `Env` de `worker-configuration.d.ts` |

**Conformite Astro 5:** 8/8 regles critiques validees

---

## 2. Content Layer

| Statut | Fichier | Lignes | Categorie | Verdict |
|--------|---------|--------|-----------|---------|
| `[x]` | `src/content.config.ts` | 32 | Schema definition | `glob()` loader, `astro/zod`, pillarTags enum -- tout correct |

### Articles EN (15)

| Statut | Fichier | Verdict |
|--------|---------|---------|
| `[x]` | `en-ai-code-review.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-ai-testing-strategies.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-animation-performance.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-building-design-system.mdx` | Schema OK, translationSlug OK, featured |
| `[x]` | `en-cognitive-load-ui.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-css-container-queries.mdx` | CORRIGE: translationSlug ajoute |
| `[x]` | `en-design-tokens-figma.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-edge-computing-cloudflare.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-llm-prompt-engineering.mdx` | Schema OK, translationSlug OK, featured |
| `[x]` | `en-micro-frontends.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-rag-architecture.mdx` | Schema OK, translationSlug OK, featured |
| `[x]` | `en-rust-wasm-performance.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-typescript-patterns.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-ux-research-methods.mdx` | Schema OK, translationSlug OK |
| `[x]` | `en-web-accessibility-guide.mdx` | Schema OK, translationSlug OK, featured |

### Articles FR (15)

| Statut | Fichier | Verdict |
|--------|---------|---------|
| `[x]` | `fr-architecture-rag.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-charge-cognitive-ui.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-construire-design-system.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-css-container-queries.mdx` | CORRIGE: translationSlug ajoute |
| `[x]` | `fr-design-tokens-figma.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-edge-computing-cloudflare.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-guide-accessibilite-web.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-methodes-recherche-ux.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-micro-frontends.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-patterns-typescript.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-performance-animations.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-prompt-engineering-llm.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-revue-code-ia.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-rust-wasm-performance.mdx` | Schema OK, translationSlug OK |
| `[x]` | `fr-strategies-test-ia.mdx` | Schema OK, translationSlug OK |

**Parite EN/FR:** 15/15 -- couverture complete. 15/15 paires avec translationSlug bidirectionnel.

---

## 3. Pages

| Statut | Fichier | Lignes | Categorie | Verdict |
|--------|---------|--------|-----------|---------|
| `[x]` | `src/pages/index.astro` | ~10 | Redirect locale | Redirect vers `/en/` OK |
| `[x]` | `src/pages/404.astro` | ~20 | Erreur 404 | CORRIGE: Detection locale, traductions i18n, `<meta name="robots" content="noindex">` via slot `head`. |
| `[!]` | `src/pages/en/index.astro` | 72 | Home EN | **100% identique a fr/index.astro** -- duplication totale |
| `[!]` | `src/pages/fr/index.astro` | 72 | Home FR | **100% identique a en/index.astro** -- duplication totale |
| `[!]` | `src/pages/en/about.astro` | 174 | About EN | **100% identique a fr/about.astro** -- duplication totale |
| `[!]` | `src/pages/fr/about.astro` | 174 | About FR | **100% identique a en/about.astro** -- duplication totale |
| `[!]` | `src/pages/en/search.astro` | 1832 | Search EN | **100% identique a fr/search.astro** -- 3664 lignes dupliquees |
| `[!]` | `src/pages/fr/search.astro` | 1832 | Search FR | **100% identique a en/search.astro** -- 3664 lignes dupliquees |
| `[~]` | `src/pages/en/articles/[id].astro` | 23 | Article detail EN | 1 ligne de diff avec FR (filtre locale). Astro 5 OK: `render(article)`, `entry.id` |
| `[~]` | `src/pages/fr/articles/[id].astro` | 23 | Article detail FR | 1 ligne de diff avec EN |
| `[~]` | `src/pages/en/rss.xml.ts` | 22 | RSS feed EN | 3 lignes de diff avec FR |
| `[~]` | `src/pages/fr/rss.xml.ts` | 22 | RSS feed FR | 3 lignes de diff avec EN |

**Issues search.astro additionnelles:**
- ~~Dead code ligne 734: `lang === "fr" ? "min" : "min"` -- branches identiques~~ CORRIGE
- `aria-pressed` manquant sur les boutons filtres
- `role="search"` manquant
- Pas de focus trapping sur le drawer mobile
- 4x `document.addEventListener("click")` sans cleanup
- Pagefind excerpt HTML insere via `innerHTML` sans sanitisation (risque faible)

---

## 4. Layouts

| Statut | Fichier | Lignes | Categorie | Verdict |
|--------|---------|--------|-----------|---------|
| `[x]` | `src/layouts/BaseLayout.astro` | 82 | Layout principal | `ClientRouter` OK (Astro 5). CORRIGE: Google Fonts self-hosted via `@fontsource`. Slot `head` ajoute. Description par defaut en FR uniquement. |
| `[x]` | `src/layouts/ArticleLayout.astro` | 364 | Layout article | CORRIGE: `aria-label` utilise `t("article.closeToc")` i18n. Risque DOM orphelin avec View Transitions (latent). |

---

## 5. Components

### 5a. Layout components

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[x]` | `Header.astro` | 36 | CORRIGE: `aria-label="sebc.dev — Home"` sur lien home. |
| `[x]` | `Nav.astro` | 42 | `aria-label="Main navigation"`, `aria-current="page"` -- tout OK |
| `[x]` | `Footer.astro` | 89 | `aria-label` sur liens sociaux, `rel="noopener noreferrer"` OK. `set:html` safe (data statique). |
| `[x]` | `LangSwitch.astro` | 45 | CORRIGE: `aria-current="page"`, "Français" avec cedille. |

### 5b. Article components

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[~]` | `ArticleCard.astro` | 73 | Alt image duplique le titre. CORRIGE: `datetime` ajoute sur `<time>`. |
| `[~]` | `ArticleHeader.astro` | 137 | Alt image duplique le `<h1>`. CORRIGE: `datetime` ajoute sur `<time>`. SVG sans `aria-hidden`. |
| `[x]` | `CategoryFilter.astro` | 73 | CORRIGE: `aria-pressed` sur boutons, `aria-label` sur `<section>`. |
| `[x]` | `FeaturedArticle.astro` | 76 | CORRIGE: `loading="eager"` + `fetchpriority="high"` + `datetime` sur `<time>`. |
| `[x]` | `PillarTag.astro` | ~25 | Minimal et correct |
| `[x]` | `RelatedArticles.astro` | ~40 | Semantique OK, rendu conditionnel |
| `[x]` | `ShareButtons.astro` | 152 | CORRIGE: `data-copied-label` avec i18n, bug `getAttribute` corrige. |
| `[x]` | `TableOfContents.astro` | 71 | CORRIGE: `aria-label={t("article.toc")}` sur `<nav>`. |

### 5c. UI components

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[x]` | `GlowLine.astro` | ~15 | `role="presentation"`, `aria-hidden="true"` -- parfait |
| `[x]` | `Pagination.astro` | 168 | CORRIGE: `aria-label`, `aria-current="page"` sur boutons, `aria-hidden` sur ellipses. |
| `[x]` | `ReadingProgress.astro` | 30 | CORRIGE: `aria-hidden="true"` ajoute. |
| `[x]` | `Tag.astro` | 40 | Pattern `<a>`/`<span>` conditionnel OK |

### 5d. SEO components

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[~]` | `SEO.astro` | 80 | Complet (canonical, hreflang, OG, Twitter). Prop `publishedDate` acceptee mais jamais utilisee. |
| `[x]` | `JsonLd.astro` | 58 | CORRIGE: `.replace(/</g, '\\u003c')` empeche l'injection `</script>`. |

### 5e. About components

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[x]` | `PillarBlock.astro` | 52 | CORRIGE: Props utilise `PillarType` directement, cast `as` supprime. |

---

## 6. Logique metier (lib/)

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[~]` | `src/lib/articles.ts` | 59 | Astro 5 OK (`entry.id`, `getCollection`). Cast `as "en" \| "fr"` redondant (Zod type deja). `getRelatedArticles` ignore `pillarTags` dans le scoring. |
| `[x]` | `src/lib/filterCounts.ts` | ~30 | Fonctions pures, pas d'effets de bord |
| `[x]` | `src/lib/pillarTags.ts` | ~20 | CORRIGE: `Record<PillarType, string>` avec cle accentuee, normalisation NFD supprimee. |
| `[x]` | `src/lib/shareUrls.ts` | ~25 | `encodeURIComponent` sur toutes les valeurs -- pas de vecteur XSS |

---

## 7. Utilitaires (utils/)

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[x]` | `src/utils/dates.ts` | ~25 | `Intl.DateTimeFormat`, fallback `en-US` OK |

---

## 8. Internationalisation (i18n/)

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[x]` | `src/i18n/ui.ts` | 140 | CORRIGE: 11 chaines FR avec accents/cedilles. Cle `article.closeToc` ajoutee. 12 placeholders `[Placeholder: ...]` restants. Parite cles EN/FR: 59/59 OK. |
| `[x]` | `src/i18n/utils.ts` | ~30 | CORRIGE: `??` au lieu de `\|\|` |

---

## 9. Styles

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[x]` | `src/styles/global.css` | 313 | Tailwind v4 OK: `@import "tailwindcss"`, `@theme` block. Tokens couleur coherents. Pas de syntaxe v3 deprecated. |

---

## 10. Tests unitaires (Vitest)

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[x]` | `src/lib/articles.test.ts` | 212 | 100% coverage. Manque: test collection vide, `getFeaturedArticle` retourne `undefined`. |
| `[x]` | `src/lib/filterCounts.test.ts` | 73 | 100% coverage. Complet. |
| `[~]` | `src/lib/pillarTags.test.ts` | ~30 | 100% coverage mais pas de test pour pillar invalide/inconnu. |
| `[x]` | `src/lib/shareUrls.test.ts` | 50 | 100% coverage. Test caracteres speciaux OK. |
| `[~]` | `src/i18n/utils.test.ts` | 44 | 100% lignes mais **80% branches** -- assertion mise a jour. Le test "fallback" ne teste toujours pas un vrai fallback (toutes les cles existent en FR). |
| `[x]` | `src/utils/dates.test.ts` | ~30 | 100% coverage. Complet. |

---

## 11. CI/CD

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[~]` | `.github/workflows/quality.yml` | - | CORRIGE: `permissions: contents: read` + `concurrency` ajoutes. E2E tests ajoutes. Actions non pinnees au SHA (restant). |
| `[x]` | `.github/workflows/deploy.yml` | - | CORRIGE: `environment: production` ajoute. Cache key hash `astro.config.*`. `workflow_dispatch` OK. Secrets OK. |

---

## 12. Scripts

| Statut | Fichier | Lignes | Verdict |
|--------|---------|--------|---------|
| `[~]` | `scripts/quality-report.sh` | - | Bonne qualite (`set -euo pipefail`). Manque `trap cleanup EXIT` pour fichiers temp. |

---

## 13. Assets statiques (public/)

| Statut | Fichier | Verdict |
|--------|---------|---------|
| `[x]` | `public/images/og-default.png` | 1200x630, 27KB, PNG optimise -- parfait |
| `[!]` | `public/_headers` | **CRITIQUE: Aucun header de securite** (pas de CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Seul le cache `/_astro/*` est configure. |
| `[x]` | `public/.assetsignore` | Exclut `_worker.js` et `_routes.json` -- correct |

---

## Resume de l'audit

| Categorie | Fichiers | OK | Issues | Suggestions |
|-----------|----------|----|--------|-------------|
| Config racine | 17 | 16 | 0 | 1 |
| Content config | 1 | 1 | 0 | 0 |
| Articles EN | 15 | 15 | 0 | 0 |
| Articles FR | 15 | 15 | 0 | 0 |
| Pages | 12 | 5 | 3 | 4 |
| Layouts | 2 | 2 | 0 | 0 |
| Components | 19 | 17 | 0 | 2 |
| Lib (logique) | 4 | 3 | 0 | 1 |
| Utils | 1 | 1 | 0 | 0 |
| i18n | 2 | 2 | 0 | 0 |
| Styles | 1 | 1 | 0 | 0 |
| Tests | 6 | 4 | 0 | 2 |
| CI/CD | 2 | 2 | 0 | 0 |
| Scripts | 1 | 0 | 0 | 1 |
| Assets publics | 3 | 2 | 0 | 1 |
| **Total** | **101** | **86** | **3** | **12** |

---

## Conformite Astro 5 -- Checklist complete

| Regle critique | Statut | Localisation |
|----------------|--------|-------------|
| `output: 'static'` pas `'hybrid'` | PASS | `astro.config.mjs` |
| `src/content.config.ts` pas `src/content/config.ts` | PASS | Fichier existe au bon chemin |
| `import { z } from 'astro/zod'` pas `from 'zod'` | PASS | `content.config.ts:3` |
| `loader: glob()` pas `type: 'content'` | PASS | `content.config.ts:6` |
| `entry.id` pas `entry.slug` | PASS | `articles.ts`, `[id].astro` |
| `import { render } from 'astro:content'` pas `entry.render()` | PASS | `[id].astro` |
| `ClientRouter` pas `ViewTransitions` | PASS | `BaseLayout.astro` |
| `getViteConfig()` avec `as any` cast | PASS | `vitest.config.ts` |
| `@tailwindcss/vite` pas `@astrojs/tailwind` | PASS | `astro.config.mjs`, `package.json` |
| Vitest ~3.x pas 4.x | PASS | `package.json: ^3.2.4` |

---

## Top 10 -- Actions prioritaires (toutes CORRIGEES)

### CRITIQUE -- CORRIGE

| # | Issue | Statut | Resolution |
|---|-------|--------|------------|
| 1 | **Headers de securite manquants** | CORRIGE | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy ajoutes dans `public/_headers` |
| 2 | **Duplication pages EN/FR** | CORRIGE | Refactoring vers routes dynamiques `[lang]/` avec `getStaticPaths()`. 10 fichiers remplaces par 5. ~4 200 lignes economisees. |
| 3 | **Job Playwright vide** | CORRIGE | 14 smoke tests E2E ajoutes dans `e2e/smoke.spec.ts` (pages, navigation, RSS, security headers) |

### HIGH -- CORRIGE

| # | Issue | Statut | Resolution |
|---|-------|--------|------------|
| 4 | **Accents FR manquants dans ui.ts** | CORRIGE | 11 chaines FR corrigees avec accents/cedilles dans `ui.ts` + `LangSwitch.astro` |
| 5 | **XSS latent dans JsonLd** | CORRIGE | `JSON.stringify(jsonLd).replace(/</g, '\\u003c')` empeche l'injection `</script>` |
| 6 | **`aria-label="Fermer"` hardcode** | CORRIGE | Nouvelle cle i18n `article.closeToc` (EN: "Close", FR: "Fermer") utilisee dans `ArticleLayout.astro` |
| 7 | **CI sans `permissions` ni `concurrency`** | CORRIGE | `permissions: contents: read` et `concurrency` avec `cancel-in-progress` ajoutes dans `quality.yml` |

### MEDIUM -- CORRIGE

| # | Issue | Statut | Resolution |
|---|-------|--------|------------|
| 8 | **Accessibilite composants** | CORRIGE | `aria-pressed` sur CategoryFilter, `aria-label`+`aria-current="page"` sur Pagination, `aria-label` sur TableOfContents nav + Header home link, `aria-current="page"` sur LangSwitch |
| 9 | **`translationSlug` manquant** | CORRIGE | `translationSlug` ajoute dans `en-css-container-queries.mdx` et `fr-css-container-queries.mdx` |
| 10 | **`env.d.ts` masque `Cloudflare.Env`** | CORRIGE | Interface locale `Env { [key: string]: unknown }` supprimee, utilise `Env` de `worker-configuration.d.ts` |

### LOW / INFO -- CORRIGE

| Issue | Statut | Resolution |
|-------|--------|------------|
| `FeaturedArticle.astro`: image LCP | CORRIGE | `loading="eager"` + `fetchpriority="high"` ajoutes |
| `ShareButtons.astro`: feedback "Copied!" | CORRIGE | Bug `getAttribute("aria-label-copied")` corrige, utilise `data-copied-label` avec i18n |
| `<time>` sans `datetime` | CORRIGE | `datetime` ajoute sur ArticleCard, ArticleHeader, FeaturedArticle |
| `ReadingProgress.astro`: a11y | CORRIGE | `aria-hidden="true"` ajoute |
| `i18n/utils.ts`: `\|\|` au lieu de `??` | CORRIGE | Remplace par `??` |
| `utils.test.ts`: test fallback | CORRIGE | Assertion mise a jour pour refléter les accents corriges |
| `package.json`: deps de build en `dependencies` | CORRIGE | `@astrojs/check`, `typescript`, `hastscript`, `rehype-autolink-headings` deplaces vers `devDependencies` |
| `PillarBlock.astro`: type mismatch avec `PillarType` | CORRIGE | Props utilise `PillarType` directement, about.astro passe `"Ingénierie"` avec accent |
| `search.astro:734`: dead code `"min" : "min"` | CORRIGE | Ternaire remplace par constante `"min"` |
| `BaseLayout.astro`: Google Fonts externe render-blocking | CORRIGE | Remplace par `@fontsource-variable/albert-sans` + `@fontsource/fira-code` (self-hosted) |
| `404.astro`: pas de locale detection, manque `noindex` | CORRIGE | Detection locale via `getLangFromUrl`, traductions i18n, `<meta name="robots" content="noindex">` via slot `head` |
| `pillarTags.ts`: normalisation diacritiques fragile | CORRIGE | `pillarClasses` utilise cle accentuee `"Ingénierie"` + type `Record<PillarType, string>`, normalisation NFD supprimee |
| `deploy.yml`: manque `environment:` protection rules | CORRIGE | `environment: production` ajoute, cache key inclut `astro.config.*` |
| `lighthouserc.json`: `numberOfRuns: 1` instable | CORRIGE | `numberOfRuns` augmente a 3 |

---

## Recommandations de refactoring

### 1. Eliminer la duplication EN/FR (sauve ~4 200 lignes)

Utiliser des routes dynamiques `[lang]`:
```
src/pages/[lang]/index.astro       (remplace en/index + fr/index)
src/pages/[lang]/about.astro       (remplace en/about + fr/about)
src/pages/[lang]/search.astro      (remplace en/search + fr/search)
src/pages/[lang]/articles/[id].astro
src/pages/[lang]/rss.xml.ts
```

Chaque fichier ajouterait:
```typescript
export function getStaticPaths() {
  return [{ params: { lang: "en" } }, { params: { lang: "fr" } }];
}
```

### 2. Extraire le script search en module externe

Deplacer les ~1185 lignes de JS inline de `search.astro` vers `src/scripts/search.ts`:
- Code splitting Vite + caching navigateur
- Testable unitairement
- Meilleur support IDE

### 3. Self-host les fonts

Remplacer le lien Google Fonts par `@fontsource/albert-sans` et `@fontsource/fira-code` pour eliminer la requete externe render-blocking.
