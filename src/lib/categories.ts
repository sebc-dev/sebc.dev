/** Canonical category order — single source of truth for the entire app */
export const CATEGORIES = [
  "actualites",
  "analyse-approfondie",
  "parcours-apprentissage",
  "retrospective",
  "tutoriel",
  "etude-de-cas",
  "astuces-rapides",
  "dans-les-coulisses",
  "test-outil",
] as const;

export type Category = (typeof CATEGORIES)[number];
