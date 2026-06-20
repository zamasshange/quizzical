import type { Metadata } from "next";
import type { Category, Quiz } from "./quizzes";
import type { SeoTopic } from "./seoTopics";
import { topicCount } from "./seoTopics";
import type { GameMode } from "./imageQuestions";
import { getCategory } from "./quizzes";
import {
  BASE_KEYWORDS,
  CATEGORY_KEYWORDS,
  IMAGE_GAME_KEYWORDS,
  PAGE_KEYWORDS,
  QUIZ_LONGTAIL_KEYWORDS,
} from "./seoKeywords";

export const SITE_NAME = "Quizzical";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quizzical.site";

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${clean}`;
}

type BuildMetadataInput = {
  /** Page title without site suffix (template adds "| Quizzical"). */
  title: string;
  description: string;
  path: string;
  keywords: string[];
  noIndex?: boolean;
  ogType?: "website" | "article";
};

/** Builds full Next.js Metadata with canonical, Open Graph, Twitter, and keywords. */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  ogType = "website",
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const uniqueKeywords = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))];

  return {
    title,
    description,
    keywords: uniqueKeywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType,
      locale: "en_US",
      images: [
        {
          url: absoluteUrl("/logo.png"),
          width: 512,
          height: 512,
          alt: `${SITE_NAME} — free online quiz games`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [absoluteUrl("/logo.png")],
    },
  };
}

export function homeMetadata(): Metadata {
  return buildMetadata({
    title: "Free Online Quiz Games & Trivia",
    description:
      "Play free quiz games online at Quizzical.site by BDL Corp — geography, movies, sports, flags, celebrities, and AI-generated trivia powered by Sonke AI. Learn something new after every answer.",
    path: "/",
    keywords: [...BASE_KEYWORDS, ...PAGE_KEYWORDS.home],
  });
}

export function categoryMetadata(category: Category): Metadata {
  const extra = CATEGORY_KEYWORDS[category.slug] ?? [];
  return buildMetadata({
    title: `${category.name} Quizzes — Free Online Trivia`,
    description: `Play free ${category.name.toLowerCase()} quizzes online. ${category.tag} games, timed scoring, and educational facts after every answer — no download required.`,
    path: `/${category.slug}`,
    keywords: [
      ...BASE_KEYWORDS,
      ...extra,
      `${category.name.toLowerCase()} quiz`,
      `${category.name.toLowerCase()} trivia`,
      category.tag.toLowerCase(),
      `${category.tag.toLowerCase()} game`,
    ],
  });
}

export function quizMetadata(quiz: Quiz): Metadata {
  const cat = getCategory(quiz.category);
  const catKeys = CATEGORY_KEYWORDS[quiz.category] ?? [];
  const isFlags = quiz.id === "flags-of-the-world";

  return buildMetadata({
    title: `${quiz.title} Quiz — Play Free Online`,
    description: isFlags
      ? `Play Flags of the World free online — 197 countries, random flags every game, no repeats. Guess country flags with instant feedback and learn facts after each answer.`
      : `${quiz.description} Play ${quiz.title} free on Quizzical — timed trivia with educational reveal cards. ${cat?.tag ?? "Quiz"} category.`,
    path: `/quiz/${quiz.id}`,
    keywords: [
      ...BASE_KEYWORDS,
      ...catKeys,
      ...QUIZ_LONGTAIL_KEYWORDS,
      quiz.title,
      `${quiz.title} quiz`,
      `${quiz.title} trivia`,
      `${quiz.title} game online`,
      cat?.tag.toLowerCase() ?? "",
      ...(isFlags
        ? [
            "flags of the world quiz",
            "country flags game",
            "guess the flag",
            "world flags trivia",
            "flag quiz free",
          ]
        : []),
    ],
  });
}

export function quizPlayMetadata(quiz: Quiz): Metadata {
  const cat = getCategory(quiz.category);
  const catKeys = CATEGORY_KEYWORDS[quiz.category] ?? [];

  return buildMetadata({
    title: `Play ${quiz.title} — Free Online Quiz`,
    description: `Start playing ${quiz.title} now. Free online ${cat?.name.toLowerCase() ?? "trivia"} quiz with timer, score tracking, and learn-after-answer facts on Quizzical.site.`,
    path: `/quiz/${quiz.id}/play`,
    keywords: [
      ...BASE_KEYWORDS,
      ...catKeys,
      ...QUIZ_LONGTAIL_KEYWORDS,
      `play ${quiz.title.toLowerCase()}`,
      `${quiz.title} online`,
      `${quiz.title} quiz game`,
      "play quiz now",
      "free quiz no download",
    ],
  });
}

export function imageGameMetadata(game: GameMode): Metadata {
  const extra = IMAGE_GAME_KEYWORDS[game.slug] ?? [];

  return buildMetadata({
    title: `${game.title} — Picture Quiz Game`,
    description: `Play ${game.title} free online. Image-based picture quiz with real photos, multiple choice answers, and educational facts — powered by Wikipedia and AI on Quizzical.site.`,
    path: `/play/${game.slug}`,
    keywords: [
      ...BASE_KEYWORDS,
      ...extra,
      game.title.toLowerCase(),
      "picture quiz",
      "image quiz game",
      "photo quiz online",
      "guess from picture",
    ],
  });
}

export function aiGeneratorMetadata(): Metadata {
  return buildMetadata({
    title: "AI Quiz Generator — Create Custom Trivia",
    description:
      "Generate a custom quiz on any topic with AI from Sonke AI. Enter a subject, pick difficulty, and play instantly — free AI quiz maker at Quizzical.site by BDL Corp.",
    path: "/ai",
    keywords: [...BASE_KEYWORDS, ...PAGE_KEYWORDS.ai],
  });
}

export function signInMetadata(): Metadata {
  return buildMetadata({
    title: "Sign In — Quizzical Account",
    description:
      "Sign in to Quizzical by BDL Corp to track quiz scores, save progress, and access your account. Free trivia games by Zama Shange and the Sonke AI team.",
    path: "/signin",
    keywords: [...BASE_KEYWORDS, ...PAGE_KEYWORDS.signin],
    noIndex: true,
  });
}

export function dashboardMetadata(): Metadata {
  return buildMetadata({
    title: "Dashboard",
    description: "Quizzical admin dashboard.",
    path: "/dashboard",
    keywords: [],
    noIndex: true,
  });
}

export function topicsHubMetadata(): Metadata {
  return buildMetadata({
    title: "Quiz Topics & SEO Keywords",
    description: `Browse ${topicCount()} quiz topics and keywords on Quizzical.site — free online trivia by BDL Corp, Sonke AI, Zama Shange, and Burdolar. Every topic is listed in our sitemap.`,
    path: "/topics",
    keywords: [
      ...BASE_KEYWORDS,
      ...PAGE_KEYWORDS.home,
      "quiz topics",
      "trivia keywords",
      "quizzical sitemap topics",
      "Sonke AI",
      "Zama Shange",
      "Burdolar",
      "BDL Corp",
    ],
  });
}

export function topicMetadata(topic: SeoTopic): Metadata {
  return buildMetadata({
    title: `${topic.keyword} — Free Online Quiz`,
    description: `Play free ${topic.keyword} games online at Quizzical.site. BDL Corp trivia with Sonke AI, Zama Shange, and Burdolar — timed quizzes, picture games, and educational facts after every answer.`,
    path: `/topics/${topic.slug}`,
    keywords: [
      ...BASE_KEYWORDS,
      topic.keyword,
      ...topic.related,
      `${topic.keyword} online`,
      `${topic.keyword} free`,
      `${topic.keyword} game`,
      `${topic.keyword} quiz`,
      "Sonke AI",
      "Zama Shange",
      "Burdolar",
      "BDL Corp",
    ],
  });
}
