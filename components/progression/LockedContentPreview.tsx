"use client";

import Link from "next/link";
import type { UnlockProgress } from "@/lib/progression/unlockEngine";

type Props = {
  unlock: UnlockProgress;
  /** Compact overlay for narrow picture-game cards. */
  variant?: "default" | "card";
  children: React.ReactNode;
  className?: string;
};

/** Shows locked content with requirements — never hides what exists. */
export default function LockedContentPreview({
  unlock,
  variant = "default",
  children,
  className = "",
}: Props) {
  if (unlock.unlocked) {
    return <>{children}</>;
  }

  const nextReq = unlock.requirements.find((r) => !r.met);

  if (variant === "card") {
    return (
      <div className={`relative min-w-0 ${className}`}>
        <div className="pointer-events-none select-none opacity-50 saturate-[0.65]">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-stretch justify-end overflow-hidden rounded-xl bg-ink/55 p-2 text-center backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-white/25 bg-white/95 px-2 py-2 shadow-[0_2px_0_0_#0d0d0d]">
            <span className="text-base leading-none" aria-hidden>
              🔒
            </span>
            <p className="text-[8px] font-extrabold uppercase tracking-wide text-ink/45">
              Locked
            </p>
            <p className="line-clamp-2 font-display text-[11px] font-black leading-tight text-ink">
              {unlock.title}
            </p>
            {nextReq && (
              <p className="line-clamp-2 text-[9px] font-bold leading-snug text-ink/60">
                {nextReq.current}/{nextReq.required} · {nextReq.label}
              </p>
            )}
            <div className="h-1 w-full overflow-hidden rounded-full border border-ink/20 bg-cream">
              <div
                className="h-full bg-grass"
                style={{ width: `${Math.round(unlock.progress * 100)}%` }}
              />
            </div>
            <Link
              href="/"
              className="pointer-events-auto text-[9px] font-extrabold text-grass hover:underline"
            >
              Level up →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none select-none opacity-60 blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border-4 border-ink bg-white/90 p-3 text-center backdrop-blur-sm">
        <span className="text-2xl">🔒</span>
        <p className="text-xs font-extrabold uppercase tracking-wide text-ink/45">
          Locked
        </p>
        <p className="font-display text-sm font-black text-ink">{unlock.title}</p>
        {nextReq && (
          <p className="text-[11px] font-bold text-ink/60">
            {nextReq.label}: {nextReq.current}/{nextReq.required}
          </p>
        )}
        <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full border border-ink bg-cream">
          <div
            className="h-full bg-grass"
            style={{ width: `${Math.round(unlock.progress * 100)}%` }}
          />
        </div>
        <Link
          href="/"
          className="pointer-events-auto text-[11px] font-extrabold text-grass hover:underline"
        >
          View progression →
        </Link>
      </div>
    </div>
  );
}
