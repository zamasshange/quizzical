"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import CategoryBackground from "@/components/atmosphere/CategoryBackground";
import { getCategoryTheme } from "@/lib/atmosphere/categoryThemes";

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
  const [step, setStep] = useState(0);
  const message = useMemo(() => pickMessage(categorySlug), [categorySlug]);
  const theme = getCategoryTheme(categorySlug);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 900);
    const t3 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 450);
    }, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border-4 border-ink shadow-[0_8px_0_0_#0d0d0d]"
          >
            <CategoryBackground categorySlug={categorySlug} showParticles>
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${theme.orbColors[0]}ee, ${theme.orbColors[1] ?? theme.orbColors[0]}cc)`,
                }}
              />
              <div className="relative p-8 text-center">
                <motion.span
                  className="inline-block text-7xl"
                  animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4 }}
                >
                  {emoji}
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 8 }}
                  className="mt-3 font-display text-2xl font-black text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]"
                >
                  {title}
                </motion.h2>

                {facts.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step >= 1 ? 1 : 0 }}
                    className="mt-3 space-y-1 text-sm font-bold text-white/80"
                  >
                    {facts.slice(0, 3).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </motion.ul>
                )}

                <motion.p
                  key={message}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: step >= 2 ? 1 : 0.4 }}
                  className="mt-5 text-sm font-extrabold text-lime"
                >
                  {message}
                </motion.p>

                <div className="mx-auto mt-5 h-1.5 w-48 overflow-hidden rounded-full border border-white/30 bg-white/20">
                  <motion.div
                    className="h-full bg-lime"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </CategoryBackground>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function categorySlugFromQuizCategory(categoryId: string): string {
  return categoryId;
}
