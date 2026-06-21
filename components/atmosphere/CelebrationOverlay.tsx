"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onProgressionEvent } from "@/lib/progression/client";
import { ACHIEVEMENTS, BADGES } from "@/lib/progression/achievements";
import {
  playAchievement,
  playCelebration,
  playDiscovery,
  playLevelUp,
  playMissionComplete,
  playStreakMilestone,
} from "@/lib/sound";
import { CelebrationParticles } from "./GameParticles";

type CelebrationKind =
  | "level"
  | "discovery"
  | "achievement"
  | "badge"
  | "mission"
  | "streak";

type Celebration = {
  id: number;
  kind: CelebrationKind;
  title: string;
  subtitle: string;
  emoji: string;
  accent: string;
};

export default function CelebrationOverlay() {
  const [queue, setQueue] = useState<Celebration[]>([]);
  const current = queue[0] ?? null;

  useEffect(() => {
    return onProgressionEvent((result) => {
      const next: Celebration[] = [];
      let id = Date.now();

      if (result.streakMilestone) {
        playStreakMilestone();
        next.push({
          id: id++,
          kind: "streak",
          title: `${result.streakMilestone}-Day Streak!`,
          subtitle: "You're on fire — keep the knowledge flowing.",
          emoji: "🔥",
          accent: "bg-gradient-to-br from-coral to-lime",
        });
      }

      for (const m of result.missionsCompleted) {
        playMissionComplete();
        next.push({
          id: id++,
          kind: "mission",
          title: "Daily Mission Complete!",
          subtitle: `${m.emoji} ${m.label}`,
          emoji: "🎯",
          accent: "bg-lime",
        });
      }

      if (result.discovery?.isNew) {
        playDiscovery();
        next.push({
          id: id++,
          kind: "discovery",
          title: "New Discovery!",
          subtitle: result.discovery.term,
          emoji: "🔍",
          accent: "bg-sky/90",
        });
      }

      for (const achId of result.achievementsUnlocked) {
        playAchievement();
        const def = ACHIEVEMENTS.find((a) => a.id === achId);
        next.push({
          id: id++,
          kind: "achievement",
          title: "Achievement Unlocked!",
          subtitle: def?.title ?? achId.replace(/-/g, " "),
          emoji: def?.emoji ?? "🏅",
          accent: "bg-coral/50",
        });
      }

      for (const badgeId of result.badgesUnlocked) {
        playAchievement();
        const def = BADGES.find((b) => b.id === badgeId);
        next.push({
          id: id++,
          kind: "badge",
          title: "Badge Earned!",
          subtitle: def?.label ?? badgeId.replace(/-/g, " "),
          emoji: def?.emoji ?? "🎖️",
          accent: "bg-white",
        });
      }

      if (result.leveledUp && result.newLevel) {
        playLevelUp();
        playCelebration();
        next.push({
          id: id++,
          kind: "level",
          title: `Level ${result.newLevel}!`,
          subtitle: result.newTitle ?? "Knowledge Explorer",
          emoji: "⬆️",
          accent: "bg-gradient-to-br from-lime via-sky/80 to-grass/30",
        });
      }

      if (next.length === 0) return;
      setQueue((q) => [...q, ...next]);
    });
  }, []);

  useEffect(() => {
    if (!current) return;
    const ms = current.kind === "level" ? 4200 : 3200;
    const t = setTimeout(() => setQueue((q) => q.slice(1)), ms);
    return () => clearTimeout(t);
  }, [current]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" />
          <CelebrationParticles
            color={current.kind === "level" ? "#ffd95e" : "#ffc83a"}
            className="z-0"
          />

          <motion.div
            initial={{ scale: 0.75, y: 40, rotate: -3 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            className={`relative z-10 w-full max-w-sm rounded-3xl border-4 border-ink p-8 text-center shadow-[0_8px_0_0_#0d0d0d] ${current.accent}`}
          >
            <motion.span
              className="block text-6xl"
              animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
              transition={{ duration: 0.8, repeat: 2 }}
            >
              {current.emoji}
            </motion.span>
            <h2 className="mt-3 font-display text-3xl font-black text-ink">
              {current.title}
            </h2>
            <p className="mt-2 text-base font-extrabold text-ink/70">
              {current.subtitle}
            </p>
            {current.kind === "level" && (
              <motion.div
                className="mx-auto mt-4 h-2 w-32 overflow-hidden rounded-full border-2 border-ink bg-white"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
              >
                <motion.div
                  className="h-full bg-grass"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
