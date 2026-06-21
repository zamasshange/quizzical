"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { onProgressionEvent } from "@/lib/progression/client";
import type { ProgressionEventResult } from "@/lib/progression/types";

type Toast = {
  id: number;
  title: string;
  detail: string;
};

/** Lightweight XP/coin toasts — major celebrations handled by CelebrationOverlay. */
export default function ProgressionToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return onProgressionEvent((result: ProgressionEventResult) => {
      const hasMajor =
        result.leveledUp ||
        result.discovery?.isNew ||
        result.achievementsUnlocked.length > 0 ||
        result.badgesUnlocked.length > 0 ||
        result.missionsCompleted.length > 0 ||
        result.streakMilestone;

      if (result.xpEarned <= 0 || hasMajor) return;

      const id = Date.now();
      setToasts((t) => [
        ...t,
        {
          id,
          title: `+${result.xpEarned} XP`,
          detail: result.coinsEarned > 0 ? `+${result.coinsEarned} coins` : "Nice!",
        },
      ]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 32, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="min-w-[160px] rounded-2xl border-4 border-ink bg-white px-4 py-2.5 shadow-[0_4px_0_0_#0d0d0d]"
          >
            <p className="flex items-center gap-2 font-display text-sm font-extrabold text-ink">
              <span>✨</span>
              {t.title}
            </p>
            <p className="text-xs font-bold text-ink/55">{t.detail}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
