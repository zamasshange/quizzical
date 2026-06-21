"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { onProgressionEvent } from "@/lib/progression/client";
import type { ProgressionEventResult } from "@/lib/progression/types";
import {
  playDiscovery,
  playMissionComplete,
  playStreakMilestone,
} from "@/lib/sound";

type ToastKind = "xp" | "discovery" | "mission" | "streak";

type Toast = {
  id: number;
  kind: ToastKind;
  title: string;
  detail?: string;
  href?: string;
};

const TOAST_MS = 2800;

/** Non-blocking progression feedback — never covers gameplay. */
export default function ProgressionToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return onProgressionEvent((result: ProgressionEventResult) => {
      const next: Toast[] = [];
      let id = Date.now();

      const blocksXpToast =
        result.leveledUp ||
        result.achievementsUnlocked.length > 0 ||
        result.badgesUnlocked.length > 0;

      if (result.discovery?.isNew) {
        playDiscovery();
        const xpBit =
          result.xpEarned > 0 ? ` · +${result.xpEarned} XP` : "";
        next.push({
          id: id++,
          kind: "discovery",
          title: result.discovery.term,
          detail: `Added to Knowledge Book${xpBit}`,
          href: "/knowledge-book",
        });
      }

      if (result.streakMilestone) {
        playStreakMilestone();
        next.push({
          id: id++,
          kind: "streak",
          title: `${result.streakMilestone}-day streak`,
          detail: "Keep it going!",
        });
      }

      for (const m of result.missionsCompleted) {
        playMissionComplete();
        next.push({
          id: id++,
          kind: "mission",
          title: "Daily mission done",
          detail: `${m.emoji} ${m.label}`,
        });
      }

      if (result.xpEarned > 0 && !blocksXpToast && !result.discovery?.isNew) {
        next.push({
          id: id++,
          kind: "xp",
          title: `+${result.xpEarned} XP`,
          detail: result.coinsEarned > 0 ? `+${result.coinsEarned} coins` : undefined,
        });
      }

      if (next.length === 0) return;

      setToasts((t) => [...t, ...next].slice(-4));
      for (const toast of next) {
        setTimeout(
          () => setToasts((t) => t.filter((x) => x.id !== toast.id)),
          TOAST_MS,
        );
      }
    });
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex max-w-[min(100vw-2rem,20rem)] flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className={`rounded-2xl border-4 border-ink px-4 py-2.5 shadow-[0_4px_0_0_#0d0d0d] ${
              t.kind === "discovery"
                ? "bg-sky/30"
                : t.kind === "mission"
                  ? "bg-lime/40"
                  : t.kind === "streak"
                    ? "bg-coral/35"
                    : "bg-white"
            }`}
          >
            <p className="flex items-center gap-2 font-display text-sm font-extrabold text-ink">
              <span aria-hidden>
                {t.kind === "discovery"
                  ? "🔍"
                  : t.kind === "mission"
                    ? "🎯"
                    : t.kind === "streak"
                      ? "🔥"
                      : "✨"}
              </span>
              {t.kind === "discovery" ? (
                <span className="truncate">{t.title}</span>
              ) : (
                t.title
              )}
            </p>
            {t.detail && (
              <p className="mt-0.5 text-xs font-bold text-ink/55">{t.detail}</p>
            )}
            {t.href && (
              <Link
                href={t.href}
                className="pointer-events-auto mt-1 inline-block text-[10px] font-extrabold uppercase tracking-wide text-grass hover:underline"
              >
                View Knowledge Book →
              </Link>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
