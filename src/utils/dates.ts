const localeMap: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
};

export function formatDate(date: Date, lang: string): string {
  const locale = localeMap[lang] ?? "en-US";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
