"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  getActiveSessions,
  getRecentCompleted,
  type GameHistoryEntry,
  type SavedGameSession,
} from "@/lib/gameProgress";
import { formatHistoryDate } from "@/lib/completeGame";
import { fadeUp, sectionViewport, staggerContainer } from "@/lib/motion";

export default function HomeGameHub() {
  const { isSignedIn } = useUser();
  const [active, setActive] = useState<SavedGameSession[]>([]);
  const [recent, setRecent] = useState<GameHistoryEntry[]>([]);

  useEffect(() => {
    setActive(getActiveSessions());
    setRecent(getRecentCompleted(6));
  }, []);

  if (active.length === 0 && recent.length === 0) return null;

  return (
    <motion.section
      className="mt-5 md:mt-7"
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={staggerContainer}
    >
      <motion.div
        className="mb-3 flex flex-wrap items-baseline justify-between gap-2"
        variants={fadeUp}
      >
        <h2 className="text-2xl font-black text-ink">▶ Continue Playing</h2>
        <Link
          href="/profile"
          className="text-sm font-extrabold text-grass hover:underline"
        >
          View all →
        </Link>
      </motion.div>

      {active.length > 0 && (
        <motion.div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" variants={staggerContainer}>
          {active.slice(0, 3).map((s, i) => (
            <motion.div key={s.gameKey} variants={fadeUp} custom={i}>
              <Link
                href={s.href}
                className="flex items-center gap-3 rounded-2xl border-4 border-ink bg-lime/30 p-4 shadow-[0_4px_0_0_#0d0d0d] transition-transform hover:-translate-y-0.5"
              >
                <span className="text-3xl">{s.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold text-ink">{s.title}</p>
                  <p className="text-xs font-bold text-ink/55">
                    Resume · Q{s.index + 1} · {s.score.toLocaleString()} pts
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {recent.length > 0 && (
        <motion.div className="flex flex-wrap gap-2" variants={fadeUp}>
          <span className="w-full text-xs font-extrabold uppercase tracking-wide text-ink/45">
            Recent
          </span>
          {recent.map((r) => (
            <Link
              key={r.id}
              href={r.href}
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-3 py-1.5 text-sm font-extrabold text-ink/75 transition-colors hover:border-ink hover:text-ink"
            >
              <span>{r.emoji}</span>
              <span className="max-w-[8rem] truncate">{r.title}</span>
              <span className="text-ink/45">{r.score.toLocaleString()} pts</span>
            </Link>
          ))}
        </motion.div>
      )}

      {!isSignedIn && (
        <p className="mt-3 text-xs font-semibold text-ink/50">
          <Link href="/signin" className="font-extrabold text-grass hover:underline">
            Sign in
          </Link>{" "}
          to sync scores on the global leaderboard.
        </p>
      )}
    </motion.section>
  );
}
