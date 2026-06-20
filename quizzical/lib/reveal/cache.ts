// Supabase-backed cache for reveal data.
//
// "Never repeatedly call external APIs for the same player." Resolved reveals
// (player/team/movie/fact) are persisted so subsequent answers are instant and
// never re-hit TheSportsDB / TMDB / Wikipedia. Falls back to a process-memory
// cache when Supabase isn't configured, so it still works locally.
//
// Run supabase/reveal_cache.sql once to create the table.

import { getSupabaseAdmin } from "../supabase";
import type { RevealData } from "./types";

const TABLE = "reveal_cache";

const memory = new Map<string, RevealData | null>();

export async function getCachedReveal(
  key: string,
): Promise<RevealData | null | undefined> {
  if (memory.has(key)) return memory.get(key);

  const sb = getSupabaseAdmin();
  if (!sb) return undefined;
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select("data")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return undefined;
    const reveal = data.data as RevealData;
    memory.set(key, reveal);
    return reveal;
  } catch {
    return undefined;
  }
}

export async function setCachedReveal(
  key: string,
  reveal: RevealData | null,
): Promise<void> {
  memory.set(key, reveal);
  if (!reveal) return; // only persist real hits

  const sb = getSupabaseAdmin();
  if (!sb) return;
  try {
    await sb.from(TABLE).upsert(
      {
        key,
        provider: reveal.provider,
        kind: reveal.kind,
        data: reveal,
      },
      { onConflict: "key" },
    );
  } catch {
    // best-effort; memory cache still protects the API in this lifetime
  }
}
