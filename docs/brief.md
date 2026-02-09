# sebc.dev — Brief Découverte

**Date :** 05/02/2025 **Mode :** Entretien structuré (auto-découverte assistée IA) **Niveau :** Standard (adapté projet personnel) **Statut :** ✅ Phase 1 complète

---

## Synthèse Express

|Élément|Information|
|---|---|
|Projet|Blog technique personnel|
|Domaine|sebc.dev|
|Stack|Astro + Cloudflare|
|Délai|1 semaine|
|Décideur|Negus Salomon (seul décideur)|
|Action prioritaire|Apprendre par l'écriture (learn in public)|
|Priorité projet|🔴 Haute — Projet pilote avant premier client agence|

---

## 1. Contexte et Déclencheur

### Déclencheur

Lancement d'une agence web solo ciblant les TPE/PME. Premier client imminent. Le blog sert de **projet pilote zéro** pour valider simultanément :

- La stack technique (Astro + Cloudflare)
- Le process méthodologique complet (Phases 1 à 5)

### Historique des tentatives

Plusieurs essais précédents abandonnés pour des raisons de DX (Developer Experience) :

- **Next.js + Payload** → DX insatisfaisante avec Cloudflare
- **Next.js sans Payload** → Même problème d'hébergement
- **Nuxt.js** → Pas exploré en profondeur
- **Astro** → Utilisé sans Cloudflare, bonne expérience

### Pourquoi Astro + Cloudflare maintenant

- Performances natives (SSG/SSR hybride)
- Couplage Astro ↔ Cloudflare en amélioration (rachat d'Astro par Cloudflare)
- Stack identique à celle prévue pour les clients agence → cohérence
- Coûts d'hébergement maîtrisés (pertinent TPE/PME)

---

## 2. Besoin identifié

### Action prioritaire

**Écrire pour apprendre** — Laboratoire d'apprentissage assumé. Le blog est un outil de consolidation des connaissances par l'écriture, pas un outil d'acquisition client directe.

### Vision du succès à 6 mois

- **~24 articles publiés** (rythme : 1 article/semaine, IA-assisté)
- **Régularité de publication maintenue** ← KPI principal
- Trafic et audience = bénéfices secondaires, pas d'objectif chiffré
- Routine d'écriture installée et soutenable

### Bénéfices secondaires (par ordre de priorité)

1. Construction d'audience (pairs développeurs)
2. Crédibilité / personal branding
3. Échanges techniques
4. Opportunités professionnelles

### Double rôle stratégique du projet

1. **Vitrine personnelle** — Démonstration des valeurs défendues (UX, qualité, performance)
2. **Terrain d'expérimentation** — Validation complète du workflow avant application client

---

## 3. Cible

### Lecteur idéal

**Développeur mid-level** en phase d'adaptation à l'évolution du métier par l'IA. Profil miroir du créateur : voit que l'IA prend plus de place, cherche à comprendre comment s'adapter.

### Canaux de consommation de contenu

|Canal|Usage actuel|Usage prévu|
|---|:-:|:-:|
|Medium|✅ Lecture|Diffusion possible|
|dev.to|✅ Lecture|Diffusion possible|
|daily.dev|✅ Lecture|Référencement|
|YouTube|✅ Lecture|À explorer|
|Twitter/X|❌|✅ À développer|
|LinkedIn|❌|✅ À développer|

→ **Impact sur le design :** Boutons de partage à prioriser : Twitter/X, LinkedIn, dev.to, lien copié.

---

## 4. Différenciation

### Positionnement : 3 piliers

**Pilier 1 — Angle éditorial : "Learn in public"** Laboratoire d'apprentissage assumé. Pas de posture d'expert. Expérimentation, validation, échecs documentés et leçons tirées. Authenticité et transparence.

**Pilier 2 — Niche thématique : IA × Ingénierie logicielle × UX** Le trio d'avenir post-IA. Thèse : on écrira de moins en moins de code, on prendra de plus en plus de hauteur. Intersection rare dans les blogs dev.

**Pilier 3 — Le medium est le message** Le site lui-même doit être une démonstration irréprochable des valeurs défendues : UX soignée, performance, qualité de conception. Carte de visite technique vivante.

---

## 5. Ressources

### Branding

|Élément|Statut|Action|
|---|---|---|
|Nom / domaine|✅ sebc.dev|Acquis|
|Logo|✅ Disponible|—|
|Charte graphique|✅ Définie|À appliquer|
|Typographies|✅ Choisies|À intégrer|
|Contenu articles|❌ Aucun|Post-lancement|

### Contenu au lancement

Pas de contenu prévu pour la V1. Le lancement concerne uniquement la structure technique et le design. Les articles viendront après la mise en ligne.

---

## 6. Direction Design

### Principes directeurs

- **Dark theme** moderne et premium
- **Une couleur d'accent principale** + échelle de gris nuancés
- **Typographie imposante** et aérée
- **Espaces généreux** — pas de surcharge visuelle
- **Esthétique SaaS/tech** — pas "blog dev classique"

### Inspirations analysées

|Site|Ce qui est retenu|
|---|---|
|**Supabase** (supabase.com)|Fond sombre, accent vert, typo large et aérée, élégance sobre, structure propre|
|**Auth0 Blog** (auth0.com/blog)|Organisation blog, catégorisation claire, cartes d'articles structurées, dark theme|
|**Ovo RedSun** (ovo-redsun.webflow.io)|Direction artistique audacieuse, orange sur noir, typo bold, rendu premium, gradients subtils|
|**Verve** (verve-template.webflow.io)|Teal/cyan sur noir, lignes de grille, grandes headlines, rendu haut de gamme|

### Synthèse design

Dark theme premium. Couleur d'accent unique forte sur fond sombre. Typographie bold et soignée. Espaces aérés. Micro-interactions subtiles. Qualité irréprochable = démonstration du pilier 3 (le medium est le message).

---

## 7. Spécifications Fonctionnelles — V1

### Architecture des pages

#### Page 1 — Accueil

- Liste des derniers articles publiés
- Cartes d'articles avec métadonnées : date, temps de lecture, catégorie(s), tags
- Pas d'auteur affiché (solo)
- Bilingue FR/EN

#### Page 2 — Article

- Rendu complet de l'article (**MDX** → HTML) avec support composants interactifs
- **Syntax highlighting** des blocs de code (Shiki intégré Astro)
- **Table des matières** (générée depuis les headings)
- **Indicateur d'avancée de lecture** (progress bar au scroll)
- **Boutons de partage** : Twitter/X, LinkedIn, dev.to, copier le lien
- Affichage catégorie(s) et tags (cliquables → hub)
- Métadonnées : date, temps de lecture

#### Page 3 — Hub de recherche

- **Recherche full-text** via Pagefind (côté client)
- **Filtres** : catégories, tags, métadonnées
- **Point d'entrée unifié** : clic sur une catégorie ou un tag depuis n'importe quelle page → hub avec filtre correspondant pré-appliqué
- Résultats dynamiques côté client

#### Page 4 — À propos

- Présentation personnelle et parcours
- Philosophie du blog (learn in public, trio IA × ingénierie × UX)
- Liens vers réseaux sociaux (Twitter/X, LinkedIn, dev.to, GitHub)
- Bilingue FR/EN

### Internationalisation (i18n)

- **Langues :** Français + Anglais
- **Structure URL :** `sebc.dev/fr/[slug]` et `sebc.dev/en/[slug]`
- **Couverture :** Tous les articles traduits dans les deux langues
- **Routing :** i18n intégré Astro
- **Traduction :** IA-assistée

### Stack technique

|Composant|Technologie|
|---|---|
|Framework|Astro|
|Hébergement|Cloudflare (Pages/Workers)|
|Recherche|Pagefind (client-side)|
|Contenu|MDX (Content Collections Astro) — composants interactifs + syntax highlighting (Shiki)|
|i18n|Astro i18n routing|
|Développement|IA-assistée (Claude Code + agents en continu)|

---

## 8. KPIs et Mesure du Succès

### Score Mode Dégradé : N/A

Projet personnel — pas de baseline business à mesurer. Les KPIs sont orientés régularité et technique.

### KPIs retenus

#### KPIs primaires (régularité)

|KPI|Objectif|Mesure|Fréquence|
|---|---|---|---|
|Articles publiés/semaine|1|Comptage|Hebdomadaire|
|Régularité sur 1 mois|4 articles|Comptage|Mensuelle|
|Régularité sur 6 mois|~24 articles|Comptage|Semestrielle|

#### KPIs techniques (garantis à la livraison)

|KPI|Objectif|Mesure|
|---|---|---|
|Core Web Vitals LCP|≤ 2,5s|PageSpeed Insights|
|Core Web Vitals INP|≤ 200ms|PageSpeed Insights|
|Core Web Vitals CLS|≤ 0,1|PageSpeed Insights|
|Lighthouse Performance|≥ 90|DevTools|
|Mobile-first|100% responsive|Test manuel|
|HTTPS|Actif|Cloudflare (natif)|
|Pagefind fonctionnel|Recherche opérationnelle|Test manuel|
|i18n fonctionnel|FR/EN avec URLs propres|Test manuel|

#### KPIs secondaires (à observer sans pression, M+3)

|KPI|Ce qu'on observe|Outil|
|---|---|---|
|Trafic|Tendance croissante|Analytics (Cloudflare / Plausible)|
|Sources|D'où viennent les lecteurs|Analytics|
|Articles populaires|Quels sujets résonnent|Analytics|
|Partages|Engagement sur réseaux|Comptage manuel|

---

## 9. Red Flags

### Évaluation

|Flag|Gravité|Statut|Notes|
|---|---|---|---|
|Délai ambitieux (1 semaine)|🟡 Vigilance|Accepté|Stack connue + IA en support continu. Risque maîtrisé.|
|Pas de contenu au lancement|🟡 Vigilance|Accepté|Choix délibéré. Le contenu viendra post-lancement.|
|Scope ambitieux (hub recherche + i18n)|🟡 Vigilance|Accepté|Confiance dans la vélocité IA. Pas de dépendance client.|

### Score

- 🔴 Bloquants : 0
- 🟠 Majeurs : 0
- 🟡 Vigilance : 3

### Décision : ✅ GO

Projet personnel sans contrainte client. Les 3 points de vigilance sont tous liés à l'ambition du scope dans le délai, compensés par l'absence d'allers-retours client et l'utilisation intensive d'IA.

---

## 10. Prochaines étapes — Transition Phase 2

### Actions immédiates

1. ✅ Brief Découverte complété (ce document)
2. ⬜ Définir la taxonomie (catégories et tags initiaux)
3. ⬜ Définir l'architecture de l'information (sitemap détaillé)
4. ⬜ Wireframes des 3 pages
5. ⬜ Setup technique Astro + Cloudflare

### Critères de passage Phase 2

- [x] Action prioritaire identifiée
- [x] Cible définie
- [x] Décision Go/No-Go formalisée
- [x] Spécifications fonctionnelles documentées
- [x] Direction design établie
- [x] KPIs définis
- [ ] Taxonomie validée (Phase 2)
- [ ] Architecture de l'information (Phase 2)

---

## Annexes

### A — Verbatims importants

> « L'idée est dans ma tête depuis un moment. Je viens de me lancer pour une agence web en solo développeur et j'ai mon premier client qui va arriver. Je veux expérimenter le workflow que je vais utiliser pour mes clients avant le premier client. »

> « Le but principal pour moi c'est me permettre d'écrire sur des choses que j'apprends afin de consolider mon apprentissage. »

> « Je ne me pose pas en expert, j'expérimente, je valide, je rate et tire des leçons. »

> « C'est le trio d'avenir avec l'arrivée de l'IA qui va faire que l'on va écrire de moins en moins de code et prendre de plus en plus de hauteur. »

> « L'UX et la qualité de mon site doit refléter ce que je défends comme valeur et ce que je mets en avant. »

> « Dark theme moderne avec une couleur principale et du gris. »
