"use client";

import { useProgression } from "./client";
import { buildFullProgressionState } from "./buildState";
import { loadRawState } from "./engine";
import type { UnlockProgress } from "./unlockEngine";
import type { ProgressionState } from "./types";

function resolveUnlock(
  href: string,
  state: ProgressionState,
): UnlockProgress | undefined {
  const fromState = state.unlocks?.find((u) => u.href === href);
  if (fromState) return fromState;

  if (typeof window === "undefined") return undefined;
  return buildFullProgressionState(loadRawState()).unlocks?.find(
    (u) => u.href === href,
  );
}

/** Find unlock status for a content href (quiz, picture game, world). */
export function useUnlockForHref(href: string) {
  const { state, loaded, clerkReady } = useProgression();
  const unlock = resolveUnlock(href, state);
  const locked = Boolean(clerkReady && unlock && !unlock.unlocked);

  return {
    loaded: clerkReady && loaded,
    unlock,
    locked,
  };
}
