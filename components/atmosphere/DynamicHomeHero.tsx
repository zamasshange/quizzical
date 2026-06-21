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
  "Compete. Collect. Conquer trivia.",
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
      <CategoryBackground categorySlug="home" showParticles>
        <div className="pointer-events-none absolute inset-0 bg-quiz-pattern opacity-[0.08]" />

        <div className="relative grid gap-4 p-4 md:grid-cols-[1.15fr_0.85fr] md:items-stretch md:gap-8 md:p-10">
          <div className="flex flex-col items-start gap-3 md:gap-4">
            <SeasonalBanner className="pointer-events-auto w-full max-w-md" />

            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-full border-2 border-ink bg-lime px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink"
            >
              100% free · no sign-up
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-3xl font-black leading-[1.05] text-cream md:text-5xl"
            >
              Quizzical.
              <br className="hidden md:block" />
              <motion.span
                key={tagline}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sky"
              >
                {" "}
                {tagline}
              </motion.span>
            </motion.h1>

            {loaded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-2xl border-2 border-cream/25 bg-white/10 p-3 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-cream/60">
                    Level {state.level} · {state.title}
                  </p>
                  <p className="text-xs font-extrabold text-sky">
                    {state.xp.toLocaleString()} XP
                  </p>
                </div>
                {xpBar && (
                  <div className="mt-2 h-2 overflow-hidden rounded-full border border-cream/30 bg-ink/20">
                    <motion.div
                      className="h-full bg-sky"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpBar.progress * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                )}
                <p className="mt-1.5 text-[10px] font-bold text-cream/50">
                  🔥 {state.currentStreak} day streak · 🔍 {state.discoveryCount}{" "}
                  discoveries
                </p>
              </motion.div>
            )}

            <p className="hidden max-w-md text-base font-bold text-cream/70 md:block">
              Learn, discover, compete, and level up across hundreds of quiz
              categories. Track your growth, collect discoveries, and climb global
              leaderboards.
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
                <MicroFloat key={t.href} delay={i * 0.2} y={3}>
                  <Link
                    href={t.href}
                    className="rounded-full border-2 border-cream/20 bg-white/5 px-3 py-1 text-xs font-extrabold text-cream/80 transition-colors hover:border-cream hover:text-cream"
                  >
                    {t.label}
                  </Link>
                </MicroFloat>
              ))}
            </div>

            <div className="hidden flex-wrap items-center gap-x-5 gap-y-1 pt-2 text-sm font-extrabold text-cream/60 md:flex">
              <span>
                <span className="text-cream">{quizzes.length}</span> quizzes
              </span>
              <span>
                <span className="text-cream">{categories.length}</span> categories
              </span>
              <span>
                <span className="text-cream">No ads</span> while you play
              </span>
            </div>

            <a
              href="#picture-games"
              className="text-xs font-extrabold text-cream/50 underline-offset-2 hover:text-cream hover:underline md:hidden"
            >
              ↓ Browse picture games
            </a>
          </div>

          <MicroFloat delay={0.4} y={5} className="hidden md:flex">
            <AiHeroCard className="flex" />
          </MicroFloat>
        </div>
      </CategoryBackground>
    </section>
  );
}
