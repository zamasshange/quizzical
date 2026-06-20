import {
  BASE_KEYWORDS,
  BRAND_KEYWORDS,
  CATEGORY_KEYWORDS,
  IMAGE_GAME_KEYWORDS,
  PAGE_KEYWORDS,
  QUIZ_LONGTAIL_KEYWORDS,
} from "./seoKeywords";

export type SeoTopic = {
  slug: string;
  keyword: string;
  related: string[];
};

function keywordToSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function collectAllKeywords(): string[] {
  return [
    ...new Set(
      [
        ...BASE_KEYWORDS,
        ...Object.values(PAGE_KEYWORDS).flat(),
        ...Object.values(CATEGORY_KEYWORDS).flat(),
        ...Object.values(IMAGE_GAME_KEYWORDS).flat(),
        ...QUIZ_LONGTAIL_KEYWORDS,
      ]
        .map((k) => k.trim())
        .filter(Boolean),
    ),
  ];
}

function relatedKeywords(keyword: string, all: string[], limit = 10): string[] {
  const words = keyword.toLowerCase().split(/\s+/);
  const scored = all
    .filter((k) => k !== keyword)
    .map((k) => {
      const lower = k.toLowerCase();
      const score = words.reduce(
        (n, w) => (w.length > 2 && lower.includes(w) ? n + 1 : n),
        0,
      );
      return { k, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = scored.slice(0, limit).map(({ k }) => k);
  if (picked.length >= limit) return picked;

  const rest = all.filter((k) => k !== keyword && !picked.includes(k));
  return [...picked, ...rest.slice(0, limit - picked.length)];
}

let cachedTopics: SeoTopic[] | null = null;

/** Every unique SEO keyword as an indexable topic with a URL slug. */
export function getAllSeoTopics(): SeoTopic[] {
  if (cachedTopics) return cachedTopics;

  const keywords = collectAllKeywords();
  const bySlug = new Map<string, SeoTopic>();

  for (const keyword of keywords) {
    const slug = keywordToSlug(keyword);
    if (!slug || bySlug.has(slug)) continue;
    bySlug.set(slug, {
      slug,
      keyword,
      related: relatedKeywords(keyword, keywords),
    });
  }

  cachedTopics = Array.from(bySlug.values()).sort((a, b) =>
    a.keyword.localeCompare(b.keyword),
  );
  return cachedTopics;
}

export function getSeoTopicBySlug(slug: string): SeoTopic | undefined {
  return getAllSeoTopics().find((t) => t.slug === slug);
}

/** Brand names always surfaced on topic pages. */
export const TOPIC_BRAND_LINE = BRAND_KEYWORDS.slice(0, 4).join(" · ");

export function topicCount(): number {
  return getAllSeoTopics().length;
}
