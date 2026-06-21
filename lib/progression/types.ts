export type ProgressionEventType =
  | "correct_answer"
  | "wrong_answer"
  | "quiz_complete"
  | "perfect_quiz"
  | "daily_challenge"
  | "first_quiz_of_day"
  | "mission_complete";

export type DiscoveryType =
  | "country"
  | "athlete"
  | "movie"
  | "artist"
  | "historical_figure"
  | "landmark"
  | "animal"
  | "science"
  | "general";

export type UserDiscovery = {
  term: string;
  category: string;
  discoveryType: DiscoveryType;
  quizId?: string;
  discoveredAt: number;
};

export type CategoryMastery = {
  slug: string;
  answered: number;
  correct: number;
  masteryPct: number;
  title: string;
};

export type DailyMission = {
  id: string;
  label: string;
  emoji: string;
  target: number;
  progress: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
};

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  metric: string;
};

export type UserAchievement = AchievementDef & {
  progress: number;
  unlocked: boolean;
  unlockedAt?: number;
};

export type BadgeDef = {
  id: string;
  label: string;
  emoji: string;
};

export type ProgressionState = {
  xp: number;
  level: number;
  title: string;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  countryCode: string;
  discoveries: UserDiscovery[];
  discoveryCount: number;
  mastery: CategoryMastery[];
  missions: DailyMission[];
  achievements: UserAchievement[];
  badges: BadgeDef[];
  stats: {
    totalCorrect: number;
    totalAnswered: number;
    quizzesCompleted: number;
    perfectQuizzes: number;
  };
  rank?: number;
};

export type ProgressionEventPayload = {
  type: ProgressionEventType;
  term?: string;
  category?: string;
  quizCategory?: string;
  quizId?: string;
  difficulty?: string;
  correct?: number;
  total?: number;
  missionId?: string;
};

export type ProgressionEventResult = {
  xpEarned: number;
  coinsEarned: number;
  leveledUp: boolean;
  newLevel?: number;
  newTitle?: string;
  discovery?: UserDiscovery & { isNew: boolean };
  achievementsUnlocked: string[];
  badgesUnlocked: string[];
  streakBonus: number;
  /** Missions that just reached their target this event. */
  missionsCompleted: { id: string; label: string; emoji: string }[];
  /** Streak day count when a milestone (3, 7, 14, 30…) was hit. */
  streakMilestone?: number;
  state: ProgressionState;
};
