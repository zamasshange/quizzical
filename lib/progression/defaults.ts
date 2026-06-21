import { DEFAULT_COUNTRY } from "./countries";
import { generateDailyMissions } from "./missions";
import { todayKey } from "./xp";
import type { RawState } from "./engine";

export function createEmptyRaw(countryCode = DEFAULT_COUNTRY): RawState {
  const today = todayKey();
  return {
    xp: 0,
    coins: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayDate: null,
    countryCode,
    discoveries: [],
    mastery: {},
    unlockedAchievements: [],
    unlockedBadges: [],
    missions: generateDailyMissions(today),
    missionDate: today,
    stats: {
      totalCorrect: 0,
      totalAnswered: 0,
      quizzesCompleted: 0,
      perfectQuizzes: 0,
    },
    firstQuizToday: false,
  };
}
