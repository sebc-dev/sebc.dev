import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.coerce.date(),
    category: z.enum([
      "actualites",
      "analyse-approfondie",
      "parcours-apprentissage",
      "retrospective",
      "tutoriel",
      "etude-de-cas",
      "astuces-rapides",
      "dans-les-coulisses",
      "test-outil",
    ]),
    tags: z.array(z.string()),
    pillarTags: z
      .array(z.enum(["IA", "Ingénierie", "UX"]))
      .min(1, "Au moins un tag pilier requis"),
    image: z.string().optional(),
    readingTime: z.number(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    lang: z.enum(["fr", "en"]),
    translationSlug: z.string().optional(),
    series: z
      .object({
        id: z.string(),
        episode: z.number(),
        total: z.number().optional(),
      })
      .optional(),
  }),
});

export const collections = { articles };
