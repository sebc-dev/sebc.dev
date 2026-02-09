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
    "lang.switch": "Switch to {label}",
    "404.title": "Page not found",
    "404.message": "This page doesn't exist.",
    "404.back": "Go to homepage",
    "home.description": "Technical blog about AI, Software Engineering & UX",
    "home.noArticles": "No articles yet. Check back soon!",
    "home.filterAll": "All",
    "article.readingTime": "min read",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.search": "Recherche",
    "nav.about": "A propos",
    "footer.description": "Blog technique — IA x Ingenierie x UX",
    "footer.copyright": "Tous droits reserves.",
    "lang.switch": "Passer en {label}",
    "404.title": "Page introuvable",
    "404.message": "Cette page n'existe pas.",
    "404.back": "Retour a l'accueil",
    "home.description":
      "Blog technique sur l'IA, l'Ing\u00e9nierie logicielle & l'UX",
    "home.noArticles": "Pas encore d'articles. Revenez bient\u00f4t !",
    "home.filterAll": "Tous",
    "article.readingTime": "min de lecture",
  },
} as const;
