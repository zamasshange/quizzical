"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";
import HeroSearch from "@/components/HeroSearch";
import AiHeroCard from "@/components/AiHeroCard";
import CategoryBackground from "@/components/atmosphere/CategoryBackground";
import MicroFloat from "@/components/atmosphere/MicroFloat";
import SeasonalBanner from "@/components/atmosphere/SeasonalBanner";
import { useProgression } from "@/lib/progression/client";
import { xpToNextLevel } from "@/lib/progression/xp";
import { categories, quizzes } from "@/lib/quizzes";

const TAGLINES = [
  "Become a Knowledge Explorer.",
  "Learn. Discover. Level Up.",
  "Every answer unlocks something new.",
];

const TRENDING = [
  { label: "World Capitals", href: "/quiz/world-capitals" },
  { label: "Movie Mania", href: "/quiz/movie-mania" },
  { label: "Animal Kingdom", href: "/quiz/animal-kingdom" },
  { label: "World War II", href: "/quiz/world-war-two" },
];

export default function DynamicHomeHero() {
  const { state, loaded } = useProgression();
  const tagline = TAGLINES[new Date().getDate() % TAGLINES.length];
  const xpBar = loaded ? xpToNextLevel(state.xp) : null;

  return (
    <section className="relative overflow-hidden rounded-3xl border-4 border-ink bg-petrol shadow-[0_6px_0_0_#0d0d0d]">
      <CategoryBackground categorySlug="home" showParticles={false}>
        <div className="pointer-events-none absolute inset-0 bg-quiz-pattern opacity-[0.08]" />

        <div className="relative grid gap-5 p-4 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-6 md:p-8">
          <div className="flex flex-col items-start gap-3">
            <SeasonalBanner className="pointer-events-auto w-full max-w-md" />

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border-2 border-ink bg-lime px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                100% free · no sign-up
              </span>
              {loaded && (
                <span className="rounded-full border-2 border-cream/25 bg-white/10 px-3 py-1 text-xs font-extrabold text-cream/80">
                  Lv.{state.level} · {state.xp.toLocaleString()} XP · 🔥 {state.currentStreak}d
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl font-black leading-[1.05] text-cream md:text-4xl lg:text-5xl">
              Quizzical.
              <span className="text-sky"> {tagline}</span>
            </h1>

            {loaded && xpBar && (
              <div className="w-full max-w-md">
                <div className="h-1.5 overflow-hidden rounded-full border border-cream/25 bg-ink/20">
                  <motion.div
                    className="h-full bg-sky"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpBar.progress * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            <p className="max-w-md text-sm font-bold text-cream/70 md:text-base">
              Hundreds of free quiz games — play instantly, learn after every answer.
            </p>

            <div className="w-full max-w-lg">
              <Suspense fallback={null}>
                <HeroSearch />
              </Suspense>
            </div>

            <Link
              href="/ai"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-grass px-4 py-2 text-sm font-extrabold text-white shadow-[0_3px_0_0_#0d0d0d] transition-transform hover:-translate-y-0.5 md:hidden"
            >
              ✨ AI Quiz Generator →
            </Link>

            <div className="hidden flex-wrap items-center gap-2 md:flex">
              <span className="text-xs font-extrabold uppercase tracking-wide text-cream/50">
                Trending
              </span>
              {TRENDING.map((t, i) => (
                <MicroFloat key={t.href} delay={i * 0.15} y={2}>
                  <Link
                    href={t.href}
                    className="rounded-full border-2 border-cream/20 bg-white/5 px-3 py-1 text-xs font-extrabold text-cream/80 transition-colors hover:border-cream hover:text-cream"
                  >
                    {t.label}
                  </Link>
                </MicroFloat>
              ))}
            </div>

            <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 text-xs font-extrabold text-cream/55 md:flex">
              <span>
                <span className="text-cream">{quizzes.length}</span> quizzes
              </span>
              <span>
                <span className="text-cream">{categories.length}</span> categories
              </span>
              <span>
                <span className="text-cream">No ads</span>
              </span>
            </div>

            <a
              href="#picture-games"
              className="text-xs font-extrabold text-cream/50 underline-offset-2 hover:text-cream hover:underline md:hidden"
            >
              ↓ Browse picture games
            </a>
          </div>

          <div className="hidden md:block">
            <AiHeroCard />
          </div>
        </div>
      </CategoryBackground>
    </section>
  );
}
