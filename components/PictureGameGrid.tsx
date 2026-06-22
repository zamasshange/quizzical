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

const TEASERS: Record<string, string> = {
  celebrity: "Hollywood, music & pop culture — name the face",
  football: "Global soccer stars from real match photos",
  basketball: "NBA legends and rising stars",
  cricket: "International cricket heroes",
  athlete: "Olympians, F1, tennis & more",
  movie: "Posters, stills & iconic scenes",
  music: "Pop, hip-hop, rock & global artists",
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

function PictureCard({ mode }: { mode: GameMode }) {
  const previewUrl = usePreviewImage(mode.previewTerms);
  const icon = MODE_ICONS[mode.slug] ?? "sparkles";
  const teaser = mode.subtitle ?? TEASERS[mode.slug] ?? mode.defaultQuestion;
  const group =
    mode.quizCategorySlug === "sports" ? "Sports" : "Entertainment";

  return (
    <Link
      href={`/play/${mode.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-[0_4px_0_0_#0d0d0d] transition-transform hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#0d0d0d]"
    >
      <div className="relative aspect-[5/4] w-full shrink-0">
        {previewUrl ? (
          <ContainedPhoto
            src={previewUrl}
            alt={`${mode.title} preview`}
            className="h-full w-full"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2"
            style={{ backgroundColor: mode.color }}
          >
            <AppIcon name={icon} size={40} className="text-white/90" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/70">
              Loading preview…
            </span>
          </div>
        )}
        <span className="absolute left-2 top-2 z-20 rounded-full border-2 border-ink/30 bg-black/50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white backdrop-blur-sm">
          {group}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-grass">
            Picture quiz
          </p>
          <h3 className="mt-0.5 font-display text-base font-black leading-tight text-ink sm:text-lg">
            {mode.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-ink/60">
            {teaser}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink/10 pt-2">
          <span className="text-[10px] font-bold text-ink/45">
            {mode.defaultQuestion}
          </span>
          <span className="rounded-full border-2 border-ink bg-grass px-3 py-1 text-[10px] font-extrabold text-white sm:text-xs">
            Play →
          </span>
        </div>
      </div>
    </Link>
  );
}

function ModeGroup({
  label,
  modes,
}: {
  label: string;
  modes: GameMode[];
}) {
  if (modes.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink/45">
        {label}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modes.map((mode) => (
          <motion.div key={mode.slug} variants={fadeUp}>
            <PictureCard mode={mode} />
          </motion.div>
        ))}
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
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
      <motion.div variants={fadeUp} className="mb-5 md:mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-grass">
          Picture quizzes
        </p>
        <h2 className="mt-1 font-display text-2xl font-black leading-tight text-ink md:text-3xl">
          Who&apos;s in the photo?
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-ink/60">
          Real photos of celebrities, athletes, and films. Guess the name, then
          unlock a full profile with stats and facts after every round.
        </p>
      </motion.div>

      <motion.div variants={staggerContainer} className="flex flex-col gap-8">
        <motion.div variants={fadeUp}>
          <ModeGroup label="Entertainment" modes={entertainment} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ModeGroup label="Sports" modes={sports} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
