"use client";

import { useProgression } from "./client";

/** Find unlock status for a content href (quiz, picture game, world). */
export function useUnlockForHref(href: string) {
  const { state, loaded } = useProgression();
  const unlock = state.unlocks?.find((u) => u.href === href);
  return {
    loaded,
    unlock,
    locked: Boolean(loaded && unlock && !unlock.unlocked),
  };
}
