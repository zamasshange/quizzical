"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getGlobalLocalLeaderboard,
  type LocalLeaderboardEntry,
} from "@/lib/gameProgress";

type RemoteEntry = {
  username: string;
  title: string;
  score: number;
  correct: number;
  total: number;
  created_at: string;
};

export default function LeaderboardClient() {
  const [remote, setRemote] = useState<RemoteEntry[]>([]);
  const [local, setLocal] = useState<LocalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocal(getGlobalLocalLeaderboard(25));
    fetch("/api/scores?limit=25")
      .then((r) => r.json())
      .then((data: { entries?: RemoteEntry[] }) => {
        setRemote(data.entries ?? []);
      })
      .catch(() => setRemote([]))
      .finally(() => setLoading(false));
  }, []);

  const entries =
    remote.length > 0
      ? remote.map((e, i) => ({
          rank: i + 1,
          username: e.username,
          title: e.title,
          score: e.score,
          detail: `${e.correct}/${e.total}`,
        }))
      : local.map((e, i) => ({
          rank: i + 1,
          username: e.username,
          title: e.title,
          score: e.score,
          detail: `${e.correct}/${e.total}`,
        }));

  return (
    <div className="flex flex-col gap-4">
      {loading && (
        <p className="text-center text-sm font-bold text-ink/50">Loading scores…</p>
      )}

      {!loading && entries.length === 0 && (
        <div className="rounded-2xl border-4 border-dashed border-ink/20 p-10 text-center">
          <p className="font-extrabold text-ink/60">No scores yet!</p>
          <p className="mt-2 text-sm font-semibold text-ink/45">
            Finish a quiz to land on the board.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full border-4 border-ink bg-grass px-5 py-2 font-extrabold text-white shadow-[0_3px_0_0_#0d0d0d]"
          >
            Play now
          </Link>
        </div>
      )}

      {entries.length > 0 && (
        <ol className="flex flex-col gap-2">
          {entries.map((e) => (
            <li
              key={`${e.rank}-${e.username}-${e.title}`}
              className={`flex items-center gap-3 rounded-2xl border-4 border-ink px-4 py-3 shadow-[0_3px_0_0_#0d0d0d] ${
                e.rank <= 3 ? "bg-lime/30" : "bg-white"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cream font-display text-lg font-extrabold">
                {e.rank === 1 ? "🥇" : e.rank === 2 ? "🥈" : e.rank === 3 ? "🥉" : e.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-extrabold text-ink">{e.username}</p>
                <p className="truncate text-xs font-semibold text-ink/50">
                  {e.title} · {e.detail} correct
                </p>
              </div>
              <span className="font-display text-lg font-extrabold tabular-nums text-grass">
                {e.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      )}

      {remote.length === 0 && local.length > 0 && (
        <p className="text-center text-xs font-semibold text-ink/45">
          Showing scores on this device. Sign in + connect Supabase for a global
          leaderboard.
        </p>
      )}
    </div>
  );
}
