import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Article } from "./articles";

// Mock astro:content
vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

import { getCollection } from "astro:content";
import {
  getArticlesByLocale,
  getFeaturedArticle,
  getCategories,
  getArticleUrl,
  getRelatedArticles,
} from "./articles";

const mockedGetCollection = vi.mocked(getCollection);

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
      category: "engineering",
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

const enArticles = [
  makeArticle({
    id: "a1",
    title: "First",
    date: new Date("2025-03-01"),
    featured: true,
  }),
  makeArticle({
    id: "a2",
    title: "Second",
    date: new Date("2025-02-01"),
    category: "design",
    tags: ["css"],
  }),
  makeArticle({
    id: "a3",
    title: "Third",
    date: new Date("2025-01-01"),
    tags: ["typescript", "node"],
  }),
];

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetCollection.mockImplementation(async (_collection, filter) => {
    if (!filter) return enArticles;
    return enArticles.filter((a) => (filter as (entry: Article) => boolean)(a));
  });
});

describe("getArticlesByLocale", () => {
  it("returns articles filtered by locale, excluding drafts", async () => {
    const articles = await getArticlesByLocale("en");
    expect(articles).toHaveLength(3);
    expect(mockedGetCollection).toHaveBeenCalledWith(
      "articles",
      expect.any(Function),
    );
  });

  it("returns articles sorted by date descending", async () => {
    const articles = await getArticlesByLocale("en");
    expect(articles[0].id).toBe("a1");
    expect(articles[2].id).toBe("a3");
  });

  it("excludes draft articles", async () => {
    const withDraft = [
      ...enArticles,
      makeArticle({ id: "draft", draft: true }),
    ];
    mockedGetCollection.mockImplementation(async (_collection, filter) => {
      return withDraft.filter((a) =>
        (filter as (entry: Article) => boolean)(a),
      );
    });

    const articles = await getArticlesByLocale("en");
    expect(articles.find((a) => a.id === "draft")).toBeUndefined();
  });
});

describe("getFeaturedArticle", () => {
  it("returns the featured article", async () => {
    const featured = await getFeaturedArticle("en");
    expect(featured?.id).toBe("a1");
    expect(featured?.data.featured).toBe(true);
  });

  it("falls back to first article if none featured", async () => {
    const noFeatured = enArticles.map((a) => ({
      ...a,
      data: { ...a.data, featured: false },
    })) as Article[];
    mockedGetCollection.mockImplementation(async (_collection, filter) => {
      return noFeatured.filter((a) =>
        (filter as (entry: Article) => boolean)(a),
      );
    });

    const featured = await getFeaturedArticle("en");
    expect(featured?.id).toBe("a1");
  });
});

describe("getCategories", () => {
  it("returns sorted unique categories", async () => {
    const categories = await getCategories("en");
    expect(categories).toEqual(["design", "engineering"]);
  });
});

describe("getArticleUrl", () => {
  it("builds correct URL for English article", () => {
    const article = makeArticle({ id: "my-article", lang: "en" });
    expect(getArticleUrl(article)).toBe("/en/articles/my-article");
  });

  it("builds correct URL for French article", () => {
    const article = makeArticle({ id: "mon-article", lang: "fr" });
    expect(getArticleUrl(article)).toBe("/fr/articles/mon-article");
  });
});

describe("getRelatedArticles", () => {
  it("returns articles scored by category and tag overlap", async () => {
    const related = await getRelatedArticles(enArticles[0], 3);
    // a3 shares "typescript" tag + same category = score 3
    // a2 shares nothing (different category, different tag) = score 0
    expect(related[0].id).toBe("a3");
  });

  it("excludes the source article", async () => {
    const related = await getRelatedArticles(enArticles[0], 10);
    expect(related.find((a) => a.id === enArticles[0].id)).toBeUndefined();
  });

  it("respects the limit parameter", async () => {
    const related = await getRelatedArticles(enArticles[0], 1);
    expect(related).toHaveLength(1);
  });
});
