"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { categories } from "@/lib/quizzes";
import { getCategoryBrowseCounts } from "@/lib/categoryBrowse";
import {
  StartIcon,
  ArtIcon,
  EntertainmentIcon,
  GeographyIcon,
  HistoryIcon,
  LanguagesIcon,
  ScienceIcon,
  SportsIcon,
  TriviaIcon,
} from "./icons";

type Item = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  count?: number;
};

const CATEGORY_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "art-and-literature": ArtIcon,
  entertainment: EntertainmentIcon,
  geography: GeographyIcon,
  history: HistoryIcon,
  languages: LanguagesIcon,
  "science-and-nature": ScienceIcon,
  sports: SportsIcon,
  trivia: TriviaIcon,
};

const categoryCounts = getCategoryBrowseCounts();

const items: Item[] = [
  { label: "Start", href: "/", Icon: StartIcon },
  ...categories.map((c) => ({
    label: c.name,
    href: `/${c.slug}`,
    Icon: CATEGORY_ICONS[c.slug] ?? TriviaIcon,
    count: categoryCounts[c.slug],
  })),
];

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full" aria-label="Quiz categories">
      <ul className="-mx-4 flex snap-x snap-mandatory flex-row items-stretch gap-0.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-between md:gap-2 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {items.map(({ label, href, Icon, count }) => {
          const active = href === "/" ? pathname === "/" : pathname === href;
          return (
            <li key={href} className="shrink-0 snap-start md:min-w-[4.5rem] md:flex-1">
              <Link
                href={href}
                className={`group flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-center md:gap-1 md:rounded-xl md:px-1 md:py-2 ${
                  active ? "bg-ink/5 md:bg-transparent" : ""
                }`}
              >
                <Icon className="h-5 w-5 text-ink md:h-8 md:w-8" />
                <span
                  className={`max-w-[4.25rem] truncate text-[9px] font-bold leading-tight transition-opacity md:max-w-none md:text-[11px] ${
                    active ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                  }`}
                >
                  {label}
                </span>
                {count !== undefined && (
                  <span className="hidden text-[10px] font-extrabold tabular-nums text-ink/40 md:block">
                    {count} {count === 1 ? "game" : "games"}
                  </span>
                )}
                <span
                  className={`hidden h-1 w-full rounded-full bg-ink transition-opacity md:block ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
