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
  getTags,
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

// Articles intentionally NOT in date order to test sorting
// Also includes fr + draft articles to test filtering
// Featured article (a2) is NOT the most recent — tests find vs [0] fallback
const allArticles = [
  makeArticle({
    id: "a3",
    title: "Third",
    date: new Date("2025-01-01"),
    tags: ["typescript", "node"],
  }),
  makeArticle({
    id: "a1",
    title: "First",
    date: new Date("2025-03-01"),
  }),
  makeArticle({
    id: "a2",
    title: "Second",
    date: new Date("2025-02-01"),
    category: "analyse-approfondie",
    tags: ["css"],
    featured: true,
  }),
  makeArticle({ id: "fr1", title: "French", lang: "fr" }),
  makeArticle({ id: "draft1", title: "Draft", draft: true }),
];

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetCollection.mockImplementation(async (_collection, filter) => {
    if (!filter) return allArticles;
    return allArticles.filter((a) =>
      (filter as (entry: Article) => boolean)(a),
    );
  });
});

describe("getArticlesByLocale", () => {
  it("filters by locale and excludes drafts", async () => {
    const articles = await getArticlesByLocale("en");
    expect(articles).toHaveLength(3);
    // Must not contain fr or draft articles
    expect(articles.every((a) => a.data.lang === "en")).toBe(true);
    expect(articles.every((a) => !a.data.draft)).toBe(true);
  });

  it("filters fr locale correctly", async () => {
    const articles = await getArticlesByLocale("fr");
    expect(articles).toHaveLength(1);
    expect(articles[0].id).toBe("fr1");
  });

  it("returns articles sorted by date descending", async () => {
    const articles = await getArticlesByLocale("en");
    // a1 (March) > a2 (Feb) > a3 (Jan) — input order was a3, a1, a2
    expect(articles.map((a) => a.id)).toEqual(["a1", "a2", "a3"]);
  });
});

describe("getFeaturedArticle", () => {
  it("returns the featured article, not the most recent", async () => {
    // a2 is featured but a1 is more recent — must return a2
    const featured = await getFeaturedArticle("en");
    expect(featured?.id).toBe("a2");
    expect(featured?.data.featured).toBe(true);
  });

  it("falls back to most recent article if none featured", async () => {
    const noFeatured = allArticles.map((a) => ({
      ...a,
      data: { ...a.data, featured: false },
    })) as Article[];
    mockedGetCollection.mockImplementation(async (_collection, filter) => {
      return noFeatured.filter((a) =>
        (filter as (entry: Article) => boolean)(a),
      );
    });

    const featured = await getFeaturedArticle("en");
    // Should be a1 (most recent by date), not a3 (first in array)
    expect(featured?.id).toBe("a1");
  });
});

describe("getCategories", () => {
  it("returns unique categories in canonical order", async () => {
    const categories = await getCategories("en");
    expect(categories).toEqual(["analyse-approfondie", "tutoriel"]);
  });
});

describe("getTags", () => {
  it("returns sorted unique tags across all articles", async () => {
    const tags = await getTags("en");
    expect(tags).toEqual(["css", "node", "typescript"]);
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
  it("scores category match higher than tag-only match", async () => {
    // Source: a1 (category=tutoriel, tags=[typescript])
    // a3: same category + shared tag "typescript" → score 3
    // a2: different category, no shared tags → score 0
    const related = await getRelatedArticles(allArticles[1], 3); // a1
    expect(related[0].id).toBe("a3");
    expect(related[1].id).toBe("a2");
  });

  it("category match alone outranks single tag match", async () => {
    const source = makeArticle({
      id: "src",
      category: "etude-de-cas",
      tags: ["docker"],
    });
    const catMatch = makeArticle({
      id: "cat",
      category: "etude-de-cas",
      tags: ["k8s"],
    }); // score: 2 (category only)
    const tagMatch = makeArticle({
      id: "tag",
      category: "actualites",
      tags: ["docker"],
    }); // score: 1 (tag only)
    const noMatch = makeArticle({
      id: "none",
      category: "analyse-approfondie",
      tags: ["figma"],
    }); // score: 0

    mockedGetCollection.mockImplementation(async (_collection, filter) => {
      // noMatch BEFORE tagMatch — without tag scoring they'd tie at 0
      // and noMatch would appear first. Tag scoring must push tagMatch ahead.
      const all = [source, noMatch, catMatch, tagMatch];
      if (!filter) return all;
      return all.filter((a) => (filter as (entry: Article) => boolean)(a));
    });

    const related = await getRelatedArticles(source, 3);
    expect(related.map((a) => a.id)).toEqual(["cat", "tag", "none"]);
  });

  it("excludes the source article", async () => {
    const related = await getRelatedArticles(allArticles[1], 10);
    expect(related.find((a) => a.id === allArticles[1].id)).toBeUndefined();
  });

  it("respects the limit parameter", async () => {
    const related = await getRelatedArticles(allArticles[1], 1);
    expect(related).toHaveLength(1);
  });
});
