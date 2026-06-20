import Link from "next/link";
import Button3D from "./Button3D";
import { AiIllustration } from "./Illustrations";
import { SparkleIcon } from "./icons";

const EXAMPLES = ["Greek mythology", "90s pop music", "The solar system", "World War II"];

export default function AiHeroCard() {
  return (
    <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border-4 border-ink bg-white p-6 shadow-[0_6px_0_0_#0d0d0d] md:p-7">
      {/* soft glow accents */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-grass/20 blur-2xl" />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-ink bg-petrol shadow-[0_3px_0_0_#0d0d0d]">
            <SparkleIcon className="h-6 w-6 text-sky" />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold leading-none text-ink md:text-2xl">
              AI Quiz Generator
            </h2>
            <p className="mt-1 text-sm font-bold text-ink/55">
              Turn any topic or PDF into a quiz
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border-2 border-ink bg-lime px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-ink">
          New
        </span>
      </div>

      {/* Faux prompt input */}
      <Link
        href="/ai"
        className="relative flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-cream px-4 py-3 transition-colors hover:bg-cream-dark"
      >
        <SparkleIcon className="h-4 w-4 shrink-0 text-petrol" />
        <span className="text-sm font-bold text-ink/45">
          Make a quiz about…
        </span>
        <span className="-ml-1 inline-block h-4 w-0.5 animate-quiz-blink bg-ink/60" />
      </Link>

      {/* Example topic chips */}
      <div className="relative flex flex-wrap gap-2">
        {EXAMPLES.map((topic) => (
          <Link
            key={topic}
            href="/ai"
            className="rounded-full border-2 border-ink/15 bg-white px-3 py-1 text-xs font-extrabold text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            {topic}
          </Link>
        ))}
      </div>

      {/* Footer: CTA + robot */}
      <div className="relative mt-auto flex items-end justify-between gap-3 pt-1">
        <div className="flex flex-col gap-2">
          <Button3D href="/ai" variant="sky" size="md">
            <SparkleIcon className="h-4 w-4" /> Generate a quiz
          </Button3D>
          <span className="text-xs font-bold text-ink/45">
            10 questions in seconds · free
          </span>
        </div>
        <div className="hidden shrink-0 sm:block" aria-hidden>
          <AiIllustration className="animate-quiz-float h-24 w-24" />
        </div>
      </div>
    </div>
  );
}
