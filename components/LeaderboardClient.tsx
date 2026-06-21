"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getGlobalLocalLeaderboard,
  type LocalLeaderboardEntry,
} from "@/lib/gameProgress";
import { useProgression } from "@/lib/progression/client";
import { COUNTRIES } from "@/lib/progression/countries";
import CountryFlag from "@/components/CountryFlag";

type BoardEntry = {
  rank: number;
  username: string;
  xp: number;
  level: number;
  countryCode: string;
  title: string;
};

type Scope = "global" | "weekly" | "monthly" | "country";

export default function LeaderboardClient() {
  const { state } = useProgression();
  const [scope, setScope] = useState<Scope>("global");
  const [remote, setRemote] = useState<BoardEntry[]>([]);
  const [local, setLocal] = useState<LocalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocal(getGlobalLocalLeaderboard(25));
    const params = new URLSearchParams({ scope, limit: "25" });
    if (scope === "country") params.set("country", state.countryCode);
    fetch(`/api/progression/leaderboard?${params}`)
      .then((r) => r.json())
      .then((data: { entries?: BoardEntry[] }) => {
        setRemote(data.entries ?? []);
      })
      .catch(() => setRemote([]))
      .finally(() => setLoading(false));
  }, [scope, state.countryCode]);

  const entries =
    remote.length > 0
      ? remote
      : local.map((e, i) => ({
          rank: i + 1,
          username: e.username,
          xp: e.score,
          level: Math.floor(e.score / 500) + 1,
          countryCode: state.countryCode,
          title: "Explorer",
        }));

  const tabs: { id: Scope; label: string }[] = [
    { id: "global", label: "All-time XP" },
    { id: "weekly", label: "This week" },
    { id: "monthly", label: "This month" },
    { id: "country", label: "My country" },
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
          {entries.map((e) => {
            const country = COUNTRIES.find((c) => c.code === e.countryCode);
            return (
              <li
                key={`${e.rank}-${e.username}`}
                className={`flex items-center gap-3 rounded-2xl border-4 border-ink px-4 py-3 shadow-[0_3px_0_0_#0d0d0d] ${
                  e.rank <= 3 ? "bg-lime/30" : "bg-white"
                }`}
              >
                <span className="w-8 font-display text-xl font-black text-ink/40">
                  #{e.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-extrabold text-ink">
                    {country && (
                      <CountryFlag code={country.code} width={22} />
                    )}
                    {e.username}
                  </p>
                  <p className="truncate text-xs font-bold text-ink/45">
                    Lv.{e.level} {e.title}
                  </p>
                </div>
                <span className="font-extrabold tabular-nums text-grass">
                  {e.xp.toLocaleString()} XP
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
