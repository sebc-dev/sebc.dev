import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("root redirects to /en", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.url()).toContain("/en");
  });

  test("EN home page loads", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/sebc\.dev/);
    await expect(page.locator("h1, [data-article-grid]")).toBeVisible();
  });

  test("FR home page loads", async ({ page }) => {
    await page.goto("/fr");
    await expect(page).toHaveTitle(/sebc\.dev/);
    await expect(page.locator("h1, [data-article-grid]")).toBeVisible();
  });

  test("EN about page loads", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("FR about page loads", async ({ page }) => {
    await page.goto("/fr/about");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("EN search page loads", async ({ page }) => {
    await page.goto("/en/search");
    await expect(page.locator("#search-input")).toBeVisible();
  });

  test("FR search page loads", async ({ page }) => {
    await page.goto("/fr/search");
    await expect(page.locator("#search-input")).toBeVisible();
  });

  test("404 page renders", async ({ page }) => {
    const response = await page.goto("/en/nonexistent-page");
    expect(response?.status()).toBe(404);
  });

  test("EN RSS feed returns XML", async ({ request }) => {
    const response = await request.get("/en/rss.xml");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("<rss");
    expect(text).toContain("<language>en</language>");
  });

  test("FR RSS feed returns XML", async ({ request }) => {
    const response = await request.get("/fr/rss.xml");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("<rss");
    expect(text).toContain("<language>fr</language>");
  });
});

test.describe("Navigation", () => {
  test("header nav links work", async ({ page }) => {
    await page.goto("/en");
    await page.click('a[href="/en/search"]');
    await expect(page).toHaveURL(/\/en\/search/);
    await expect(page.locator("#search-input")).toBeVisible();
  });

  test("language switch works", async ({ page }) => {
    await page.goto("/en");
    const langSwitch = page.locator('a[href="/fr"]');
    if (await langSwitch.isVisible()) {
      await langSwitch.click();
      await expect(page).toHaveURL(/\/fr/);
    }
  });

  test("article page loads from home", async ({ page }) => {
    await page.goto("/en");
    const articleLink = page.locator('a[href*="/en/articles/"]').first();
    if (await articleLink.isVisible()) {
      await articleLink.click();
      await expect(page).toHaveURL(/\/en\/articles\//);
      await expect(page.locator("article h1").first()).toBeVisible();
    }
  });
});
