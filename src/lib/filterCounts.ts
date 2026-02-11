import type { Article } from "./articles";
import type { Category } from "./categories";

export function computeCategoryCounts(
  articles: Article[],
  categories: Category[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of categories) {
    counts[cat] = articles.filter((a) => a.data.category === cat).length;
  }
  return counts;
}

export function computeTagCounts(
  articles: Article[],
  tags: string[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const tag of tags) {
    counts[tag] = articles.filter((a) => a.data.tags.includes(tag)).length;
  }
  return counts;
}
