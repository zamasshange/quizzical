"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
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
};

const items: Item[] = [
  { label: "Start", href: "/", Icon: StartIcon },
  { label: "Art & Literature", href: "/art-and-literature", Icon: ArtIcon },
  { label: "Entertainment", href: "/entertainment", Icon: EntertainmentIcon },
  { label: "Geography", href: "/geography", Icon: GeographyIcon },
  { label: "History", href: "/history", Icon: HistoryIcon },
  { label: "Languages", href: "/languages", Icon: LanguagesIcon },
  { label: "Science & Nature", href: "/science-and-nature", Icon: ScienceIcon },
  { label: "Sports", href: "/sports", Icon: SportsIcon },
  { label: "Trivia", href: "/trivia", Icon: TriviaIcon },
];

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <ul className="flex flex-row flex-wrap items-stretch justify-between gap-1 md:gap-2">
        {items.map(({ label, href, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname === href;
          return (
            <li key={label} className="flex-1">
              <Link
                href={href}
                className="group flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-center"
              >
                <Icon className="h-6 w-6 text-ink md:h-8 md:w-8" />
                <span
                  className={`text-[11px] font-bold leading-tight transition-opacity md:text-xs ${
                    active ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                  }`}
                >
                  {label}
                </span>
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
