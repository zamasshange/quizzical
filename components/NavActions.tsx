"use client";

import { useRouter } from "next/navigation";
import { quizzes } from "@/lib/quizzes";
import { playClick, useMuted } from "@/lib/sound";
import { SoundOnIcon, SoundOffIcon } from "./icons";

export default function NavActions() {
  const router = useRouter();
  const [muted, toggleMuted] = useMuted();

  function surpriseMe() {
    playClick();
    const pick = quizzes[Math.floor(Math.random() * quizzes.length)];
    router.push(`/quiz/${pick.id}/play`);
  }

  return (
    <>
      <button
        type="button"
        onClick={surpriseMe}
        className="hidden h-10 items-center gap-1.5 rounded-full border-2 border-ink bg-lime px-4 text-sm font-extrabold text-ink shadow-[0_3px_0_0_#0d0d0d] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:flex"
      >
        🎲 Surprise me
      </button>

      <button
        type="button"
        onClick={toggleMuted}
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
        aria-pressed={muted}
        title={muted ? "Sounds off" : "Sounds on"}
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-black/5 hover:text-ink"
      >
        {muted ? (
          <SoundOffIcon className="h-5 w-5" />
        ) : (
          <SoundOnIcon className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
