import { ui, defaultLang } from "./ui";
import type { Category } from "@/lib/categories";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function getCategoryLabel(
  category: Category,
  lang: keyof typeof ui,
): string {
  const key = `category.${category}` as keyof (typeof ui)[typeof defaultLang];
  return ui[lang][key] ?? ui[defaultLang][key] ?? category;
}
