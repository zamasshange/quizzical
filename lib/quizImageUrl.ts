/** Smaller/faster image URLs for in-quiz display (Wikipedia + TMDB). */

const WIKI_THUMB_PX = 480;
const TMDB_QUIZ_BACKDROP = "w780";
const TMDB_QUIZ_POSTER = "w342";

export function optimizeQuizImageUrl(url: string): string {
  if (!url) return url;

  if (url.includes("upload.wikimedia.org")) {
    if (url.includes("/thumb/")) {
      return url.replace(/\/(\d+)px-/g, `/${WIKI_THUMB_PX}px-`);
    }
    return url;
  }

  if (url.includes("image.tmdb.org")) {
    return url
      .replace("/w1280/", `/${TMDB_QUIZ_BACKDROP}/`)
      .replace("/w500/", `/${TMDB_QUIZ_POSTER}/`);
  }

  return url;
}

/** Browser-side preload — resolves when all URLs have loaded or failed. */
export function prefetchImages(urls: string[]): Promise<void> {
  const unique = [...new Set(urls.map((u) => optimizeQuizImageUrl(u)).filter(Boolean))];
  if (unique.length === 0) return Promise.resolve();

  return Promise.all(
    unique.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }),
    ),
  ).then(() => undefined);
}

/** Preload the next few questions while the player is on the current one. */
export function prefetchUpcoming(
  questions: { image_url: string; reveal_image_url?: string }[],
  fromIndex: number,
  count = 3,
): void {
  const slice = questions.slice(fromIndex, fromIndex + count);
  const urls = slice.flatMap((q) =>
    [q.image_url, q.reveal_image_url].filter((u): u is string => !!u),
  );
  void prefetchImages(urls);
}
