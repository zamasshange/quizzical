import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { applyProgressionEvent, toProgressionState } from "@/lib/progression/engine";
import type {
  ProgressionEventPayload,
  ProgressionEventResult,
} from "@/lib/progression/types";
import { loadUserProgress, persistProgress, fetchUserRank } from "@/lib/progression/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/** POST /api/progression/event — record gameplay progression */
export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let payload: ProgressionEventPayload;
  try {
    payload = (await req.json()) as ProgressionEventPayload;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const raw = await loadUserProgress(userId);
  const result = applyProgressionEvent(raw, payload, { persistLocal: false });

  const meta = sessionClaims?.publicMetadata as
    | { username?: string; avatarId?: string }
    | undefined;

  await persistProgress(
    userId,
    meta?.username ?? "Player",
    meta?.avatarId ?? null,
    raw,
    result.xpEarned,
    payload.type,
    payload.quizCategory,
  );

  if (result.discovery?.isNew) {
    const sb = getSupabaseAdmin();
    if (sb) {
      await sb.from("user_discoveries").upsert(
        {
          user_id: userId,
          term: result.discovery.term,
          category: result.discovery.category,
          discovery_type: result.discovery.discoveryType,
          quiz_id: result.discovery.quizId ?? null,
        },
        { onConflict: "user_id,term" },
      );
    }
  }

  const state = toProgressionState(raw);
  state.rank = await fetchUserRank(raw.xp);

  return NextResponse.json({ ...result, state } satisfies ProgressionEventResult);
}
