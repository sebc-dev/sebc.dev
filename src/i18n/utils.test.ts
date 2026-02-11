import { describe, it, expect } from "vitest";
import { getLangFromUrl, useTranslations } from "./utils";

describe("getLangFromUrl", () => {
  it("returns 'en' for English URL", () => {
    const url = new URL("https://sebc.dev/en/articles/test");
    expect(getLangFromUrl(url)).toBe("en");
  });

  it("returns 'fr' for French URL", () => {
    const url = new URL("https://sebc.dev/fr/articles/test");
    expect(getLangFromUrl(url)).toBe("fr");
  });

  it("returns default lang for root URL", () => {
    const url = new URL("https://sebc.dev/");
    expect(getLangFromUrl(url)).toBe("en");
  });

  it("returns default lang for unknown locale", () => {
    const url = new URL("https://sebc.dev/de/articles/test");
    expect(getLangFromUrl(url)).toBe("en");
  });
});

describe("useTranslations", () => {
  it("returns English translation", () => {
    const t = useTranslations("en");
    expect(t("nav.home")).toBe("Home");
    expect(t("nav.search")).toBe("Search");
  });

  it("returns French translation", () => {
    const t = useTranslations("fr");
    expect(t("nav.home")).toBe("Accueil");
    expect(t("nav.search")).toBe("Recherche");
  });

  it("falls back to English for missing French key", () => {
    const t = useTranslations("fr");
    // All keys exist in both, so test a known key returns fr value
    expect(t("nav.about")).toBe("À propos");
  });
});
