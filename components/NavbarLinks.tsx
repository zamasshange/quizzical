"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show } from "@clerk/nextjs";

const PUBLIC_LINKS = [
  { label: "Browse", href: "/" },
  { label: "About", href: "/about" },
  { label: "Picture games", href: "/#picture-games" },
  { label: "AI Quiz", href: "/ai" },
];

const GUEST_LINKS = [{ label: "Sign Up", href: "/signup" }];

const MEMBER_LINKS = [
  { label: "My Games", href: "/profile" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export default function NavbarLinks() {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-1 sm:flex">
      {PUBLIC_LINKS.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors hover:bg-black/5 hover:text-ink ${
              pathname === link.href ? "text-ink" : "text-ink/70"
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <Show when="signed-in">
        {MEMBER_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors hover:bg-black/5 hover:text-ink ${
                pathname === link.href ? "text-ink" : "text-ink/70"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </Show>
      <Show when="signed-out">
        {GUEST_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-extrabold text-ink/70 transition-colors hover:bg-black/5 hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </Show>
    </ul>
  );
}
