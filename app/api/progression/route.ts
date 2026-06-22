import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { toProgressionState } from "@/lib/progression/engine";
import {
  fetchUserRank,
  loadUserProgress,
  persistProgress,
  syncProfileFromClerk,
} from "@/lib/progression/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { normalizeCountryCode } from "@/lib/progression/countries";
import type { ProgressionState } from "@/lib/progression/types";

/** GET /api/progression — full explorer state */
export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const meta = sessionClaims?.publicMetadata as
    | { username?: string; avatarId?: string; onboardingComplete?: boolean }
    | undefined;

  if (isSupabaseConfigured()) {
    await syncProfileFromClerk(userId, meta);
  }

  const raw = await loadUserProgress(userId);
  const state = toProgressionState(raw);

  if (isSupabaseConfigured()) {
    state.rank = await fetchUserRank(raw.xp);
  }

  return NextResponse.json(state satisfies ProgressionState);
}

/** PATCH /api/progression — update country */
export async function PATCH(req: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await req.json()) as { countryCode?: string };
  const raw = await loadUserProgress(userId);
  if (body.countryCode) {
    const code = normalizeCountryCode(body.countryCode);
    if (code) raw.countryCode = code;
  }

  const meta = sessionClaims?.publicMetadata as
    | { username?: string; avatarId?: string }
    | undefined;

  await persistProgress(
    userId,
    meta?.username ?? "Player",
    meta?.avatarId ?? null,
    raw,
    0,
    "profile_update",
  );

  return NextResponse.json(toProgressionState(raw));
}
