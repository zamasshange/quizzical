import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import LeaderboardClient from "@/components/LeaderboardClient";
import { buildMetadata } from "@/lib/seo";
import { BASE_KEYWORDS } from "@/lib/seoKeywords";

export const metadata: Metadata = buildMetadata({
  title: "Leaderboard",
  description:
    "Top scores on Quizzical — compete on trivia quizzes and picture games. Sign in to save your scores globally.",
  path: "/leaderboard",
  keywords: [...BASE_KEYWORDS, "quiz leaderboard", "high scores", "top players"],
});

export default function LeaderboardPage() {
  return (
    <SiteShell showCategories={false}>
      <div className="mx-auto max-w-3xl pb-4">
        <h1 className="font-display text-4xl font-black text-ink">🏆 Leaderboard</h1>
        <p className="mt-2 font-bold text-ink/60">
          Top scores across Quizzical. Sign in to appear on the global board when
          Supabase is connected.
        </p>
        <div className="mt-6">
          <LeaderboardClient />
        </div>
      </div>

    </SiteShell>
  );
}
