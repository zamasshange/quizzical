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

  return (
    <Link
      href={`/play/${mode.slug}`}
      className="group block w-[10.5rem] shrink-0 snap-start sm:w-[11.5rem] md:w-[12.5rem]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-[2.5px] border-ink bg-ink shadow-[0_3px_0_0_#0d0d0d] transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[0_5px_0_0_#0d0d0d]">
        {previewUrl ? (
          <ContainedPhoto
            src={previewUrl}
            alt={`${mode.title} preview`}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
            style={{ backgroundColor: mode.color }}
          >
            <AppIcon name={icon} size={28} className="text-white/90" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink via-ink/75 to-transparent px-2.5 pb-2.5 pt-12">
          <p className="text-[9px] font-extrabold uppercase tracking-wide text-lime/90">
            Picture quiz
          </p>
          <h3 className="mt-0.5 font-display text-sm font-black leading-tight text-white">
            {label}
          </h3>
          <span className="mt-1.5 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-sm transition-colors group-hover:border-lime/50 group-hover:bg-grass group-hover:text-white">
            Play →
          </span>
        </div>
      </div>
    </Link>
  );
}

function FilmStripRow({
  label,
  modes,
}: {
  label: string;
  modes: GameMode[];
}) {
  if (modes.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wide text-ink/45">
          {label}
        </h3>
        <span className="hidden text-[10px] font-bold text-ink/30 sm:inline">
          Scroll →
        </span>
      </div>
      <div className="relative -mx-4 sm:-mx-0">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-cream to-transparent sm:w-10" />
        <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 snap-x snap-mandatory [scrollbar-width:none] sm:gap-3 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {modes.map((mode) => (
            <motion.div key={mode.slug} variants={fadeUp}>
              <PictureCard mode={mode} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Props = {
  modes: GameMode[];
  variant?: "home" | "compact";
};

export default function PictureGameGrid({ modes, variant = "home" }: Props) {
  if (modes.length === 0) return null;

  const sports = modes.filter((m) => m.quizCategorySlug === "sports");
  const entertainment = modes.filter((m) => m.quizCategorySlug === "entertainment");

  if (variant === "compact") {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
      >
        <FilmStripRow label="All modes" modes={modes} />
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
      <motion.div variants={fadeUp} className="mb-4 md:mb-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-grass">
          Picture quizzes
        </p>
        <h2 className="mt-1 font-display text-xl font-black leading-tight text-ink md:text-2xl">
          Who&apos;s in the photo?
        </h2>
        <p className="mt-1.5 max-w-xl text-sm font-bold text-ink/55">
          Swipe through real photos — guess the name, unlock the full profile
          after every round.
        </p>
      </motion.div>

      <motion.div variants={staggerContainer} className="flex flex-col gap-5">
        <motion.div variants={fadeUp}>
          <FilmStripRow label="Entertainment" modes={entertainment} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <FilmStripRow label="Sports" modes={sports} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
