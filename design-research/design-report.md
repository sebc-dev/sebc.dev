# DevBlog — Rapport Design Complet

**Projet** : Blog Technique Developpeur
**Direction creative** : Minimal Depth
**Date** : Fevrier 2026
**Version** : 1.1 (Astro)

---

## Table des matieres

1. [Vision & Direction Artistique](#1-vision--direction-artistique)
2. [Design Tokens](#2-design-tokens)
3. [Typographie](#3-typographie)
4. [Systeme de couleurs](#4-systeme-de-couleurs)
5. [Composants reutilisables](#5-composants-reutilisables)
6. [Animations & Interactions](#6-animations--interactions)
7. [Layouts & Grilles](#7-layouts--grilles)
8. [Inventaire des pages](#8-inventaire-des-pages)
9. [Guide d'implementation (Astro)](#9-guide-dimplementation-astro)

---

## 1. Vision & Direction Artistique

### Concept : "Minimal Depth"

Minimalisme profond avec des layers de gris et des touches de couleur strategiques.
L'idee est de creer une profondeur visuelle via des niveaux de surfaces empiles,
sans jamais surcharger l'interface.

### Principes fondamentaux

- **Hierarchie par surface** : 5 niveaux de profondeur (void → canvas → surface → surface-raised → surface-hover)
- **Couleur strategique** : le teal (#0D9488) est utilise uniquement pour les accents, les interactions et la navigation
- **Typographie claire** : 2 familles complementaires, hierarchie stricte
- **Espace genereux** : line-height 1.7, padding large, sections bien separees
- **Dark-first** : le dark theme est la base, pas un mode secondaire

### Mood

Moderne & Dynamique — Espace technologique calme, focus sur le contenu,
sophistication premium sans austerite. Le visiteur doit ressentir la competence
technique sans etre intimide.

### Inspirations

| Reference | Ce qu'on en retient |
|-----------|-------------------|
| Josh Comeau (joshwcomeau.com) | Micro-interactions, dark mode parfait, pedagogie |
| Dan Abramov / Overreacted | Minimalisme, focus contenu |
| Tania Rascia | Bio concise, projets comme preuve sociale |
| Sara Soueidan | Structure narrative progressive |

---

## 2. Design Tokens

### Configuration Tailwind v4

Tous les tokens sont definis dans `<style type="text/tailwindcss">` via `@theme {}`.
Chaque page HTML reprend exactement le meme bloc de tokens.

```css
@theme {
  /* ---- SURFACES (du plus profond au plus eleve) ---- */
  --color-void: #111111;            /* Code blocks, elements les plus profonds */
  --color-canvas: #181818;          /* Background principal du body */
  --color-surface: #232323;         /* Cards, sidebar, elements secondaires */
  --color-surface-raised: #2d2d2d;  /* Elements sureleves (dropdown, tooltip) */
  --color-surface-hover: #383838;   /* Hover state des surfaces */

  /* ---- TEXTE (3 niveaux de hierarchie) ---- */
  --color-text-primary: #e6e6e6;    /* Titres, contenu principal */
  --color-text-secondary: #a0a0a0;  /* Descriptions, paragraphes */
  --color-text-muted: #6b6b6b;      /* Labels, dates, metadata */

  /* ---- ACCENT TEAL (couleur principale) ---- */
  --color-teal: #0D9488;            /* Etat par defaut, bordures actives */
  --color-teal-hover: #14B8A6;      /* Hover sur elements teal */
  --color-teal-bright: #2DD4BF;     /* Liens actifs, hovers, highlights */
  --color-teal-glow: #0D948833;     /* Box-shadow glow (20% opacity) */
  --color-teal-dim: #0D94881a;      /* Background subtil (10% opacity) */

  /* ---- BORDURES (2 niveaux) ---- */
  --color-border: #2a2a2a;          /* Bordures standard des cards, inputs */
  --color-border-subtle: #202020;   /* Bordures subtiles (header, separateurs) */
  --color-border-hover: #0D9488;    /* Bordure au hover (= teal) */

  /* ---- TYPOGRAPHIE ---- */
  --font-display: "Albert Sans", system-ui, sans-serif;
  --font-body: "Albert Sans", system-ui, sans-serif;
  --font-code: "Fira Code", ui-monospace, monospace;
}
```

### Hierarchie des surfaces

```
Niveau 0  void          #111111   Code blocks, footer deep
Niveau 1  canvas        #181818   Body background (base)
Niveau 2  surface       #232323   Cards, panels
Niveau 3  surface-raised #2d2d2d  Dropdowns, tooltips, suggestions
Niveau 4  surface-hover  #383838  Hover des surfaces
```

Chaque niveau ajoute environ `+0B` en luminosite pour creer une elevation subtile.
La profondeur est communiquee par la couleur de fond, pas par des ombres lourdes.

---

## 3. Typographie

### Polices

| Police | Usage | Poids | Fallback |
|--------|-------|-------|----------|
| Albert Sans | Titres, corps, UI | 300, 400, 600, 700 | system-ui, sans-serif |
| Fira Code | Code, tags, metadata technique | 400, 500 | ui-monospace, monospace |

### Chargement Google Fonts

```html
<!-- OBLIGATOIRE : preconnect AVANT le stylesheet -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
```

### Echelle typographique

| Element | Font | Poids | Taille | Line-height | Couleur |
|---------|------|-------|--------|-------------|---------|
| H1 (Hero) | Albert Sans | 700 | 30→48px | 1.15 | text-primary |
| H1 (Page) | Albert Sans | 700 | 24→40px | 1.15 | text-primary |
| H2 (Section) | Albert Sans | 700 | 24→32px | 1.3 | text-primary |
| H3 (Sous-section) | Albert Sans | 600 | 18→24px | 1.4 | text-primary |
| Body | Albert Sans | 400 | 16px | 1.7 | text-secondary |
| Body large | Albert Sans | 400 | 18→20px | 1.7 | text-secondary |
| Caption/Label | Albert Sans | 400 | 14px | 1.5 | text-muted |
| Small/Metadata | Albert Sans | 400 | 12px | 1.5 | text-muted |
| Code inline | Fira Code | 400 | 14→15px | 1.6 | teal-bright |
| Code block | Fira Code | 400 | 14px | 1.6 | text-primary |
| Tags/Badges | Fira Code | 400 | 12px | 1 | text-secondary |

### Regles

- `letter-spacing: -0.02em` sur les titres H1 en hero
- `tracking-tight` sur le logo "devblog"
- `tracking-wider` + `uppercase` sur les labels de section dans la sidebar
- `line-height: 1.7` sur le body globalement
- Les titres H2 de section utilisent parfois un underline teal anime (classe `.section-title`)

---

## 4. Systeme de couleurs

### Palette principale

```
SURFACES
#111111  ██  void
#181818  ██  canvas (body)
#232323  ██  surface
#2d2d2d  ██  surface-raised
#383838  ██  surface-hover

TEXTE
#e6e6e6  ██  text-primary
#a0a0a0  ██  text-secondary
#6b6b6b  ██  text-muted

TEAL (accent)
#0D9488  ██  teal (base)
#14B8A6  ██  teal-hover
#2DD4BF  ██  teal-bright (liens, highlights)

BORDURES
#2a2a2a  ██  border
#202020  ██  border-subtle
```

### Utilisations du teal

| Contexte | Variante | Exemple |
|----------|----------|---------|
| Bordure active | teal (`#0D9488`) | Filtres actifs, input focus |
| Lien hover | teal-bright (`#2DD4BF`) | Navigation, titres cards |
| Background subtil | teal-dim (`#0D94881a`) | Bouton actif, badges |
| Box-shadow glow | teal-glow (`#0D948833`) | Hover cards (ombre), tech items |
| Bordure hover | teal/30 | Cards, timeline items |
| Badge/Tag actif | bg-teal-dim + text-teal-bright + border-teal/20 | Filtres, tags selectionnes |
| CTA principal | bg-teal + hover:bg-teal-hover | Bouton "S'abonner" |
| Icones | text-teal | Lucide icons dans sections |

### La "glow-line"

Separateur signature du design — une ligne de 1px avec un gradient teal transparent :

```css
.glow-line {
  background: linear-gradient(90deg, transparent, #0D948860, transparent);
  height: 1px;
}
```

Utilisee en haut de page (sous le header) et dans le footer.

---

## 5. Composants reutilisables

### 5.1 Header (sticky)

```html
<header class="sticky top-0 z-50 bg-canvas/90 backdrop-blur-lg border-b border-border-subtle">
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 group">
        <span class="w-8 h-8 bg-teal/15 border border-teal/30 rounded-xs flex items-center justify-center text-teal font-code text-sm font-medium group-hover:bg-teal/25 transition-colors">&gt;_</span>
        <span class="text-lg font-semibold tracking-tight text-text-primary">devblog</span>
      </a>
      <!-- Navigation -->
      <nav class="flex items-center gap-6 text-sm">
        <a href="/" class="text-text-primary font-medium">Accueil</a>
        <a href="/recherche" class="text-text-muted hover:text-text-primary transition-colors">Recherche</a>
        <a href="/about" class="text-text-muted hover:text-text-primary transition-colors">A propos</a>
      </nav>
      <!-- Langue -->
      <div class="flex items-center gap-1 text-sm text-text-muted">
        <button class="px-2 py-1 rounded-xs text-text-primary font-medium bg-surface">FR</button>
        <button class="px-2 py-1 rounded-xs hover:text-text-primary transition-colors">EN</button>
      </div>
    </div>
  </div>
</header>
```

**Specificites :**
- `bg-canvas/90 backdrop-blur-lg` : fond semi-transparent avec blur
- La page active a les classes `text-text-primary font-medium`
- Les pages inactives : `text-text-muted hover:text-text-primary transition-colors`
- Le logo `>_` est un carre arrondi avec fond teal subtil

### 5.2 Footer

```html
<footer class="border-t border-border">
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="w-6 h-6 bg-teal/15 border border-teal/30 rounded-xs flex items-center justify-center text-teal font-code text-xs">&gt;_</span>
          <span class="text-sm font-semibold">devblog</span>
        </div>
        <p class="text-text-muted text-sm max-w-xs">
          Exploring modern web development through thoughtful articles and experiments.
        </p>
      </div>
      <div class="flex items-center gap-5">
        <!-- Icones sociaux : GitHub, Twitter, LinkedIn, RSS -->
      </div>
    </div>
    <div class="glow-line w-full my-8"></div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-text-muted text-xs">
      <p>&copy; 2026 devblog. Tous droits reserves.</p>
      <div class="flex gap-6">
        <a href="#" class="hover:text-text-primary transition-colors">Confidentialite</a>
        <a href="#" class="hover:text-text-primary transition-colors">Mentions legales</a>
      </div>
    </div>
  </div>
</footer>
```

### 5.3 Article Card (grille)

```html
<article class="group">
  <a href="#" class="block">
    <!-- Image avec overlay et badge -->
    <div class="relative overflow-hidden rounded-xs border border-border group-hover:border-teal/30 transition-colors mb-4">
      <img src="..." alt="..." class="w-full aspect-[16/10] object-cover opacity-75 group-hover:opacity-100 transition-opacity">
      <div class="absolute inset-0 bg-linear-to-t from-canvas/40 to-transparent"></div>
      <span class="absolute top-3 left-3 text-xs font-code text-teal bg-canvas/80 backdrop-blur-sm px-2.5 py-1 rounded-xs border border-teal/20">categorie</span>
    </div>
    <!-- Metadata -->
    <div class="flex items-center gap-2 text-xs text-text-muted mb-2.5">
      <time>15 Jan 2026</time>
      <span class="w-1 h-1 rounded-full bg-text-muted"></span>
      <span>8 min</span>
    </div>
    <!-- Titre -->
    <h3 class="text-lg font-semibold leading-snug mb-2 group-hover:text-teal-bright transition-colors">
      Titre de l'article
    </h3>
    <!-- Extrait -->
    <p class="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
      Description courte...
    </p>
    <!-- Tags -->
    <div class="flex flex-wrap gap-2">
      <span class="text-xs font-code text-text-secondary px-2.5 py-1 rounded-xs border border-border">tag</span>
    </div>
  </a>
</article>
```

**Patterns d'interaction :**
- Image : `opacity-75` → `opacity-100` au hover du group
- Bordure image : `border-border` → `border-teal/30` au hover
- Titre : `text-text-primary` → `text-teal-bright` au hover
- Badge categorie : toujours visible, en haut a gauche de l'image

### 5.4 Article Card (liste)

```html
<a href="#" class="group flex gap-5 p-4 rounded-sm border border-border hover:border-teal/30 transition-colors">
  <img src="..." alt="" class="hidden sm:block w-36 h-24 object-cover rounded-xs opacity-75 group-hover:opacity-100 transition-opacity shrink-0">
  <div class="min-w-0">
    <div class="flex items-center gap-2 text-xs text-text-muted mb-1.5">
      <span class="font-code text-teal">categorie</span>
      <span class="w-1 h-1 rounded-full bg-text-muted"></span>
      <time>15 Jan 2026</time>
      <span class="w-1 h-1 rounded-full bg-text-muted"></span>
      <span>8 min</span>
    </div>
    <h3 class="text-base font-semibold leading-snug mb-1 group-hover:text-teal-bright transition-colors">Titre</h3>
    <p class="text-text-secondary text-sm leading-relaxed line-clamp-1">Description...</p>
  </div>
</a>
```

### 5.5 Tag / Badge

```html
<!-- Tag standard (inactif) -->
<span class="text-xs font-code text-text-secondary px-2.5 py-1 rounded-xs border border-border">tag</span>

<!-- Tag actif / selectionne -->
<span class="text-xs font-code text-teal-bright px-2.5 py-1 rounded-xs border border-teal/20 bg-teal-dim">tag</span>

<!-- Badge categorie (sur image) -->
<span class="text-xs font-code text-teal bg-canvas/80 backdrop-blur-sm px-2.5 py-1 rounded-xs border border-teal/20">categorie</span>
```

### 5.6 Bouton filtre

```html
<!-- Inactif -->
<button class="text-sm font-medium px-3.5 py-1.5 rounded-xs border border-border text-text-muted whitespace-nowrap transition-all hover:border-teal/40 hover:text-teal-bright">
  Label
</button>

<!-- Actif -->
<button class="text-sm font-medium px-3.5 py-1.5 rounded-xs border border-teal text-teal-bright bg-teal-dim whitespace-nowrap transition-all">
  Label
</button>
```

### 5.7 Bouton CTA

```html
<!-- Primaire (teal) -->
<button class="px-6 py-3 bg-teal hover:bg-teal-hover text-white font-medium rounded-sm transition-colors">
  S'abonner
</button>

<!-- Secondaire (outline) -->
<button class="px-6 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-sm hover:border-teal/40 hover:text-teal-bright transition-all">
  Charger plus
</button>
```

### 5.8 Input (champ de recherche / email)

```html
<input
  type="text"
  placeholder="Rechercher..."
  class="w-full px-4 py-3 bg-surface border border-border rounded-sm text-text-primary placeholder:text-text-muted focus:border-teal/50 focus:outline-hidden transition-colors"
>
```

Pour le champ de recherche principal, ajouter `focus:ring-1 focus:ring-teal/20`.

### 5.9 Code block

```html
<div class="bg-void border border-border rounded-xs overflow-hidden">
  <!-- Header du code block -->
  <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/50">
    <span class="text-xs font-code text-text-muted uppercase tracking-wider">CSS</span>
    <button class="flex items-center gap-1.5 text-xs text-text-muted hover:text-teal transition-colors">
      <!-- Icone copier --> Copier
    </button>
  </div>
  <!-- Code -->
  <pre class="p-5 overflow-x-auto text-sm leading-relaxed font-code"><code>...</code></pre>
</div>
```

**Syntax highlighting simplifie :**
- Mots-cles : `text-teal-bright`
- Noms de proprietes : `text-teal`
- Valeurs/strings : `text-text-primary`
- Commentaires : `text-text-muted`
- Ponctuation : `text-text-secondary`

### 5.10 Code inline

```html
<code class="font-code text-sm text-teal-bright bg-surface px-1.5 py-0.5 rounded-xs">@theme</code>
```

### 5.11 Blockquote

```css
/* Styles prose */
blockquote {
  border-left: 3px solid #0D9488;
  padding: 1rem 1.5rem;
  background: #23232380;
  border-radius: 0 4px 4px 0;
}
blockquote p { color: #a0a0a0; }
```

### 5.12 Section title avec underline anime

```html
<h2 class="text-2xl md:text-3xl font-bold mb-10 text-center section-title">Titre</h2>
```

```css
.section-title::after {
  content: '';
  display: block;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, #0D9488, #2DD4BF);
  margin-top: 0.5rem;
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.section-title.in-view::after {
  width: 64px;
}
```

### 5.13 Newsletter CTA

```html
<div class="bg-surface border border-border rounded-sm p-8 md:p-12 text-center max-w-2xl mx-auto">
  <h2 class="text-2xl md:text-3xl font-bold mb-4">Restons en contact</h2>
  <p class="text-text-secondary mb-8 leading-relaxed">Description...</p>
  <form class="flex flex-col sm:flex-row gap-3 mb-6">
    <input type="email" placeholder="votre@email.com"
      class="flex-1 px-4 py-3 bg-canvas border border-border rounded-sm text-text-primary placeholder:text-text-muted focus:border-teal focus:outline-hidden transition-colors" required>
    <button type="submit" class="px-6 py-3 bg-teal hover:bg-teal-hover text-white font-medium rounded-sm transition-colors">
      S'abonner
    </button>
  </form>
</div>
```

### 5.14 Icones sociaux

```html
<div class="flex items-center gap-5">
  <a href="#" class="text-text-muted hover:text-text-primary transition-colors" aria-label="GitHub">
    <!-- SVG 20x20 stroke-width="2" -->
  </a>
  <!-- Twitter, LinkedIn, RSS : meme pattern -->
</div>
```

Toutes les icones utilisent le style Lucide : `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"`.

---

## 6. Animations & Interactions

### 6.1 Fade-up (entree des sections)

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-up { opacity: 0; }
.fade-up.in-view { animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
```

Declenchement via IntersectionObserver :

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up, .section-title').forEach(el => observer.observe(el));
```

### 6.2 Stagger delays

Pour les grilles, ajouter des delais incrementaux :

```css
.fade-up-d1 { animation-delay: 0.1s; }
.fade-up-d2 { animation-delay: 0.15s; }
.fade-up-d3 { animation-delay: 0.2s; }
.fade-up-d4 { animation-delay: 0.25s; }
```

Ou directement en inline : `style="animation-delay: 0.05s"`.

### 6.3 Pulse teal (timeline)

```css
@keyframes pulse-teal {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 #0D948860; }
  50% { opacity: 0.8; box-shadow: 0 0 0 8px transparent; }
}
.timeline-dot { animation: pulse-teal 2s ease-in-out infinite; }
```

### 6.4 Bounce subtil (scroll indicator)

```css
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.scroll-indicator { animation: bounce-subtle 2s ease-in-out infinite; }
```

### 6.5 Shimmer (skeleton loading)

```css
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #232323 25%, #2d2d2d 50%, #232323 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite;
}
```

### 6.6 Transitions standards

| Element | Propriete | Duree | Easing |
|---------|-----------|-------|--------|
| Liens, couleurs | color, border-color | 200ms | ease (defaut Tailwind) |
| Cards hover | transform, box-shadow, border | 200-300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Images (opacity) | opacity | 200ms | ease |
| Sections (fade-up) | opacity, transform | 400-600ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Underline animate | width | 600ms | cubic-bezier(0.4, 0, 0.2, 1) |

### 6.7 Hover patterns

```css
/* Card avec elevation */
.tech-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px #0D948820;
}

/* Project card */
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px #0D948830;
}
```

### 6.8 Reading progress bar (page article)

```html
<div class="fixed top-0 left-0 z-[60] h-0.5 bg-teal" id="progress-bar" style="width: 0%"></div>
```

Mise a jour en JS via scroll position par rapport au contenu de l'article.

---

## 7. Layouts & Grilles

### Layout global

```
max-w-6xl mx-auto px-6 lg:px-8
```

Soit environ **1152px** de largeur max avec padding lateral de 24px (mobile) a 32px (desktop).

### Page Accueil

```
Header (sticky, full-width)
└── max-w-6xl
    ├── Featured article (md:grid-cols-[1.3fr_1fr])
    ├── Category filters (flex wrap, scroll horizontal mobile)
    ├── Articles grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3, gap-6)
    ├── Pagination (flex center)
Footer
```

### Page Article

```
Header
└── max-w-6xl
    ├── lg:grid-cols-[1fr_240px] lg:gap-12
    │   ├── Article (colonne principale)
    │   │   ├── Back link
    │   │   ├── Cover image (aspect-[2/1])
    │   │   ├── Metadata header (titre, description, date, temps)
    │   │   ├── Article body (.prose)
    │   │   └── Related articles (sm:grid-cols-2)
    │   └── Sidebar (sticky top-24, hidden <lg)
    │       ├── Reading progress
    │       ├── Table of contents (TOC)
    │       ├── Tags
    │       └── Share buttons
Footer
```

### Page Recherche

```
Header
└── max-w-6xl
    ├── Search hero (titre + input)
    ├── Active filter chips
    ├── lg:grid-cols-[260px_1fr] lg:gap-10
    │   ├── Sidebar filtres
    │   │   ├── Categories
    │   │   ├── Tags (autocomplete)
    │   │   ├── Temps de lecture
    │   │   ├── Date de publication
    │   │   └── Reset
    │   └── Results
    │       ├── Results header (count + sort + view toggle)
    │       ├── Grid view (grid-cols-1 sm:grid-cols-2)
    │       ├── List view (hidden, space-y-4)
    │       ├── Empty state (hidden)
    │       └── Load more
Footer
```

### Page A propos

```
Header
└── max-w-6xl
    ├── Hero (flex-col items-center text-center)
    │   ├── Avatar (w-32 h-32 → w-40 h-40)
    │   ├── Titre + tagline
    │   ├── Stats (flex wrap center)
    │   └── Scroll indicator
    ├── Qui je suis (md:grid-cols-[1.2fr_1fr])
    │   ├── Texte intro
    │   └── Code signature card
    ├── Parcours (timeline verticale centree, max-w-4xl)
    │   └── md:grid-cols-2 alterne gauche/droite
    ├── Stack technique
    │   ├── Frontend (grid 2→3→5 cols)
    │   ├── Backend (grid 2→3→4 cols)
    │   └── Outils (grid 2→3→4 cols)
    ├── Projets notables (md:grid-cols-2)
    │   ├── Featured (md:col-span-2, grid interne 2 cols)
    │   └── 2 projets standard
    ├── Philosophie (md:grid-cols-3)
    └── CTA Newsletter (max-w-2xl mx-auto)
Footer
```

### Breakpoints responsive

| Breakpoint | Largeur | Utilisation |
|-----------|---------|------------|
| Defaut | 0-639px | Mobile (375px cible) |
| `sm:` | 640px+ | 2 colonnes grilles |
| `md:` | 768px+ | Layouts splits, header desktop |
| `lg:` | 1024px+ | 3 colonnes, sidebars visibles |

---

## 8. Inventaire des pages

### Fichiers de reference (versions finales)

| Page | Fichier | Lignes | Description |
|------|---------|--------|-------------|
| **Accueil** | `home/v8.html` | 364 | Grille d'articles, featured article, filtres categories, pagination |
| **Article** | `article/v2.html` | 471 | Lecture avec TOC sidebar, progress bar, code blocks, related articles |
| **Recherche** | `recherche/v1.html` | 935 | Recherche full-text, filtres sidebar (categorie/tags/temps/date), vue grille+liste, autocomplete tags |
| **A propos** | `about/v1.html` | 739 | Hero, intro, timeline parcours, stack technique, projets, philosophie, newsletter |

### Arborescence du projet

```
projects/dev-blog/
├── brief.md                    # Brief client original
├── dossier/
│   └── design-report.md        # Ce rapport
├── recherche/
│   ├── about-research.md       # Recherche UX pour la page About
│   └── v1.html                 # Page Recherche
├── home/
│   ├── v1.html → v7.html       # Iterations precedentes
│   └── v8.html                 # Version finale accueil
├── article/
│   ├── v1.html                 # Premiere iteration
│   └── v2.html                 # Version finale article
└── about/
    └── v1.html                 # Version finale a propos
```

---

## 9. Guide d'implementation (Astro)

### 9.1 Stack recommandee

| Besoin | Recommandation | Justification |
|--------|---------------|---------------|
| Framework | **Astro 5+** | SSG natif, zero JS par defaut, parfait pour un blog axe contenu |
| Styling | **Tailwind CSS v4** (`@astrojs/tailwind`) | Deja utilise dans les maquettes, tokens portables |
| Contenu | **Content Collections** (Astro natif) | Schema type avec Zod, Markdown/MDX natif, pas de dependance externe |
| MDX | `@astrojs/mdx` | Composants Astro dans les articles, syntax highlighting via Shiki integre |
| Deploiement | **Vercel** ou **Cloudflare Pages** | Adaptateurs Astro officiels, builds statiques rapides |
| Search | **Pagefind** | Recherche statique generee au build, zero JS au repos, ideal pour SSG |
| Analytics | **Umami** ou **Plausible** | Privacy-first, pas de cookies |
| Comments | **Giscus** | Utilise GitHub Discussions, dark theme natif |

### 9.2 Migration des tokens

Les tokens `@theme {}` se portent directement dans Tailwind v4 :

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-void: #111111;
  --color-canvas: #181818;
  --color-surface: #232323;
  --color-surface-raised: #2d2d2d;
  --color-surface-hover: #383838;

  --color-text-primary: #e6e6e6;
  --color-text-secondary: #a0a0a0;
  --color-text-muted: #6b6b6b;

  --color-teal: #0D9488;
  --color-teal-hover: #14B8A6;
  --color-teal-bright: #2DD4BF;
  --color-teal-glow: #0D948833;
  --color-teal-dim: #0D94881a;

  --color-border: #2a2a2a;
  --color-border-subtle: #202020;
  --color-border-hover: #0D9488;

  --font-display: "Albert Sans", system-ui, sans-serif;
  --font-body: "Albert Sans", system-ui, sans-serif;
  --font-code: "Fira Code", ui-monospace, monospace;
}
```

Importer ce fichier dans le layout principal :

```astro
---
// src/layouts/Base.astro
import '../styles/global.css';
---
```

Les classes comme `bg-canvas`, `text-teal-bright`, `border-border` fonctionnent immediatement.

### 9.3 Arborescence du projet Astro

```
src/
├── content/
│   ├── config.ts              # Schema des collections (Zod)
│   └── articles/              # Fichiers .md ou .mdx
│       ├── mon-article.md
│       └── autre-article.mdx
├── layouts/
│   └── Base.astro             # Layout global (head, header, footer)
├── pages/
│   ├── index.astro            # Accueil
│   ├── about.astro            # A propos
│   ├── recherche.astro        # Recherche
│   └── articles/
│       └── [...slug].astro    # Page article dynamique
├── components/
│   ├── layout/
│   │   ├── Header.astro       # Navigation sticky
│   │   ├── Footer.astro       # Footer avec glow-line
│   │   └── GlowLine.astro     # Separateur teal
│   ├── ui/
│   │   ├── Tag.astro          # Tag/Badge (3 variantes)
│   │   ├── Button.astro       # CTA (primary, secondary)
│   │   ├── Input.astro        # Champ texte/email/search
│   │   ├── FilterButton.astro # Bouton filtre toggle
│   │   └── Pagination.astro   # Navigation pages
│   ├── article/
│   │   ├── ArticleCard.astro  # Card grille
│   │   ├── ArticleRow.astro   # Card liste
│   │   ├── ArticleHero.astro  # Featured article
│   │   ├── CodeBlock.astro    # Code avec copier
│   │   ├── TOC.astro          # Table des matieres
│   │   └── ReadingProgress.astro # Barre de progression
│   ├── about/
│   │   ├── Timeline.astro     # Timeline verticale
│   │   ├── TechGrid.astro     # Grille stack technique
│   │   ├── ProjectCard.astro  # Card projet notable
│   │   └── ValueCard.astro    # Card philosophie
│   └── shared/
│       ├── NewsletterCTA.astro # Formulaire newsletter
│       └── SocialLinks.astro  # Icones sociaux
├── scripts/
│   └── scroll-reveal.ts       # IntersectionObserver global
└── styles/
    └── global.css             # Tokens @theme + styles prose
```

### 9.4 Content Collections

Definir le schema des articles avec Zod :

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    readingTime: z.number(), // en minutes
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
```

Exemple de frontmatter d'un article :

```md
---
title: "Comprendre les CSS Container Queries"
description: "Guide pratique pour utiliser les container queries en production."
date: 2026-01-15
category: "CSS"
tags: ["css", "responsive", "container-queries"]
image: "/images/articles/container-queries.jpg"
readingTime: 8
featured: true
---

Contenu de l'article en Markdown...
```

Requeter les articles dans une page :

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import ArticleCard from '../components/article/ArticleCard.astro';

const articles = (await getCollection('articles', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const featured = articles.find(a => a.data.featured);
const recent = articles.filter(a => a !== featured).slice(0, 6);
---

<Base title="Accueil">
  <!-- Featured + grille d'articles -->
</Base>
```

### 9.5 Page article dynamique

```astro
---
// src/pages/articles/[...slug].astro
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import TOC from '../../components/article/TOC.astro';
import ReadingProgress from '../../components/article/ReadingProgress.astro';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map(article => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content, headings } = await article.render();
---

<Base title={article.data.title}>
  <ReadingProgress />
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
      <article class="prose">
        <Content />
      </article>
      <aside class="hidden lg:block">
        <TOC headings={headings} />
      </aside>
    </div>
  </div>
</Base>
```

Astro fournit nativement les `headings` extraits du Markdown — pas besoin de parser le DOM cote client pour construire la table des matieres.

### 9.6 Animations en production

Astro genere du HTML statique sans JS par defaut. Les animations au scroll s'ajoutent via un script inline ou un fichier `.ts` charge dans le layout :

```astro
<!-- Dans Base.astro ou en bas de page -->
<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up, .section-title').forEach(el => observer.observe(el));
</script>
```

Pour un composant reutilisable avec delay configurable :

```astro
---
// src/components/shared/ScrollReveal.astro
interface Props {
  delay?: number;
  class?: string;
}
const { delay = 0, class: className = '' } = Astro.props;
---

<div class:list={['fade-up', className]} style={delay ? `animation-delay: ${delay}s` : undefined}>
  <slot />
</div>
```

Usage :

```astro
<ScrollReveal>
  <h2 class="section-title">Titre</h2>
</ScrollReveal>

<ScrollReveal delay={0.1}>
  <ArticleCard article={article} />
</ScrollReveal>
```

Le `<script>` d'observation dans `Base.astro` s'applique a tous les `.fade-up` de la page. L'avantage Astro : le script est deduplique automatiquement meme si le composant est utilise plusieurs fois.

### 9.7 Syntax highlighting

Astro integre **Shiki** nativement. Configurer le theme dans `astro.config.mjs` :

```js
// astro.config.mjs
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default', // theme sombre coherent avec le design
      wrap: true,
    },
  },
});
```

Pour personnaliser les couleurs du code block afin de coller au design system, surcharger les styles Shiki dans `global.css` :

```css
/* Code blocks generes par Shiki */
pre.astro-code {
  background: var(--color-void) !important;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1.25rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
}
```

### 9.8 Prose styles pour les articles

```css
/* src/styles/global.css — ajouter apres le bloc @theme */

.prose > * + * { margin-top: 1.5rem; }
.prose h2 { margin-top: 3rem; margin-bottom: 1rem; }
.prose h3 { margin-top: 2rem; margin-bottom: 0.75rem; }
.prose ul, .prose ol { padding-left: 1.5rem; }
.prose li + li { margin-top: 0.5rem; }
.prose blockquote {
  border-left: 3px solid var(--color-teal);
  padding: 1rem 1.5rem;
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  border-radius: 0 4px 4px 0;
}
.prose blockquote p { color: var(--color-text-secondary); }
.prose a {
  color: var(--color-teal-bright);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose a:hover { color: var(--color-teal-hover); }
.prose code:not(pre code) {
  font-family: var(--font-code);
  font-size: 0.875rem;
  color: var(--color-teal-bright);
  background: var(--color-surface);
  padding: 0.125rem 0.375rem;
  border-radius: 2px;
}
```

### 9.9 Google Fonts dans Astro

Charger les fonts dans le `<head>` du layout principal :

```astro
---
// src/layouts/Base.astro
import '../styles/global.css';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';

interface Props { title: string; description?: string; }
const { title, description = 'Blog technique developpeur' } = Astro.props;
---

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} — devblog</title>
  <meta name="description" content={description} />

  <!-- Google Fonts — preconnect AVANT le stylesheet -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
</head>
<body class="bg-canvas text-text-primary font-body leading-relaxed">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />

  <!-- Animations scroll -->
  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-up, .section-title').forEach(el => observer.observe(el));
  </script>
</body>
</html>
```

### 9.10 Recherche avec Pagefind

Pagefind genere un index de recherche statique au moment du build :

```bash
# Installation
npm install -D pagefind

# Ajouter au script de build dans package.json
"build": "astro build && npx pagefind --site dist"
```

Integrer le widget dans la page recherche :

```astro
---
// src/pages/recherche.astro
import Base from '../layouts/Base.astro';
---

<Base title="Recherche">
  <div class="max-w-6xl mx-auto px-6 lg:px-8 py-16">
    <h1 class="text-3xl md:text-4xl font-bold mb-8">Recherche</h1>
    <div id="search"></div>
  </div>
</Base>

<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
<script>
  import '/pagefind/pagefind-ui.js';
  new PagefindUI({ element: '#search', showSubResults: true });
</script>

<style is:global>
  /* Adapter le theme Pagefind aux tokens du design */
  :root {
    --pagefind-ui-primary: var(--color-teal);
    --pagefind-ui-text: var(--color-text-primary);
    --pagefind-ui-background: var(--color-surface);
    --pagefind-ui-border: var(--color-border);
    --pagefind-ui-border-width: 1px;
    --pagefind-ui-border-radius: 4px;
    --pagefind-ui-font: var(--font-body);
  }
</style>
```

### 9.11 Checklist d'implementation

- [ ] Initialiser le projet Astro (`npm create astro@latest`)
- [ ] Installer les integrations (`@astrojs/tailwind`, `@astrojs/mdx`)
- [ ] Porter les tokens `@theme` dans `src/styles/global.css`
- [ ] Charger les Google Fonts dans le layout `Base.astro`
- [ ] Creer le layout global (Header + Footer + GlowLine)
- [ ] Definir la Content Collection `articles` avec schema Zod
- [ ] Implementer la page d'accueil avec ArticleCard
- [ ] Implementer la page article dynamique (`[...slug].astro`) avec prose + TOC
- [ ] Implementer la page recherche avec Pagefind
- [ ] Implementer la page a propos avec timeline + stack + projets
- [ ] Ajouter les animations ScrollReveal
- [ ] Configurer Shiki pour le syntax highlighting
- [ ] Tester responsive (375px / 768px / 1280px)
- [ ] Valider contraste WCAG AA
- [ ] Deployer (Vercel / Cloudflare Pages)

### 9.12 Regles CSS importantes (Tailwind v4)

| A FAIRE | A NE PAS FAIRE |
|---------|----------------|
| `rounded-sm` (= ancien `rounded`) | ~~`rounded`~~ (plus petit en v4) |
| `rounded-xs` (= ancien `rounded-sm`) | ~~`rounded-sm`~~ (si vous voulez tres petit) |
| `shadow-sm` (= ancien `shadow`) | ~~`shadow`~~ (plus gros en v4) |
| `ring-3` | ~~`ring`~~ (pas de defaut en v4) |
| `outline-hidden` | ~~`outline-none`~~ |
| `bg-linear-to-*` | ~~`bg-gradient-to-*`~~ |
| `bg-black/50` (modifier) | ~~`bg-opacity-50`~~ |
| `border-gray-200` (couleur explicite) | ~~`border`~~ seul (= currentColor en v4) |
| `grow` / `shrink` | ~~`flex-grow`~~ / ~~`flex-shrink`~~ |

---

**Fin du rapport**
*Mis a jour le 2026-02-09 — DevBlog Design System v1.1 (Astro)*
