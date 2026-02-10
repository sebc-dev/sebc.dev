# Phase 5: About Page - Context

**Gathered:** 2026-02-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Personal presentation page — users discover the blog author, the "learn in public" philosophy at the intersection of IA x Ingenierie x UX, and social media links. Bilingual (FR/EN). The mockup (about.html) is discarded — design from scratch following these decisions.

</domain>

<decisions>
## Implementation Decisions

### Structure du contenu
- Philosophie d'abord — ouvrir sur le "learn in public" et l'intersection IA x Ingenierie x UX
- Page minimale : philosophie + courte bio + liens sociaux (pas de parcours pro detaille)
- Trois blocs visuels pour les piliers (IA, Ingenierie, UX) — chacun avec icone + court texte
- Chaque bloc pilier est cliquable et redirige vers la page search pre-filtree par ce pillar tag
- CTA en fin de page : "Decouvrir mes articles" — lien vers la home ou search

### Ton et personnalite
- Registre conversationnel — comme parler a un collegue dev, direct et accessible
- Premiere personne (je/I) — personnel et authentique
- Le texte sera fourni par l'utilisateur — Claude cree la structure/composants avec des placeholders

### Mise en page visuelle
- Layout hero + sections : grand bloc hero en haut (photo + accroche philosophie), puis sections empilees
- Photo reelle de profil dans le hero
- Icones sociales (GitHub, Twitter/X, LinkedIn, dev.to) integrees au hero, sous la photo
- Icones seules sans labels texte — minimaliste
- Hero sobre et coherent avec le design system — fond void/canvas, pas de gradient ni glow special

### Elements interactifs
- Animations legeres : scroll-reveal (existant) + hover effects sur les blocs piliers + transitions subtiles
- Hover des blocs piliers : bordure ou ombre teal (glow teal) — coherent avec le design system
- Pas de rich interactions (pas de parallaxe, flip, expand)

### Claude's Discretion
- Choix des icones pour chaque pilier (IA, Ingenierie, UX)
- Espacement et typographie exacte du hero
- Disposition responsive des blocs piliers (grille, flex)
- Traitement visuel exact du CTA en fin de page

</decisions>

<specifics>
## Specific Ideas

- Les blocs piliers doivent faire le pont entre la page About et le contenu : clic → search pre-filtree
- Le hero doit rester sobre — meme traitement visuel que le reste du site (void/canvas backgrounds)
- Photo reelle (pas avatar) pour humaniser la page
- Le CTA final dirige vers les articles, pas vers un contact

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-about-page*
*Context gathered: 2026-02-10*
