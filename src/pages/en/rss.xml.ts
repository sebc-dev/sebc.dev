import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getArticlesByLocale, getArticleUrl } from "@/lib/articles";

export async function GET(context: APIContext) {
  const articles = await getArticlesByLocale("en");
  const site = context.site ?? new URL("https://sebc.dev");

  return rss({
    title: "sebc.dev",
    description: "Technical blog -- AI x Engineering x UX",
    site: site,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: getArticleUrl(article),
    })),
    customData: "<language>en</language>",
  });
}
