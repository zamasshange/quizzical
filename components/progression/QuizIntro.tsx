"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { categories } from "@/lib/quizzes";

const MESSAGES: Record<string, string[]> = {
  geography: ["🌍 Preparing landmarks...", "🗺️ Mapping the world...", "🏙️ Loading capitals..."],
  sports: ["⚽ Gathering player stats...", "🏆 Loading sports legends...", "📊 Fetching team data..."],
  history: ["📜 Exploring historical archives...", "🏛️ Loading historical figures..."],
  "science-and-nature": ["🔬 Analyzing discoveries...", "🚀 Launching space data...", "🧬 Loading science facts..."],
  entertainment: ["🎬 Loading movie posters...", "🎭 Preparing entertainment trivia..."],
  default: ["🧠 Warming up your brain...", "✨ Loading challenge...", "📚 Gathering knowledge..."],
};

function pickMessage(categorySlug?: string): string {
  const list = MESSAGES[categorySlug ?? ""] ?? MESSAGES.default;
  return list[Math.floor(Math.random() * list.length)];
}

type Props = {
  title: string;
  emoji: string;
  categorySlug?: string;
  facts?: string[];
  onDone: () => void;
};

export default function QuizIntro({ title, emoji, categorySlug, facts = [], onDone }: Props) {
  const [visible, setVisible] = useState(true);
  const message = pickMessage(categorySlug);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="w-full max-w-md rounded-3xl border-4 border-ink bg-white p-8 text-center shadow-[0_8px_0_0_#0d0d0d]"
          >
            <span className="text-6xl">{emoji}</span>
            <h2 className="mt-3 font-display text-2xl font-black text-ink">{title}</h2>
            {facts.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm font-bold text-ink/55">
                {facts.slice(0, 3).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
            <p className="mt-4 animate-pulse text-sm font-extrabold text-grass">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function categorySlugFromQuizCategory(categoryId: string): string {
  return categories.find((c) => c.slug === categoryId)?.slug ?? categoryId;
}
