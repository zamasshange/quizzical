"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  getGlobalLocalLeaderboard,
  type LocalLeaderboardEntry,
} from "@/lib/gameProgress";
import { useProgression } from "@/lib/progression/client";
import { LeaderboardIdentity } from "@/components/platform/LeaderboardAvatar";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

type BoardEntry = {
  rank: number;
  username: string;
  avatarId: string | null;
  xp: number;
  level: number;
  countryCode: string;
  title: string;
};

type Scope = "global" | "weekly" | "monthly" | "country" | "category";

const CATEGORY_SCOPES = [
  { slug: "geography", label: "Geography" },
  { slug: "sports", label: "Sports" },
  { slug: "entertainment", label: "Movies" },
  { slug: "history", label: "History" },
  { slug: "science", label: "Science" },
] as const;

export default function LeaderboardClient() {
  const { state } = useProgression();
  const [scope, setScope] = useState<Scope>("global");
  const [category, setCategory] = useState<string>("geography");
  const [remote, setRemote] = useState<BoardEntry[]>([]);
  const [local, setLocal] = useState<LocalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setLocal(getGlobalLocalLeaderboard(25));
    const params = new URLSearchParams({ scope, limit: "25" });
    if (scope === "country") params.set("country", state.countryCode);
    if (scope === "category") params.set("category", category);
    try {
      const res = await fetch(`/api/progression/leaderboard?${params}`);
      const data = (await res.json()) as { entries?: BoardEntry[] };
      setRemote(data.entries ?? []);
    } catch {
      setRemote([]);
    } finally {
      setLoading(false);
    }
  }, [scope, state.countryCode, category]);

  useEffect(() => {
    void loadBoard();
    const poll = setInterval(() => void loadBoard(), 30000);

    const sb = getSupabaseBrowser();
    if (!sb) return () => clearInterval(poll);

    const channel = sb
      .channel("leaderboard_pulse")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_progress" },
        () => void loadBoard(),
      )
      .subscribe();

    return () => {
      clearInterval(poll);
      void sb.removeChannel(channel);
    };
  }, [loadBoard]);

  const entries =
    remote.length > 0
      ? remote
      : local.map((e, i) => ({
          rank: i + 1,
          username: e.username,
          avatarId: null,
          xp: e.score,
          level: Math.floor(e.score / 500) + 1,
          countryCode: state.countryCode,
          title: "Explorer",
        }));

  const tabs: { id: Scope; label: string }[] = [
    { id: "global", label: "Global" },
    { id: "weekly", label: "This week" },
    { id: "monthly", label: "This month" },
    { id: "country", label: "My country" },
    { id: "category", label: "By category" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setLoading(true);
              setScope(t.id);
            }}
            className={`rounded-full border-2 px-3 py-1 text-xs font-extrabold ${
              scope === t.id
                ? "border-ink bg-grass text-white"
                : "border-ink/20 bg-white text-ink/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {scope === "category" && (
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_SCOPES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => {
                setLoading(true);
                setCategory(c.slug);
              }}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${
                category === c.slug
                  ? "border-ink bg-lime/40 text-ink"
                  : "border-ink/15 text-ink/50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-cream-dark" />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="rounded-2xl border-4 border-dashed border-ink/20 p-10 text-center">
          <p className="font-extrabold text-ink/60">No rankings yet!</p>
          <p className="mt-2 text-sm font-semibold text-ink/45">
            Play quizzes to earn XP and climb the board.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full border-4 border-ink bg-grass px-5 py-2 font-extrabold text-white shadow-[0_3px_0_0_#0d0d0d]"
          >
            Start exploring
          </Link>
        </div>
      )}

      {entries.length > 0 && (
        <ol className="flex flex-col gap-2">
          {entries.map((e) => (
            <li
              key={`${e.rank}-${e.username}`}
              className={`flex items-center gap-3 rounded-2xl border-4 border-ink px-4 py-3 shadow-[0_3px_0_0_#0d0d0d] ${
                e.rank <= 3 ? "bg-lime/30" : "bg-white"
              }`}
            >
              <span className="w-8 font-display text-xl font-black text-ink/40">
                #{e.rank}
              </span>
              <LeaderboardIdentity
                username={e.username}
                avatarId={e.avatarId}
                countryCode={e.countryCode}
              />
              <div className="text-right">
                <span className="block font-extrabold tabular-nums text-grass">
                  {e.xp.toLocaleString()} XP
                </span>
                <span className="text-[10px] font-bold text-ink/40">
                  Lv.{e.level}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
