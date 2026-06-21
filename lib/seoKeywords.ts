/** Natural SEO keyword pools — avoid stuffing; use page-relevant subsets only. */

export const BRAND_KEYWORDS = [
  "Quizzical",
  "quizzical",
  "Quizziqal",
  "Quizzical SA",
  "Quizzical South Africa",
  "Quizzical Quiz Game",
  "Quizzical App",
  "Quizzical Online",
  "quizzical.site",
  "quizzical games",
  "play quizzical",
];

export const CORE_QUIZ_KEYWORDS = [
  "quiz games",
  "online quiz games",
  "trivia games",
  "trivia quiz",
  "quiz website",
  "knowledge quiz",
  "educational quiz",
  "AI quiz platform",
  "general knowledge quiz",
  "free quiz games",
  "play quizzes online",
  "online trivia platform",
  "quiz competition",
  "quiz challenges",
];

export const SOUTH_AFRICA_KEYWORDS = [
  "quiz games South Africa",
  "trivia South Africa",
  "South African quiz",
  "online quiz South Africa",
  "educational games South Africa",
  "quiz platform South Africa",
  "best quiz website South Africa",
  "South African trivia",
];

/** Legacy export — prefer CORE + page-specific pools in metadata. */
export const BASE_KEYWORDS = [
  ...BRAND_KEYWORDS,
  ...CORE_QUIZ_KEYWORDS,
  "free online quiz",
  "picture quiz",
  "flag quiz",
  "learn while playing",
];

export const PAGE_KEYWORDS = {
  home: [
    ...BRAND_KEYWORDS,
    ...CORE_QUIZ_KEYWORDS,
    ...SOUTH_AFRICA_KEYWORDS,
    "Knowledge Explorer",
    "AI-powered quiz",
  ],
  ai: [
    ...BRAND_KEYWORDS,
    "AI quiz generator",
    "custom trivia maker",
    "generate quiz online",
  ],
  signin: [...BRAND_KEYWORDS, "quizzical sign in", "quiz account"],
  signup: [...BRAND_KEYWORDS, "quizzical sign up", "free quiz account"],
  about: [
    ...BRAND_KEYWORDS,
    ...SOUTH_AFRICA_KEYWORDS.slice(0, 4),
    "about quizzical",
    "educational quiz platform",
  ],
  founder: [
    ...BRAND_KEYWORDS,
    ...SOUTH_AFRICA_KEYWORDS.slice(0, 3),
    "Zama Shange",
    "South African developer",
    "BDL Corp",
  ],
  privacy: [...BRAND_KEYWORDS, "privacy policy"],
  contact: [...BRAND_KEYWORDS, "contact quizzical"],
  status: [...BRAND_KEYWORDS, "platform status"],
};

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  geography: [
    "geography quiz",
    "country quiz",
    "capital cities quiz",
    "flags quiz",
    "world geography game",
    "guess the country",
    "landmarks quiz",
  ],
  history: [
    "history quiz",
    "historical figures quiz",
    "world history trivia",
    "presidents quiz",
  ],
  "science-and-nature": [
    "science quiz",
    "space quiz",
    "biology quiz",
    "chemistry quiz",
    "animal quiz",
    "wildlife quiz",
  ],
  sports: [
    "football quiz",
    "soccer quiz",
    "sports trivia",
    "guess the footballer",
    "sports knowledge quiz",
    "cricket quiz",
    "basketball quiz",
  ],
  entertainment: [
    "celebrity quiz",
    "movie quiz",
    "TV show quiz",
    "guess the celebrity",
    "music quiz",
    "film trivia",
  ],
  "art-and-literature": [
    "literature quiz",
    "book quiz",
    "author quiz",
    "art quiz",
  ],
  languages: ["language quiz", "vocabulary quiz", "word quiz"],
  trivia: [
    "general knowledge quiz",
    "food quiz",
    "food trivia",
    "world cuisine quiz",
    "pub quiz online",
  ],
};

export const IMAGE_GAME_KEYWORDS: Record<string, string[]> = {
  celebrity: ["guess the celebrity", "celebrity picture quiz", "famous people quiz"],
  athlete: ["guess the athlete", "sports picture quiz"],
  football: ["guess the footballer", "soccer player quiz"],
  basketball: ["guess the basketball player", "NBA player quiz"],
  cricket: ["guess the cricketer", "cricket player quiz"],
  movie: ["guess the movie", "movie poster quiz", "film picture quiz"],
  music: ["guess the singer", "music artist quiz", "band picture quiz"],
};

export const QUIZ_LONGTAIL_KEYWORDS = [
  "play free online",
  "timed quiz",
  "educational reveal",
  "multiple choice quiz",
  "mobile friendly quiz",
];
