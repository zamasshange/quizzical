"use client";

import Link from "next/link";
import type { UnlockProgress } from "@/lib/progression/unlockEngine";
import { buildUnlockProgressView } from "@/lib/progression/unlockDisplay";
import { useProgression } from "@/lib/progression/client";

type Props = {
  unlock: UnlockProgress;
  /** Compact overlay for narrow picture-game cards. */
  variant?: "default" | "card";
  children: React.ReactNode;
  className?: string;
};

function ProgressPanel({
  unlock,
  variant,
}: {
  unlock: UnlockProgress;
  variant: "default" | "card";
}) {
  const { state } = useProgression();
  const view = buildUnlockProgressView(unlock, state.xp);
  const compact = variant === "card";

  return (
    <div
      className={
        compact
          ? "flex w-full flex-col items-center gap-1.5 rounded-lg border-2 border-white/25 bg-white/95 px-2 py-2 shadow-[0_2px_0_0_#0d0d0d]"
          : "flex w-full max-w-xs flex-col items-center gap-2 rounded-2xl border-4 border-ink bg-white/95 p-4 shadow-[0_4px_0_0_#0d0d0d]"
      }
    >
      <span className={compact ? "text-base leading-none" : "text-3xl"} aria-hidden>
        🔒
      </span>
      <p
        className={
          compact
            ? "text-[8px] font-extrabold uppercase tracking-wide text-ink/45"
            : "text-xs font-extrabold uppercase tracking-wide text-ink/45"
        }
      >
        Locked · {view.pct}%
      </p>
      <p
        className={
          compact
            ? "line-clamp-2 font-display text-[11px] font-black leading-tight text-ink"
            : "font-display text-sm font-black text-ink"
        }
      >
        {unlock.title}
      </p>
      <p
        className={
          compact
            ? "text-[9px] font-extrabold text-grass"
            : "text-xs font-extrabold text-grass"
        }
      >
        {view.detail}
      </p>
      <p
        className={
          compact
            ? "text-[8px] font-bold text-ink/55"
            : "text-[11px] font-bold text-ink/55"
        }
      >
        {view.remaining}
      </p>
      <div
        className={
          compact
            ? "h-1.5 w-full overflow-hidden rounded-full border border-ink/20 bg-cream"
            : "h-2 w-full overflow-hidden rounded-full border-2 border-ink bg-cream"
        }
      >
        <div
          className="h-full bg-gradient-to-r from-grass to-sky transition-all duration-500"
          style={{ width: `${view.pct}%` }}
        />
      </div>
      {!compact && unlock.requirements.length > 1 && (
        <ul className="w-full space-y-1 text-left">
          {unlock.requirements.map((req) => {
            const row = buildUnlockProgressView(
              { ...unlock, requirements: [req] },
              state.xp,
            );
            return (
              <li
                key={req.label}
                className="flex items-center justify-between text-[10px] font-bold text-ink/55"
              >
                <span className={req.met ? "text-grass" : ""}>
                  {req.met ? "✓" : "○"} {req.label}
                </span>
                <span>{row.pct}%</span>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        href="/"
        className={
          compact
            ? "pointer-events-auto text-[9px] font-extrabold text-grass hover:underline"
            : "pointer-events-auto text-[11px] font-extrabold text-grass hover:underline"
        }
      >
        Keep playing →
      </Link>
    </div>
  );
}

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

  if (variant === "card") {
    return (
      <div className={`relative min-w-0 ${className}`}>
        <div className="pointer-events-none select-none opacity-50 saturate-[0.65]">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-stretch justify-end overflow-hidden rounded-xl bg-ink/55 p-2 text-center backdrop-blur-[2px]">
          <ProgressPanel unlock={unlock} variant="card" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none select-none opacity-60 blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center backdrop-blur-sm">
        <ProgressPanel unlock={unlock} variant="default" />
      </div>
    </div>
  );
}
