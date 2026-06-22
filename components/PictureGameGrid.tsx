"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { GameMode } from "@/lib/imageQuestions";
import { fadeUp, sectionViewport, staggerContainer } from "@/lib/motion";

const TEASERS: Record<string, string> = {
  celebrity: "Spot the star from a single photo",
  football: "Name the player before time runs out",
  basketball: "From courtside snaps to GOATs",
  cricket: "Legends from every format",
  athlete: "Olympians, F1, tennis & more",
  movie: "Poster, still, or scene — you guess",
  music: "Face the artist behind the hits",
};

const previewCache = new Map<string, string>();

async function fetchPreviewUrl(term: string): Promise<string | null> {
  const cached = previewCache.get(term);
  if (cached) return cached;

  try {
    const res = await fetch(`/api/quiz-image?term=${encodeURIComponent(term)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { image_url?: string | null };
    const url = data.image_url?.trim() || null;
    if (url) previewCache.set(term, url);
    return url;
  } catch {
    return null;
  }
}

function usePreviewImages(terms: string[]) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all(terms.map((t) => fetchPreviewUrl(t))).then((results) => {
      if (!cancelled) {
        setUrls(results.filter((u): u is string => !!u));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [terms.join("|")]);

  return urls;
}

function PhotoBackdrop({
  urls,
  color,
  emoji,
  featured,
  mosaic,
}: {
  urls: string[];
  color: string;
  emoji: string;
  featured?: boolean;
  mosaic?: boolean;
}) {
  const bottomFade =
    "pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/35 to-transparent";

  if (urls.length === 0) {
    return (
      <>
        <div className="absolute inset-0" style={{ backgroundColor: color }} />
        <div className="pointer-events-none absolute inset-0 bg-quiz-pattern opacity-[0.12]" />
        <span
          className={`pointer-events-none absolute -right-4 -top-6 select-none opacity-20 ${
            featured ? "text-[6rem]" : "text-[4rem]"
          }`}
          aria-hidden
        >
          {emoji}
        </span>
      </>
    );
  }

  if (mosaic && urls.length >= 2) {
    const [main, ...rest] = urls;
    return (
      <div className="absolute inset-0 bg-ink">
        <div className="grid h-full grid-cols-3 grid-rows-2 gap-px bg-ink/40">
          <div className="relative col-span-2 row-span-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={main}
              alt=""
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
          {rest.slice(0, 2).map((url, i) => (
            <div key={url + i} className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className={bottomFade} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={urls[0]}
        alt=""
        className="h-full w-full object-cover object-top"
        loading="lazy"
      />
      <div className={bottomFade} />
    </div>
  );
}

function PictureCard({
  mode,
  featured = false,
  className = "",
}: {
  mode: GameMode;
  featured?: boolean;
  className?: string;
}) {
  const teaser = mode.subtitle ?? TEASERS[mode.slug] ?? mode.defaultQuestion;
  const previewUrls = usePreviewImages(mode.previewTerms);
  const useMosaic = featured && previewUrls.length >= 2;

  return (
    <Link
      href={`/play/${mode.slug}`}
      className={`group block h-full transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_#0d0d0d] ${className}`}
    >
      <div
        className={`relative flex h-full min-h-[10rem] flex-col overflow-hidden rounded-2xl border-[3px] border-ink shadow-[0_4px_0_0_#0d0d0d] sm:min-h-[11rem] ${
          featured ? "sm:min-h-full" : ""
        }`}
        style={{
          backgroundColor: previewUrls.length > 0 ? "#0d0d0d" : mode.color,
        }}
      >
        <PhotoBackdrop
          urls={previewUrls}
          color={mode.color}
          emoji={mode.emoji}
          featured={featured}
          mosaic={useMosaic}
        />

        <div className="relative z-10 flex flex-1 flex-col p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full border-2 border-white/30 bg-black/40 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white backdrop-blur-sm sm:text-[10px]">
              Picture quiz
            </span>
            {previewUrls.length > 0 && (
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-ink sm:text-[10px]">
                Real photo
              </span>
            )}
          </div>

          <div className="mt-auto space-y-1">
            <p className="font-display text-lg font-black leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-xl">
              {mode.title}
            </p>
            <p className="line-clamp-2 text-[11px] font-bold leading-snug text-white/90 drop-shadow sm:text-xs">
              {teaser}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t-[3px] border-ink/40 bg-ink/90 px-3 py-2 text-white">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-white/70">
            {mode.defaultQuestion}
          </span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-ink sm:text-xs">
            Play →
          </span>
        </div>
      </div>
    </Link>
  );
}

type Props = {
  modes: GameMode[];
  variant?: "home" | "compact";
};

export default function PictureGameGrid({ modes, variant = "home" }: Props) {
  if (modes.length === 0) return null;

  const featured = modes.find((m) => m.slug === "celebrity") ?? modes[0];
  const rest = modes.filter((m) => m.slug !== featured.slug);
  const sports = rest.filter((m) => m.quizCategorySlug === "sports");
  const entertainment = rest.filter((m) => m.quizCategorySlug === "entertainment");

  if (variant === "compact") {
    return (
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
      >
        {modes.map((mode) => (
          <motion.div key={mode.slug} variants={fadeUp}>
            <PictureCard mode={mode} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={staggerContainer}
      className="relative"
    >
      <motion.div
        variants={fadeUp}
        className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-grass">
            Visual challenges
          </p>
          <h2 className="mt-1 font-display text-2xl font-black leading-tight text-ink md:text-3xl">
            Who&apos;s in the picture?
          </h2>
          <p className="mt-1.5 text-sm font-bold text-ink/60">
            Real photos of stars, athletes & films — one guess, then learn who
            they are after every round.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <span className="rounded-full border-2 border-ink bg-lime/40 px-3 py-1 text-xs font-extrabold text-ink">
            {modes.length} live modes
          </span>
          <span className="rounded-full border-2 border-ink/20 bg-white px-3 py-1 text-xs font-extrabold text-ink/60">
            Wikipedia & TMDB pics
          </span>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="w-[78vw] max-w-[20rem] shrink-0 snap-center">
          <PictureCard mode={featured} featured />
        </div>
        {rest.map((mode) => (
          <div
            key={mode.slug}
            className="w-[62vw] max-w-[16rem] shrink-0 snap-center"
          >
            <PictureCard mode={mode} />
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="hidden gap-2.5 md:grid md:grid-cols-4 md:grid-rows-3"
      >
        <motion.div variants={fadeUp} className="col-span-2 row-span-2">
          <PictureCard mode={featured} featured className="h-full min-h-[17rem]" />
        </motion.div>

        {sports.slice(0, 4).map((mode) => (
          <motion.div key={mode.slug} variants={fadeUp} className="col-span-1 row-span-1">
            <PictureCard mode={mode} />
          </motion.div>
        ))}

        {entertainment.map((mode) => (
          <motion.div key={mode.slug} variants={fadeUp} className="col-span-2 row-span-1">
            <PictureCard mode={mode} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-3 hidden flex-wrap gap-2 md:flex">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40">
          Sports
        </span>
        {sports.map((m) => (
          <Link
            key={m.slug}
            href={`/play/${m.slug}`}
            className="rounded-full border-2 border-ink/15 bg-white px-3 py-1 text-xs font-extrabold text-ink/75 transition-colors hover:border-ink hover:bg-lime/20"
          >
            {m.emoji} {m.title.replace("Guess the ", "")}
          </Link>
        ))}
        <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-ink/40">
          Entertainment
        </span>
        {entertainment.map((m) => (
          <Link
            key={m.slug}
            href={`/play/${m.slug}`}
            className="rounded-full border-2 border-ink/15 bg-white px-3 py-1 text-xs font-extrabold text-ink/75 transition-colors hover:border-ink hover:bg-lime/20"
          >
            {m.emoji} {m.title.replace("Guess the ", "")}
          </Link>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 bg-white/50 px-3 py-2.5"
      >
        <span className="text-sm text-ink/40" aria-hidden>
          ↓
        </span>
        <p className="text-center text-xs font-extrabold text-ink/50 sm:text-sm">
          AI quizzes, trivia rows & your progress hub below
        </p>
      </motion.div>
    </motion.section>
  );
}
