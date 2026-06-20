"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getActiveSessions,
  getGameHistory,
  getRecentCompleted,
  type GameHistoryEntry,
  type SavedGameSession,
} from "@/lib/gameProgress";
import { formatHistoryDate } from "@/lib/completeGame";

export default function ProfileClient() {
  const { user, isSignedIn } = useUser();
  const username =
    (user?.publicMetadata?.username as string | undefined) ?? "Player";
  const [active, setActive] = useState<SavedGameSession[]>([]);
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);

  useEffect(() => {
    setActive(getActiveSessions());
    setHistory(getGameHistory());
  }, []);

  const completed = getRecentCompleted(20);
  const totalScore = completed.reduce((s, g) => s + g.score, 0);
  const totalCorrect = completed.reduce((s, g) => s + g.correct, 0);
  const totalQuestions = completed.reduce((s, g) => s + g.total, 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 pb-4">
      <div>
        <h1 className="font-display text-4xl font-black text-ink">
          {isSignedIn ? `Hey, ${username}! 👋` : "My games"}
        </h1>
        <p className="mt-2 font-bold text-ink/60">
          Continue in-progress quizzes, revisit your history, and climb the
          leaderboard.
        </p>
      </div>

      {isSignedIn && completed.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Games played", value: String(completed.length) },
            { label: "Total points", value: totalScore.toLocaleString() },
            {
              label: "Accuracy",
              value:
                totalQuestions > 0
                  ? `${Math.round((totalCorrect / totalQuestions) * 100)}%`
                  : "—",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border-4 border-ink bg-white p-4 text-center shadow-[0_4px_0_0_#0d0d0d]"
            >
              <p className="font-display text-2xl font-extrabold text-grass">
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/45">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {active.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-black text-ink">▶ Continue playing</h2>
          <ul className="flex flex-col gap-3">
            {active.map((s) => (
              <li key={s.gameKey}>
                <Link
                  href={s.href}
                  className="flex items-center gap-4 rounded-2xl border-4 border-ink bg-lime/25 p-4 shadow-[0_4px_0_0_#0d0d0d] transition-transform hover:-translate-y-0.5"
                >
                  <span className="text-4xl">{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-ink">{s.title}</p>
                    <p className="text-sm font-semibold text-ink/55">
                      Question {s.index + 1} · {s.score.toLocaleString()} pts ·
                      updated {formatHistoryDate(s.updatedAt)}
                    </p>
                  </div>
                  <span className="rounded-full border-2 border-ink bg-grass px-3 py-1 text-xs font-extrabold text-white">
                    Continue
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xl font-black text-ink">📜 Game history</h2>
        {history.length === 0 ? (
          <div className="rounded-2xl border-4 border-dashed border-ink/20 p-10 text-center font-bold text-ink/50">
            No games yet —{" "}
            <Link href="/" className="text-grass hover:underline">
              play a quiz
            </Link>{" "}
            to start tracking!
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((h) => (
              <li key={h.id}>
                <Link
                  href={h.href}
                  className="flex items-center gap-3 rounded-xl border-2 border-ink/10 bg-white px-4 py-3 transition-colors hover:border-ink/30"
                >
                  <span className="text-2xl">{h.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold text-ink">{h.title}</p>
                    <p className="text-xs font-semibold text-ink/50">
                      {h.inProgress
                        ? "In progress"
                        : `${h.correct}/${h.total} correct · ${formatHistoryDate(h.completedAt)}`}
                    </p>
                  </div>
                  <span className="font-extrabold tabular-nums text-grass">
                    {h.score.toLocaleString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/leaderboard"
          className="rounded-full border-4 border-ink bg-grass px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_0_#0d0d0d]"
        >
          🏆 Leaderboard
        </Link>
        <Link
          href="/"
          className="rounded-full border-4 border-ink/20 px-5 py-2.5 text-sm font-extrabold text-ink/70 hover:border-ink hover:text-ink"
        >
          Browse quizzes
        </Link>
      </div>
    </div>
  );
}
