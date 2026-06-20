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
      <ul className="flex flex-row flex-wrap items-stretch justify-between gap-1 md:gap-2">
        {items.map(({ label, href, Icon, count }) => {
          const active = href === "/" ? pathname === "/" : pathname === href;
          return (
            <li key={href} className="min-w-[4.5rem] flex-1">
              <Link
                href={href}
                className="group flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-center"
              >
                <Icon className="h-6 w-6 text-ink md:h-8 md:w-8" />
                <span
                  className={`text-[10px] font-bold leading-tight transition-opacity md:text-[11px] ${
                    active ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                  }`}
                >
                  {label}
                </span>
                {count !== undefined && (
                  <span className="text-[9px] font-extrabold tabular-nums text-ink/40 md:text-[10px]">
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
