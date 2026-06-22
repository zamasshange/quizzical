import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { topicMetadata } from "@/lib/seo";
import {
  getAllSeoTopics,
  getSeoTopicBySlug,
  keywordToSlug,
  TOPIC_BRAND_LINE,
} from "@/lib/seoTopics";
import { categories, quizzes } from "@/lib/quizzes";
import { IMAGE_GAME_MODES } from "@/lib/imageQuestions";
import { breadcrumbJsonLd } from "@/lib/seoStructuredData";

export function generateStaticParams() {
  return getAllSeoTopics().map((t) => ({ slug: t.slug }));
}

export const dynamicParams = true;

export async function generateMetadata(
  props: PageProps<"/topics/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const topic = getSeoTopicBySlug(slug);
  if (!topic) return { title: "Not found" };
  return topicMetadata(topic);
}

function suggestedQuizzes(keyword: string) {
  const q = keyword.toLowerCase();
  return quizzes
    .filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q) ||
        quiz.category.includes(q.replace(/\s+/g, "-")),
    )
    .slice(0, 6);
}

function suggestedCategories(keyword: string) {
  const q = keyword.toLowerCase();
  return categories.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q) ||
      c.slug.includes(q.replace(/\s+/g, "-")),
  );
}

export default async function TopicPage(props: PageProps<"/topics/[slug]">) {
  const { slug } = await props.params;
  const topic = getSeoTopicBySlug(slug);
  if (!topic) notFound();

  const matchedQuizzes = suggestedQuizzes(topic.keyword);
  const matchedCategories = suggestedCategories(topic.keyword);
  const displayQuizzes =
    matchedQuizzes.length > 0 ? matchedQuizzes : quizzes.slice(0, 6);

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Topics", path: "/topics" },
          { name: topic.keyword, path: `/topics/${topic.slug}` },
        ])}
      />

      <article className="mx-auto max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-wide text-ink/45">
          Quizzical topic · {TOPIC_BRAND_LINE}
        </p>
        <h1 className="mt-2 font-display text-4xl font-black capitalize text-ink md:text-5xl">
          {topic.keyword}
        </h1>
        <p className="mt-4 text-base font-bold leading-relaxed text-ink/70">
          Play free <strong>{topic.keyword}</strong> games online at
          Quizzical.site — a BDL Corp trivia platform built with Sonke AI,
          Zama Shange, and Burdolar. Timed quizzes, picture games, flag trivia,
          and an AI quiz generator. Learn something new after every answer.
        </p>

        {topic.related.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-black text-ink">Related topics</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {topic.related.map((rel) => {
                const relTopic = getSeoTopicBySlug(keywordToSlug(rel));
                if (!relTopic) return null;
                return (
                  <Link
                    key={relTopic.slug}
                    href={`/topics/${relTopic.slug}`}
                    className="rounded-full border-2 border-ink/15 bg-white px-3 py-1 text-sm font-extrabold text-ink/75 hover:border-ink"
                  >
                    {relTopic.keyword}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {matchedCategories.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-black text-ink">Categories</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {matchedCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="rounded-full border-2 border-ink bg-lime px-4 py-2 text-sm font-extrabold text-ink shadow-[0_3px_0_0_#0d0d0d]"
                  >
                    {cat.emoji} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-lg font-black text-ink">Play quizzes</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {displayQuizzes.map((quiz) => (
              <li key={quiz.id}>
                <Link
                  href={`/quiz/${quiz.id}/play`}
                  className="block rounded-2xl border-[3px] border-ink bg-white p-4 font-extrabold text-ink shadow-[0_4px_0_0_#0d0d0d] transition-transform hover:-translate-y-0.5"
                >
                  {quiz.title}
                  <span className="mt-1 block text-xs font-bold text-ink/50">
                    Play free →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border-2 border-ink/15 bg-white/80 p-5">
          <h2 className="text-lg font-black text-ink">More on Quizzical</h2>
          <ul className="mt-3 space-y-2 text-sm font-bold text-ink/70">
            <li>
              <Link href="/ai" className="text-grass hover:underline">
                AI Quiz Generator
              </Link>{" "}
              — custom trivia on any topic
            </li>
            {IMAGE_GAME_MODES.map((mode) => (
              <li key={mode.slug}>
                <Link
                  href={`/play/${mode.slug}`}
                  className="text-grass hover:underline"
                >
                  {mode.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/topics" className="text-grass hover:underline">
                All {getAllSeoTopics().length} keyword topics
              </Link>
            </li>
          </ul>
        </section>
      </article>

      <Footer />
    </SiteShell>
  );
}
