import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import AiHeroCard from "@/components/AiHeroCard";
import HeroSearch from "@/components/HeroSearch";
import QuizRow from "@/components/QuizRow";
import Footer from "@/components/Footer";
import {
  homeRows,
  categories,
  quizzes,
} from "@/lib/quizzes";
import { IMAGE_GAME_MODES } from "@/lib/imageQuestions";
import PictureGameGrid from "@/components/PictureGameGrid";
import HomeGameHub from "@/components/HomeGameHub";
import ExplorerHub from "@/components/progression/ExplorerHub";
import JsonLd from "@/components/JsonLd";
import { homeMetadata, SITE_TAGLINE } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seoStructuredData";

export const metadata: Metadata = homeMetadata();

const TRENDING = [
  { label: "World Capitals", href: "/quiz/world-capitals" },
  { label: "Movie Mania", href: "/quiz/movie-mania" },
  { label: "Animal Kingdom", href: "/quiz/animal-kingdom" },
  { label: "World War II", href: "/quiz/world-war-two" },
];

export default function Home() {
  return (
    <div className="relative z-0 flex flex-auto flex-col">
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <Navbar />

      <div className="pointer-events-none absolute inset-0 top-0 z-0 bg-quiz-pattern opacity-[0.05]" />

      <main className="custom-container relative z-10 flex-1 px-4 pb-4 sm:px-6 md:px-8 lg:px-12">
        {/* Category navigation */}
        <div className="py-4 md:py-6">
          <CategoryNav />
        </div>

        {/* Hero — compact on mobile so quizzes sit above the fold */}
        <section className="relative overflow-hidden rounded-3xl border-4 border-ink bg-petrol shadow-[0_6px_0_0_#0d0d0d]">
          <div className="pointer-events-none absolute inset-0 bg-quiz-pattern opacity-[0.08]" />
          {/* Floating decorative stickers — desktop only */}
          <span aria-hidden className="pointer-events-none absolute right-[42%] top-6 hidden rotate-12 text-4xl opacity-25 md:block">🎯</span>
          <span aria-hidden className="pointer-events-none absolute bottom-6 left-[8%] hidden -rotate-12 text-4xl opacity-20 lg:block">🧠</span>
          <span aria-hidden className="pointer-events-none absolute right-[2%] top-1/2 hidden rotate-6 text-5xl opacity-20 lg:block">🏆</span>
          <div className="relative grid gap-4 p-4 md:grid-cols-[1.15fr_0.85fr] md:items-stretch md:gap-8 md:p-10">
            <div className="flex flex-col items-start gap-3 md:gap-4">
              <span className="rounded-full border-2 border-ink bg-lime px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                100% free · no sign-up
              </span>
              <h1 className="font-display text-3xl font-black leading-[1.05] text-cream md:text-5xl">
                Quizzical.
                <br className="hidden md:block" />
                <span className="text-sky"> Become a Knowledge Explorer.</span>
              </h1>
              <p className="hidden max-w-md text-base font-bold text-cream/70 md:block">
                Learn, discover, compete, and level up across hundreds of quiz
                categories. Track your growth, collect discoveries, and climb
                global leaderboards.
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
                {TRENDING.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="rounded-full border-2 border-cream/20 bg-white/5 px-3 py-1 text-xs font-extrabold text-cream/80 transition-colors hover:border-cream hover:text-cream"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
              <div className="hidden flex-wrap items-center gap-x-5 gap-y-1 pt-2 text-sm font-extrabold text-cream/60 md:flex">
                <span>
                  <span className="text-cream">{quizzes.length}</span> quizzes
                </span>
                <span>
                  <span className="text-cream">{categories.length}</span>{" "}
                  categories
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

            <AiHeroCard className="hidden md:flex" />
          </div>
        </section>

        {/* Picture guessing games */}
        <section id="picture-games" className="mt-5 scroll-mt-24 md:mt-7">
          <div className="mb-3 flex items-baseline gap-2">
            <h2 className="text-2xl font-black text-ink">
              🖼️ Picture guessing games
            </h2>
          </div>
          <PictureGameGrid modes={IMAGE_GAME_MODES} />
        </section>

        <HomeGameHub />

        <ExplorerHub />

        {/* Curated quiz rows — full category lists live on /[category] via nav above */}
        {homeRows.map((row) => (
          <QuizRow key={row.title} title={row.title} quizzes={row.quizzes} />
        ))}
      </main>

      <Footer />
    </div>
  );
}
