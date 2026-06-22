import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { applyProgressionEvent, toProgressionState } from "@/lib/progression/engine";
import type {
  ProgressionEventPayload,
  ProgressionEventResult,
} from "@/lib/progression/types";
import { loadUserProgress, persistProgress, fetchUserRank } from "@/lib/progression/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  activityFromProgression,
  emitActivityEvent,
} from "@/lib/platform/activity";
import { recordContentPlays } from "@/lib/platform/contentHistoryServer";

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

  const username = meta?.username ?? "Player";
  const avatarId = meta?.avatarId ?? null;

  await persistProgress(
    userId,
    username,
    avatarId,
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

  if (payload.term) {
    const contentType =
      result.discovery?.discoveryType ?? payload.quizCategory ?? "general";
    await recordContentPlays(userId, [
      {
        contentId: payload.term,
        contentType,
        category: payload.quizCategory ?? payload.category,
      },
    ]);
  }

  const activity = activityFromProgression({
    username,
    type: payload.type,
    term: payload.term,
    quizCategory: payload.quizCategory,
    leveledUp: result.leveledUp,
    newLevel: result.newLevel,
    badgesUnlocked: result.badgesUnlocked,
    missionsCompleted: result.missionsCompleted,
    discovery: result.discovery
      ? { term: result.discovery.term, isNew: result.discovery.isNew }
      : undefined,
  });

  if (activity) {
    await emitActivityEvent({
      userId,
      username,
      avatarId,
      countryCode: raw.countryCode,
      eventKind: activity.eventKind,
      message: activity.message,
      emoji: activity.emoji,
      category: payload.quizCategory,
    });
  }

  const state = toProgressionState(raw);
  state.rank = await fetchUserRank(raw.xp);

  return NextResponse.json({ ...result, state } satisfies ProgressionEventResult);
}
