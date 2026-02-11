import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getArticlesByLocale, getArticleUrl } from "@/lib/articles";

const descriptions = {
  en: "Technical blog -- AI x Engineering x UX",
  fr: "Blog technique -- IA x Ingenierie x UX",
} as const;

export function getStaticPaths() {
  return [{ params: { lang: "en" } }, { params: { lang: "fr" } }];
}

export async function GET(context: APIContext) {
  const lang = context.params.lang as "en" | "fr";
  const articles = await getArticlesByLocale(lang);
  const site = context.site ?? new URL("https://sebc.dev");

  return rss({
    title: "sebc.dev",
    description: descriptions[lang],
    site: site,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: getArticleUrl(article),
    })),
    customData: `<language>${lang}</language>`,
  });
}
