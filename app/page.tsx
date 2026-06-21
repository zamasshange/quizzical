import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import DynamicHomeHero from "@/components/atmosphere/DynamicHomeHero";
import QuizRow from "@/components/QuizRow";
import Footer from "@/components/Footer";
import { homeRows } from "@/lib/quizzes";
import { IMAGE_GAME_MODES } from "@/lib/imageQuestions";
import PictureGameGrid from "@/components/PictureGameGrid";
import HomeGameHub from "@/components/HomeGameHub";
import ExplorerHub from "@/components/progression/ExplorerHub";
import JsonLd from "@/components/JsonLd";
import { homeMetadata } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seoStructuredData";

export const metadata: Metadata = homeMetadata();

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

        <DynamicHomeHero />

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
