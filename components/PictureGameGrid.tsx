"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppIcon, { type AppIconName } from "@/components/icons/AppIcon";
import ContainedPhoto from "@/components/media/ContainedPhoto";
import type { GameMode } from "@/lib/imageQuestions";
import { fadeUp, sectionViewport, staggerContainer } from "@/lib/motion";

const MODE_ICONS: Record<string, AppIconName> = {
  celebrity: "movie",
  football: "medal",
  basketball: "medal",
  cricket: "medal",
  athlete: "award",
  movie: "movie",
  music: "sparkles",
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

function usePreviewImage(terms: string[]) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const term of terms) {
        const found = await fetchPreviewUrl(term);
        if (found && !cancelled) {
          setUrl(found);
          return;
        }
      }
      if (!cancelled) setUrl(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [terms.join("|")]);

  return url;
}

function shortTitle(title: string) {
  return title.replace(/^Guess the /i, "");
}

function PictureCard({ mode }: { mode: GameMode }) {
  const previewUrl = usePreviewImage(mode.previewTerms);
  const icon = MODE_ICONS[mode.slug] ?? "sparkles";
  const label = shortTitle(mode.title);
  const group =
    mode.quizCategorySlug === "sports" ? "Sports" : "Entertainment";

  return (
    <Link
      href={`/play/${mode.slug}`}
      className="group block w-[8.75rem] shrink-0 snap-start sm:w-[9.5rem] md:w-[10.25rem]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border-[2.5px] border-ink bg-ink shadow-[0_3px_0_0_#0d0d0d] transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[0_5px_0_0_#0d0d0d]">
        {previewUrl ? (
          <ContainedPhoto
            src={previewUrl}
            alt={`${mode.title} preview`}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: mode.color }}
          >
            <AppIcon name={icon} size={24} className="text-white/90" />
          </div>
        )}

        <span className="absolute left-1.5 top-1.5 z-20 rounded-full border border-white/20 bg-black/45 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white backdrop-blur-sm">
          {group}
        </span>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink via-ink/70 to-transparent px-2 pb-2 pt-10">
          <h3 className="font-display text-xs font-black leading-tight text-white sm:text-sm">
            {label}
          </h3>
          <span className="mt-1 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-1.5 py-px text-[8px] font-extrabold text-white backdrop-blur-sm transition-colors group-hover:bg-grass sm:text-[9px]">
            Play →
          </span>
        </div>
      </div>
    </Link>
  );
}

function FilmStrip({ modes }: { modes: GameMode[] }) {
  if (modes.length === 0) return null;

  return (
    <div className="relative -mx-4 sm:-mx-0">
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-cream to-transparent sm:w-10" />
      <div className="flex gap-2 overflow-x-auto px-4 pb-0.5 snap-x snap-mandatory [scrollbar-width:none] sm:gap-2.5 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {modes.map((mode) => (
          <motion.div key={mode.slug} variants={fadeUp}>
            <PictureCard mode={mode} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Entertainment first, then sports — single scroll row. */
function orderModes(modes: GameMode[]) {
  const entertainment = modes.filter(
    (m) => m.quizCategorySlug === "entertainment",
  );
  const sports = modes.filter((m) => m.quizCategorySlug === "sports");
  return [...entertainment, ...sports];
}

type Props = {
  modes: GameMode[];
  variant?: "home" | "compact";
};

export default function PictureGameGrid({ modes, variant = "home" }: Props) {
  if (modes.length === 0) return null;

  const ordered = orderModes(modes);

  if (variant === "compact") {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
      >
        <FilmStrip modes={ordered} />
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
        className="mb-2.5 flex items-end justify-between gap-3"
      >
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-grass">
            Picture quizzes
          </p>
          <h2 className="font-display text-lg font-black leading-tight text-ink md:text-xl">
            Who&apos;s in the photo?
          </h2>
        </div>
        <span className="shrink-0 pb-0.5 text-[10px] font-bold text-ink/30">
          Scroll →
        </span>
      </motion.div>

      <motion.div variants={fadeUp}>
        <FilmStrip modes={ordered} />
      </motion.div>
    </motion.section>
  );
}
