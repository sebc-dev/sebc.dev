# sebc.dev

## What This Is

Blog technique personnel pour Negus Salomon, construit avec Astro 5 + Cloudflare Pages. Un laboratoire d'apprentissage "learn in public" couvrant l'intersection IA x Ingenierie logicielle x UX. Bilingue FR/EN, dark theme premium, 4 pages (Accueil, Article, Recherche, A propos). Sert aussi de projet pilote pour valider le workflow technique avant le premier client agence.

## Core Value

Le site doit incarner les valeurs defendues — UX soignee, performance, qualite de conception — tout en permettant une publication reguliere d'articles (1/semaine). Le medium est le message.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Astro 5.17.1 + Cloudflare Pages setup complet — initial setup
- ✓ i18n routing EN (default) + FR avec prefix all locales — initial setup
- ✓ Content Collection MDX avec schema Zod (articles: title, date, category, tags, pillarTags, lang, translationSlug, series, image) — initial setup
- ✓ BaseLayout avec global styles et font loading (Albert Sans, Fira Code) — initial setup
- ✓ Dark theme teal accent (#0D9488) avec design tokens complets (surfaces, texte, bordures) — initial setup
- ✓ Build pipeline (wrangler types → astro check → astro build → pagefind) — initial setup
- ✓ Testing infrastructure: Vitest ~3.x, Playwright, Stryker — initial setup
- ✓ Linting: ESLint 9 + Prettier + markdownlint — initial setup
- ✓ Pre-commit hooks (lefthook) — initial setup
- ✓ Sitemap generation (@astrojs/sitemap) — initial setup
- ✓ Lighthouse CI (performance, accessibility, SEO ≥ 0.9) — initial setup
- ✓ Root redirect / → /en/ — initial setup

### Active

<!-- Current scope. Building toward these. -->

- [ ] Page Accueil : article featured, grille d'articles avec cards (image, metadata, tags), filtres categories, pagination
- [ ] Page Article : rendu MDX complet, TOC sidebar, progress bar lecture, boutons partage (Twitter/X, LinkedIn, dev.to, copier lien), articles lies, metadata (date, temps lecture, categorie, tags)
- [ ] Page Recherche : recherche full-text Pagefind, filtres sidebar (categories, tags, temps lecture, date), vue grille + liste, autocomplete tags, filtres pre-appliques depuis liens
- [ ] Page A propos : presentation personnelle (design a revoir — ne pas utiliser le mockup about.html tel quel)
- [ ] Header sticky : navigation (Accueil, Recherche, A propos), logo >_, switch langue FR/EN, backdrop blur
- [ ] Footer : logo, description, liens sociaux (GitHub, Twitter/X, LinkedIn, RSS), glow-line, copyright
- [ ] Composants partages : ArticleCard (grille + liste), Tag/Badge (3 variantes), boutons (CTA, filtre, secondaire), Input
- [ ] Animations : fade-up au scroll (IntersectionObserver), stagger delays, section-title underline anime, hover patterns cards
- [ ] SEO : meta tags, Open Graph, structured data articles
- [ ] Cloudflare Analytics : integration script analytics natif
- [ ] Responsive : mobile-first, breakpoints sm/md/lg, design adapte 375px → 1280px+

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Newsletter/abonnement email — pas de backend email pour v1, se concentrer sur le contenu
- Systeme de commentaires (Giscus) — a explorer en v2 une fois l'audience etablie
- OAuth / authentification — site statique sans espace membre
- Light theme — dark-first est le design, pas de toggle prevu
- Plausible Analytics — Cloudflare Analytics suffit pour commencer
- Application mobile — web-first, responsive suffit
- Video posts — complexite stockage/bande passante disproportionnee
- RSS feed avance — sitemap couvre le referencement, RSS simple si le temps le permet

## Context

### Projet pilote agence

Ce blog est le premier projet complet utilisant le workflow Astro + Cloudflare. Les patterns valides ici seront reutilises pour les clients TPE/PME de l'agence. La qualite du resultat sert de carte de visite technique.

### Design research

Recherche design complete dans `docs/design-research/` :
- `design-report.md` : rapport design exhaustif (tokens, typo, couleurs, composants, animations, layouts, guide implementation)
- `home.html` : mockup page accueil (v8 finale)
- `article.html` : mockup page article (v2 finale)
- `recherche.html` : mockup page recherche (v1 finale)
- `about.html` : mockup page a propos (v1 — **a revoir**, ne pas implementer tel quel)

### Direction design : "Minimal Depth"

- 5 niveaux de surface (void → canvas → surface → raised → hover)
- Teal strategique : accent unique pour interactions et navigation
- Typographie Albert Sans (display/body) + Fira Code (code/tags)
- Espace genereux, line-height 1.7, max-w-6xl
- Animations subtiles : fade-up au scroll, hover teal glow, progress bar

### Taxonomie

- **Pillar tags** : IA, Ingenierie, UX (intersection thematique)
- **Categories** : emergeront naturellement avec les articles
- Pas de taxonomie rigide prealable

### Cible

Developpeur mid-level en phase d'adaptation a l'evolution du metier par l'IA. Profil miroir du createur.

## Constraints

- **Timeline** : 1 semaine — scope ambitieux compense par utilisation intensive d'IA et absence d'allers-retours client
- **Stack** : Astro 5 + Cloudflare Pages — non negociable, c'est la stack agence
- **Performance** : Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1), Lighthouse ≥ 90
- **i18n** : FR + EN obligatoire, tous les articles traduits, URLs propres (/fr/..., /en/...)
- **Contenu** : Zero article au lancement — le site est la coquille, le contenu vient apres
- **Design About** : Le mockup about.html doit etre repense avant implementation

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro 5 + Cloudflare | Stack agence, performances natives SSG, couts maitrises | ✓ Good |
| Tailwind CSS v4 via @tailwindcss/vite | Integration directe Vite, pas de plugin Astro deprecated | ✓ Good |
| Dark-first (pas de light theme) | Choix design delibere, "Minimal Depth" | ✓ Good |
| Pillar tags seulement (IA, Ingenierie, UX) | Categories emergentes, pas de taxonomie rigide | — Pending |
| Cloudflare Analytics seul | Zero config, gratuit, suffisant pour debut | — Pending |
| Pagefind pour recherche | Client-side, zero JS au repos, genere au build | ✓ Good |
| MDX pour contenu | Composants interactifs dans les articles | ✓ Good |
| Page About a revoir | Design mockup v1 insatisfaisant | — Pending |

---
*Last updated: 2026-02-09 after initialization*
