/** XP rewards and level curve for Knowledge Explorers. */

export const XP = {
  correctAnswer: 5,
  quizComplete: 10,
  perfectQuiz: 25,
  dailyChallenge: 50,
  firstQuizOfDay: 20,
  newDiscovery: 10,
  hardBonus: 5,
  missionComplete: 30,
} as const;

export const COINS = {
  correctAnswer: 1,
  quizComplete: 3,
  perfectQuiz: 10,
  newDiscovery: 2,
  streakDay: 5,
  missionComplete: 8,
} as const;

/** Total XP required to reach a given level (level 1 = 0). */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.65));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (level < 100 && xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function xpToNextLevel(xp: number): {
  level: number;
  current: number;
  needed: number;
  progress: number;
} {
  const level = levelFromXp(xp);
  const floor = xpForLevel(level);
  const ceiling = level >= 100 ? floor : xpForLevel(level + 1);
  const current = xp - floor;
  const needed = Math.max(1, ceiling - floor);
  return {
    level,
    current,
    needed,
    progress: Math.min(1, current / needed),
  };
}

const GLOBAL_TITLES: [number, string][] = [
  [100, "Grandmaster"],
  [75, "Legend"],
  [50, "Master"],
  [35, "Expert"],
  [20, "Scholar"],
  [10, "Learner"],
  [5, "Explorer"],
  [1, "Beginner"],
];

export function globalTitle(level: number): string {
  for (const [min, title] of GLOBAL_TITLES) {
    if (level >= min) return title;
  }
  return "Beginner";
}

export function categoryTitle(slug: string, masteryPct: number): string {
  const base =
    {
      sports: "Sports Expert",
      entertainment: "Movie Master",
      history: "History Scholar",
      "science-and-nature": "Science Genius",
      geography: "World Traveler",
      "art-and-literature": "Culture Scholar",
      music: "Music Master",
      trivia: "Trivia Master",
      languages: "Polyglot",
    }[slug] ?? "Category Explorer";

  if (masteryPct >= 80) return base;
  if (masteryPct >= 40) return `Rising ${base.split(" ").pop() ?? "Star"}`;
  return "Knowledge Explorer";
}

export function streakBonusXp(streak: number): number {
  if (streak <= 1) return 0;
  return Math.min(streak * 2, 50);
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
