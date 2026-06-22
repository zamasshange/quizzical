"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  type LeaderboardEntry,
} from "@/lib/progression/leaderboard";
import { LeaderboardIdentity } from "@/components/platform/LeaderboardAvatar";
import AppIcon from "@/components/icons/AppIcon";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

/** Homepage widget — top 5 global XP players with live updates. */
export default function TopPlayersWidget() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/progression/leaderboard?scope=global&limit=5");
      const data = (await res.json()) as { entries?: LeaderboardEntry[] };
      setPlayers(data.entries ?? []);
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const poll = setInterval(() => void load(), 30000);

    const sb = getSupabaseBrowser();
    if (!sb) return () => clearInterval(poll);

    const channel = sb
      .channel("top_players")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_progress" },
        () => void load(),
      )
      .subscribe();

    return () => {
      clearInterval(poll);
      void sb.removeChannel(channel);
    };
  }, [load]);

  if (loading) {
    return (
      <section className="mt-5 md:mt-7">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-ink md:text-xl">
          <AppIcon name="trophy" size={22} className="text-grass" />
          Top players
        </h2>
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-2xl bg-cream-dark" />
          ))}
        </div>
      </section>
    );
  }

  if (players.length === 0) return null;

  return (
    <section className="mt-5 md:mt-7">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-black text-ink md:text-xl">
          <AppIcon name="trophy" size={22} className="text-grass" />
          Top players
        </h2>
        <Link
          href="/leaderboard"
          className="text-xs font-extrabold text-grass underline"
        >
          Full leaderboard
        </Link>
      </div>
      <ol className="flex flex-col gap-2">
        {players.map((p) => (
          <li key={p.username}>
            <Link
              href={`/profile/${encodeURIComponent(p.username)}`}
              className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-white px-3 py-2.5 shadow-[0_3px_0_0_#0d0d0d] transition hover:bg-lime/10"
            >
              <span className="w-6 font-display text-lg font-black text-ink/35">
                #{p.rank}
              </span>
              <LeaderboardIdentity
                username={p.username}
                avatarId={p.avatarId}
                countryCode={p.countryCode}
                countryName={p.countryName}
              />
              <span className="shrink-0 font-extrabold tabular-nums text-grass">
                {p.xp.toLocaleString()} XP
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
