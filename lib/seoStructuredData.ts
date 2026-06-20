import { absoluteUrl, SITE_NAME, SITE_URL } from "./seo";
import type { Category, Quiz } from "./quizzes";
import type { GameMode } from "./imageQuestions";

const BDL_CORP = {
  "@type": "Organization" as const,
  name: "BDL Corp",
  url: SITE_URL,
  description:
    "BDL Corp creates free online quiz and trivia games including Quizzical.site.",
};

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: [
      "Quizzical.site",
      "Quizzical games",
      "Quizzical quiz games",
      "quizzical games",
    ],
    url: SITE_URL,
    description:
      "Quizzical — free quiz games at quizzical.site. Picture quizzes, trivia, flags, sports, movies, and AI-generated games by BDL Corp.",
    inLanguage: "en",
    publisher: BDL_CORP,
    creator: [
      { "@type": "Person", name: "Zama Shange" },
      { "@type": "Organization", name: "Sonke AI" },
      { "@type": "Organization", name: "Burdolar" },
      BDL_CORP,
    ],
    keywords:
      "quizzical, free online quiz, trivia games, Sonke AI, Zama Shange, Burdolar, BDL Corp, flag quiz, picture quiz, AI quiz generator",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BDL Corp",
    legalName: "BDL Corp",
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
      url: SITE_URL,
    },
    founder: {
      "@type": "Person",
      name: "Zama Shange",
    },
    memberOf: [
      { "@type": "Organization", name: "Sonke AI" },
      { "@type": "Organization", name: "Burdolar" },
    ],
    knowsAbout: [
      "Online quiz games",
      "Trivia",
      "Educational games",
      "AI quiz generation",
      "Picture quizzes",
      "Flag quizzes",
    ],
    sameAs: ["https://www.youtube.com/@quizziqal"],
  };
}

export function quizJsonLd(quiz: Quiz, categoryName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: quiz.title,
    description: quiz.description,
    url: absoluteUrl(`/quiz/${quiz.id}`),
    educationalLevel: "General",
    about: categoryName ?? quiz.category,
    keywords: `quizzical, ${quiz.title}, free quiz, BDL Corp, Sonke AI, Zama Shange, Burdolar, online trivia`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      parentOrganization: BDL_CORP,
    },
    author: BDL_CORP,
  };
}

export function categoryCollectionJsonLd(category: Category, quizCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Quizzes`,
    description: `Free ${category.name.toLowerCase()} quizzes and trivia games on ${SITE_NAME} by BDL Corp.`,
    url: absoluteUrl(`/${category.slug}`),
    numberOfItems: quizCount,
    keywords: `${category.name} quiz, quizzical, BDL Corp, Sonke AI, free trivia online`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      publisher: BDL_CORP,
    },
  };
}

export function imageGameJsonLd(game: GameMode) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: `Free online ${game.title.toLowerCase()} picture quiz on ${SITE_NAME} by BDL Corp.`,
    url: absoluteUrl(`/play/${game.slug}`),
    gamePlatform: "Web browser",
    applicationCategory: "Game",
    operatingSystem: "Any",
    keywords: `picture quiz, ${game.title}, quizzical, BDL Corp, Sonke AI, Zama Shange, Burdolar`,
    author: BDL_CORP,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
