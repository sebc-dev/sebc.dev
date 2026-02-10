export function buildTwitterShareUrl(title: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
}

export function buildLinkedInShareUrl(title: string, url: string): string {
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
}

export function buildDevToShareUrl(title: string, url: string): string {
  const devtoContent = `---\ntitle: ${title}\npublished: false\n---\n\nOriginally posted at ${url}`;
  return `https://dev.to/new?prefill=${encodeURIComponent(devtoContent)}`;
}
