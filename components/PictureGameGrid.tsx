"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { GameMode } from "@/lib/imageQuestions";
import {
  cardHover,
  defaultTransition,
  fadeUp,
  sectionViewport,
  staggerContainer,
} from "@/lib/motion";

const TEASERS: Record<string, string> = {
  celebrity: "Spot the star from a single photo",
  football: "Name the player before time runs out",
  basketball: "From courtside snaps to GOATs",
  cricket: "Legends from every format",
  athlete: "Olympians, F1, tennis & more",
  movie: "Poster, still, or scene — you guess",
  music: "Face the artist behind the hits",
};

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

  return (
    <Link
      href={`/play/${mode.slug}`}
      className={`group block h-full ${className}`}
    >
      <motion.div
        className={`relative flex h-full min-h-[9.5rem] flex-col overflow-hidden rounded-2xl border-[3px] border-ink shadow-[0_5px_0_0_#0d0d0d] sm:min-h-[10.5rem] ${
          featured ? "sm:min-h-full" : ""
        }`}
        style={{ backgroundColor: mode.color }}
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={defaultTransition}
      >
        <div className="pointer-events-none absolute inset-0 bg-quiz-pattern opacity-[0.14]" />
        <div
          className="pointer-events-none absolute -right-6 -top-8 select-none opacity-[0.18] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          aria-hidden
        >
          <span className={featured ? "text-[7rem] sm:text-[9rem]" : "text-[5rem] sm:text-[6rem]"}>
            {mode.emoji}
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full border-2 border-ink/30 bg-white/90 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-ink sm:text-[10px]">
              Picture quiz
            </span>
            <span className="rounded-full bg-ink/90 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100 sm:text-[10px]">
              Live
            </span>
          </div>

          <div className="mt-auto space-y-1">
            <p className="font-display text-lg font-black leading-tight text-white drop-shadow-[0_2px_0_rgba(13,13,13,0.35)] sm:text-xl">
              {mode.title}
            </p>
            <p className="line-clamp-2 text-[11px] font-bold leading-snug text-white/85 sm:text-xs">
              {teaser}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t-[3px] border-ink/25 bg-ink/90 px-3 py-2 text-white">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-white/70">
            {mode.defaultQuestion}
          </span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-ink transition-transform group-hover:scale-105 sm:text-xs">
            Play →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

type Props = {
  modes: GameMode[];
  /** Homepage gets the full bento + scroll teaser; category pages stay tighter. */
  variant?: "home" | "compact";
};

export default function PictureGameGrid({ modes, variant = "home" }: Props) {
  if (modes.length === 0) return null;

  const featured =
    modes.find((m) => m.slug === "celebrity") ?? modes[0];
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
      {/* Section hook */}
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
            Real photos. One guess. Learn who they are after every round — no
            two games feel the same.
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

      {/* Mobile: snap carousel with featured lead */}
      <motion.div variants={fadeUp} className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-[78vw] max-w-[20rem] shrink-0 snap-center">
          <PictureCard mode={featured} featured />
        </div>
        {rest.map((mode) => (
          <div key={mode.slug} className="w-[62vw] max-w-[16rem] shrink-0 snap-center">
            <PictureCard mode={mode} />
          </div>
        ))}
      </motion.div>

      {/* Desktop: bento board */}
      <motion.div
        variants={staggerContainer}
        className="hidden gap-3 md:grid md:grid-cols-4 md:grid-rows-3 md:auto-rows-fr"
      >
        <motion.div variants={fadeUp} className="col-span-2 row-span-2">
          <PictureCard mode={featured} featured className="h-full min-h-[18rem]" />
        </motion.div>

        {sports.slice(0, 4).map((mode, i) => (
          <motion.div
            key={mode.slug}
            variants={fadeUp}
            className={i < 2 ? "col-span-1 row-span-1" : "col-span-1 row-span-1"}
          >
            <PictureCard mode={mode} />
          </motion.div>
        ))}

        {entertainment.map((mode) => (
          <motion.div key={mode.slug} variants={fadeUp} className="col-span-2 row-span-1">
            <PictureCard mode={mode} />
          </motion.div>
        ))}
      </motion.div>

      {/* Category lanes — quick scan */}
      <motion.div
        variants={fadeUp}
        className="mt-4 hidden flex-wrap gap-2 md:flex"
      >
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

      {/* Scroll cue */}
      <motion.div
        variants={fadeUp}
        className="mt-5 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink/20 bg-white/60 px-4 py-3"
      >
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="text-lg"
          aria-hidden
        >
          ↓
        </motion.span>
        <p className="text-center text-sm font-extrabold text-ink/55">
          AI quizzes, trivia rows & your progress hub below
        </p>
      </motion.div>
    </motion.section>
  );
}
