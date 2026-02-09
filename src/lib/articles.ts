import { getCollection, type CollectionEntry } from "astro:content";

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

export async function getCategories(lang: "en" | "fr"): Promise<string[]> {
  const articles = await getArticlesByLocale(lang);
  const categories = [...new Set(articles.map((a) => a.data.category))];
  return categories.sort();
}

export function getArticleUrl(article: Article): string {
  return `/${article.data.lang}/articles/${article.id}`;
}
