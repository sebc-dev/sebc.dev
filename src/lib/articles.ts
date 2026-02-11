import { getCollection, type CollectionEntry } from "astro:content";
export { CATEGORIES, type Category } from "./categories";
import { CATEGORIES, type Category } from "./categories";

export type Article = CollectionEntry<"articles">;

export async function getArticlesByLocale(
  lang: "en" | "fr",
): Promise<Article[]> {
  const articles = await getCollection("articles", (entry) => {
    return entry.data.lang === lang && !entry.data.draft;
  });
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getFeaturedArticle(
  lang: "en" | "fr",
): Promise<Article | undefined> {
  const articles = await getArticlesByLocale(lang);
  return articles.find((a) => a.data.featured) ?? articles[0];
}

export async function getCategories(lang: "en" | "fr"): Promise<Category[]> {
  const articles = await getArticlesByLocale(lang);
  const used = new Set(articles.map((a) => a.data.category));
  return CATEGORIES.filter((c) => used.has(c));
}

export async function getTags(lang: "en" | "fr"): Promise<string[]> {
  const articles = await getArticlesByLocale(lang);
  const tags = [...new Set(articles.flatMap((a) => a.data.tags))];
  return tags.sort();
}

export function getArticleUrl(article: Article): string {
  return `/${article.data.lang}/articles/${article.id}`;
}

export async function getRelatedArticles(
  article: Article,
  limit = 3,
): Promise<Article[]> {
  const allArticles = await getArticlesByLocale(
    article.data.lang as "en" | "fr",
  );
  const otherArticles = allArticles.filter((a) => a.id !== article.id);

  const scored = otherArticles.map((a) => {
    let score = 0;
    if (a.data.category === article.data.category) score += 2;
    for (const tag of a.data.tags) {
      if (article.data.tags.includes(tag)) score += 1;
    }
    return { article: a, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}
