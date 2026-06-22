import { getSupabaseAdmin } from "@/lib/supabase";
import { CLERK_USER_ID_FILTER } from "./clerkUserId";
import { DEFAULT_COUNTRY } from "./countries";
import { generateDailyMissions } from "./missions";
import { resolveClerkIdentity } from "./resolveClerkIdentity";
import { levelFromXp, todayKey } from "./xp";
import { applyWeeklyXp } from "./weekly";
import type { RawState } from "./engine";
import type { UserDiscovery } from "./types";

/** Upsert Supabase profile from Clerk (real signed-in users). */
export async function syncProfileFromClerk(
  userId: string,
  sessionClaims: Record<string, unknown> | null | undefined,
  cookies?: { avatar?: string; onboarded?: string },
): Promise<void> {
  const identity = await resolveClerkIdentity(userId, sessionClaims, cookies);
  if (!identity) return;

  const raw = await loadUserProgress(userId);
  await persistProgress(
    userId,
    identity.username,
    identity.avatarId,
    raw,
    0,
    "profile_sync",
  );
}

export function rowToRaw(row: Record<string, unknown>, discoveries: UserDiscovery[]): RawState {
  const today = todayKey();
  const missionDate = (row.mission_date as string) ?? today;
  return {
    xp: (row.xp as number) ?? 0,
    coins: (row.coins as number) ?? 0,
    currentStreak: (row.current_streak as number) ?? 0,
    longestStreak: (row.longest_streak as number) ?? 0,
    lastPlayDate: (row.last_play_date as string) ?? null,
    countryCode: (row.country_code as string) ?? DEFAULT_COUNTRY,
    discoveries,
    mastery: (row.mastery as RawState["mastery"]) ?? {},
    unlockedAchievements: (row.unlocked_achievements as string[]) ?? [],
    unlockedBadges: (row.unlocked_badges as string[]) ?? [],
    missions:
      missionDate === today
        ? ((row.missions as RawState["missions"]) ?? generateDailyMissions(today))
        : generateDailyMissions(today),
    missionDate: today,
    stats: (row.stats as RawState["stats"]) ?? {
      totalCorrect: 0,
      totalAnswered: 0,
      quizzesCompleted: 0,
      perfectQuizzes: 0,
    },
    firstQuizToday: (row.first_quiz_today as boolean) ?? false,
  };
}

export async function loadUserProgress(userId: string): Promise<RawState> {
  const sb = getSupabaseAdmin();
  if (!sb) return rowToRaw({}, []);

  const { data: row } = await sb
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: discoveries } = await sb
    .from("user_discoveries")
    .select("term, category, discovery_type, quiz_id, discovered_at")
    .eq("user_id", userId)
    .order("discovered_at", { ascending: false })
    .limit(500);

  const mapped: UserDiscovery[] = (discoveries ?? []).map((d) => ({
    term: d.term,
    category: d.category,
    discoveryType: d.discovery_type as UserDiscovery["discoveryType"],
    quizId: d.quiz_id ?? undefined,
    discoveredAt: new Date(d.discovered_at).getTime(),
  }));

  if (!row) return rowToRaw({ country_code: DEFAULT_COUNTRY }, []);
  return rowToRaw(row, mapped);
}

export async function persistProgress(
  userId: string,
  username: string,
  avatarId: string | null,
  raw: RawState,
  xpDelta: number,
  eventType: string,
  category?: string,
): Promise<void> {
  const sb = getSupabaseAdmin();
  if (!sb) return;

  const { data: existing } = await sb
    .from("user_progress")
    .select("weekly_xp, week_started_at")
    .eq("user_id", userId)
    .maybeSingle();

  const weekly = applyWeeklyXp(
    (existing?.weekly_xp as number) ?? 0,
    (existing?.week_started_at as string) ?? null,
    xpDelta,
  );

  await sb.from("user_progress").upsert(
    {
      user_id: userId,
      username,
      avatar_id: avatarId,
      xp: raw.xp,
      coins: raw.coins,
      level: levelFromXp(raw.xp),
      weekly_xp: weekly.weeklyXp,
      week_started_at: weekly.weekStartedAt,
      current_streak: raw.currentStreak,
      longest_streak: raw.longestStreak,
      last_play_date: raw.lastPlayDate,
      country_code: raw.countryCode,
      achievements_count: raw.unlockedAchievements.length,
      discoveries_count: raw.discoveries.length,
      mastery: raw.mastery,
      unlocked_achievements: raw.unlockedAchievements,
      unlocked_badges: raw.unlockedBadges,
      missions: raw.missions,
      mission_date: raw.missionDate,
      stats: raw.stats,
      first_quiz_today: raw.firstQuizToday,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (xpDelta > 0) {
    await sb.from("user_xp_events").insert({
      user_id: userId,
      xp_amount: xpDelta,
      event_type: eventType,
      category: category ?? null,
    });
  }
}

export async function fetchUserRank(xp: number): Promise<number | undefined> {
  const sb = getSupabaseAdmin();
  if (!sb) return undefined;
  const { count } = await sb
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .like("user_id", CLERK_USER_ID_FILTER)
    .gt("xp", xp);
  return (count ?? 0) + 1;
}
