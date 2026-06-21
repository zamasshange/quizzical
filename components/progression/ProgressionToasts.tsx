"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { onProgressionEvent } from "@/lib/progression/client";
import type { ProgressionEventResult } from "@/lib/progression/types";
import { playCelebration } from "@/lib/sound";

type Toast = {
  id: number;
  kind: "xp" | "level" | "discovery" | "achievement";
  title: string;
  detail: string;
  emoji: string;
};

export default function ProgressionToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return onProgressionEvent((result: ProgressionEventResult) => {
      const next: Toast[] = [];
      let id = Date.now();

      if (result.xpEarned > 0) {
        next.push({
          id: id++,
          kind: "xp",
          title: `+${result.xpEarned} XP`,
          detail: result.coinsEarned > 0 ? `+${result.coinsEarned} coins` : "Knowledge gained",
          emoji: "✨",
        });
      }

      if (result.discovery?.isNew) {
        next.push({
          id: id++,
          kind: "discovery",
          title: "New discovery!",
          detail: result.discovery.term,
          emoji: "🔍",
        });
      }

      if (result.leveledUp && result.newLevel) {
        playCelebration();
        next.push({
          id: id++,
          kind: "level",
          title: `Level ${result.newLevel}!`,
          detail: result.newTitle ?? "Knowledge Explorer",
          emoji: "⬆️",
        });
      }

      for (const ach of result.achievementsUnlocked) {
        next.push({
          id: id++,
          kind: "achievement",
          title: "Achievement unlocked!",
          detail: ach.replace(/-/g, " "),
          emoji: "🏅",
        });
      }

      if (next.length === 0) return;
      setToasts((t) => [...t, ...next]);
      for (const toast of next) {
        setTimeout(
          () => setToasts((t) => t.filter((x) => x.id !== toast.id)),
          toast.kind === "level" ? 5000 : 3500,
        );
      }
    });
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={`min-w-[200px] rounded-2xl border-4 border-ink px-4 py-3 shadow-[0_4px_0_0_#0d0d0d] ${
              t.kind === "level"
                ? "bg-lime"
                : t.kind === "discovery"
                  ? "bg-sky/90"
                  : t.kind === "achievement"
                    ? "bg-coral/40"
                    : "bg-white"
            }`}
          >
            <p className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
              <span>{t.emoji}</span>
              {t.title}
            </p>
            <p className="text-xs font-bold text-ink/60">{t.detail}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
