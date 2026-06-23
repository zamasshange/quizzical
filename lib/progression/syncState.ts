import type { ProgressionState } from "./types";
import type { RawState } from "./engine";
import { buildFullProgressionState } from "./buildState";

/** Rebuild full progression (incl. unlocks) from API state + persist raw for consistency. */
export function syncProgressionState(
  api: ProgressionState,
  local: RawState,
): ProgressionState {
  const raw: RawState = {
    ...local,
    xp: api.xp,
    coins: api.coins,
    currentStreak: api.currentStreak,
    longestStreak: api.longestStreak,
    countryCode: api.countryCode,
    discoveries: api.discoveries,
    mastery: Object.fromEntries(
      api.mastery.map((m) => [m.slug, { answered: m.answered, correct: m.correct }]),
    ),
    unlockedAchievements: api.achievements.filter((a) => a.unlocked).map((a) => a.id),
    unlockedBadges: api.badges.map((b) => b.id),
    missions: api.missions,
    missionDate: local.missionDate,
    stats: api.stats,
    firstQuizToday: local.firstQuizToday,
    unlockedItems: api.unlockedItemIds ?? local.unlockedItems ?? [],
    kingdomId: api.kingdom?.id ?? local.kingdomId,
    loginStreak: api.loginStreak ?? local.loginStreak,
    lastLoginDate: local.lastLoginDate,
    dailyRewardClaimedDate: local.dailyRewardClaimedDate,
    claimedDiscoveryMilestones: local.claimedDiscoveryMilestones ?? [],
    isLegend: api.legend?.isLegend ?? local.isLegend,
    legendNumber: api.legend?.legendNumber ?? local.legendNumber,
    crownedAt: api.legend?.crownedAt ?? local.crownedAt,
    seasonXp: api.season?.userSeasonXp ?? local.seasonXp ?? 0,
    seasonDiscoveries: api.season?.userSeasonDiscoveries ?? local.seasonDiscoveries ?? 0,
    season: api.season ?? local.season,
  };

  return buildFullProgressionState(raw);
}

/** Ensure unlocks are always computed — never trust a partial API payload. */
export function ensureUnlocks(state: ProgressionState, raw: RawState): ProgressionState {
  const full = buildFullProgressionState(raw);
  return { ...state, unlocks: full.unlocks, nextUnlock: full.nextUnlock };
}
