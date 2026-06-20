import Link from "next/link";
import type { GameMode } from "@/lib/imageQuestions";

export default function PictureGameGrid({ modes }: { modes: GameMode[] }) {
  if (modes.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {modes.map((mode) => (
        <Link
          key={mode.slug}
          href={`/play/${mode.slug}`}
          className="group flex flex-col"
        >
          <div
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border-[3px] border-ink shadow-[0_4px_0_0_#0d0d0d] transition-all duration-100 group-hover:-translate-y-1 group-hover:shadow-[0_7px_0_0_#0d0d0d]"
            style={{ backgroundColor: mode.color }}
          >
            <span className="text-5xl drop-shadow-sm sm:text-6xl md:text-7xl">
              {mode.emoji}
            </span>
            <span className="absolute left-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
              Picture
            </span>
            <span className="absolute bottom-2 right-2 rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
              ▶ Play
            </span>
          </div>
          <h3 className="pt-2 text-sm font-extrabold leading-tight text-ink sm:text-base">
            {mode.title}
          </h3>
          {mode.subtitle && (
            <p className="text-xs font-semibold text-ink/50">{mode.subtitle}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
