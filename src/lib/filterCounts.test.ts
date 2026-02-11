import { describe, it, expect } from "vitest";
import type { Article } from "./articles";
import { computeCategoryCounts, computeTagCounts } from "./filterCounts";

function makeArticle(
  overrides: Partial<Article["data"]> & { id?: string },
): Article {
  const { id = "test-article", ...data } = overrides;
  return {
    id,
    data: {
      title: "Test Article",
      description: "A test article",
      date: new Date("2025-01-15"),
      category: "tutoriel",
      tags: ["typescript"],
      pillarTags: ["Ingénierie"] as Article["data"]["pillarTags"],
      readingTime: 5,
      featured: false,
      draft: false,
      lang: "en",
      ...data,
    },
    collection: "articles",
    body: "",
  } as Article;
}

describe("computeCategoryCounts", () => {
  const articles = [
    makeArticle({ id: "a1", category: "tutoriel" }),
    makeArticle({ id: "a2", category: "tutoriel" }),
    makeArticle({ id: "a3", category: "analyse-approfondie" }),
  ];

  it("counts articles per category", () => {
    const result = computeCategoryCounts(articles, [
      "tutoriel",
      "analyse-approfondie",
    ]);
    expect(result).toEqual({ tutoriel: 2, "analyse-approfondie": 1 });
  });

  it("returns 0 for categories with no articles", () => {
    const result = computeCategoryCounts(articles, ["actualites"]);
    expect(result).toEqual({ actualites: 0 });
  });

  it("handles empty articles array", () => {
    const result = computeCategoryCounts([], ["tutoriel"]);
    expect(result).toEqual({ tutoriel: 0 });
  });
});

describe("computeTagCounts", () => {
  const articles = [
    makeArticle({ id: "a1", tags: ["typescript", "react"] }),
    makeArticle({ id: "a2", tags: ["typescript", "node"] }),
    makeArticle({ id: "a3", tags: ["react"] }),
  ];

  it("counts articles per tag", () => {
    const result = computeTagCounts(articles, ["typescript", "react", "node"]);
    expect(result).toEqual({ typescript: 2, react: 2, node: 1 });
  });

  it("returns 0 for tags with no articles", () => {
    const result = computeTagCounts(articles, ["rust"]);
    expect(result).toEqual({ rust: 0 });
  });

  it("handles empty articles array", () => {
    const result = computeTagCounts([], ["typescript"]);
    expect(result).toEqual({ typescript: 0 });
  });
});
