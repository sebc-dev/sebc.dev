import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import astroExpressiveCode from "astro-expressive-code";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { h } from "hastscript";

export default defineConfig({
  site: "https://sebc.dev",
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
    platformProxy: { enabled: true },
  }),
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: { class: "heading-anchor", ariaHidden: true, tabIndex: -1 },
          content: h("span.heading-anchor-icon", "#"),
        },
      ],
    ],
  },
  integrations: [
    astroExpressiveCode({
      themes: ["github-dark-default"],
      styleOverrides: {
        codeBackground: "var(--color-void)",
        borderColor: "var(--color-border)",
        borderRadius: "4px",
        codeFontFamily: "var(--font-code)",
        codeFontSize: "0.875rem",
        codeLineHeight: "1.6",
        codePaddingBlock: "1.25rem",
        codePaddingInline: "1.25rem",
        frames: {
          shadowColor: "transparent",
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  trailingSlash: "never",
  compressHTML: true,
});
