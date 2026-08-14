#!/usr/bin/env node
// Fails the build if any `demo: true` article fixture leaked into dist/.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

const ARTICLES_DIR = "src/content/articles";
const DIST_DIR = "dist";

function walkArticleFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkArticleFiles(fullPath));
    } else if (/\.(md|mdx)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const fieldMatch = line.match(/^(\w+):\s*(.+)$/);
    if (!fieldMatch) continue;
    const [, key, rawValue] = fieldMatch;
    fields[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
  return fields;
}

function findDemoArticles() {
  const demoArticles = [];
  for (const filePath of walkArticleFiles(ARTICLES_DIR)) {
    const content = readFileSync(filePath, "utf-8");
    const fm = parseFrontmatter(content);
    if (fm.demo === "true") {
      demoArticles.push({
        id: basename(filePath, extname(filePath)),
        lang: fm.lang ?? "",
      });
    }
  }
  return demoArticles;
}

function findLeaks(demoArticles) {
  const leaks = [];

  for (const { id, lang } of demoArticles) {
    const htmlPath = join(DIST_DIR, lang, "articles", `${id}.html`);
    if (existsSync(htmlPath)) {
      leaks.push(`${id} — found at ${htmlPath}`);
    }
  }

  if (existsSync(DIST_DIR)) {
    const sitemapFiles = readdirSync(DIST_DIR).filter((f) =>
      /^sitemap-.*\.xml$/.test(f),
    );
    for (const sitemapFile of sitemapFiles) {
      const content = readFileSync(join(DIST_DIR, sitemapFile), "utf-8");
      for (const { id } of demoArticles) {
        if (content.includes(`/articles/${id}`)) {
          leaks.push(`${id} — referenced in dist/${sitemapFile}`);
        }
      }
    }
  }

  return leaks;
}

const demoArticles = findDemoArticles();
const leaks = findLeaks(demoArticles);

if (leaks.length > 0) {
  console.error(
    `check-no-demo: ${leaks.length} demo fixture(s) leaked into the production build:`,
  );
  for (const leak of leaks) console.error(`  - ${leak}`);
  process.exit(1);
}

console.log(
  `check-no-demo: OK — ${demoArticles.length} demo fixture(s), none published.`,
);
