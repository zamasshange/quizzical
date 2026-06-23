"use client";

import Link from "next/link";
import type { UnlockProgress } from "@/lib/progression/unlockEngine";

type Props = {
  unlock: UnlockProgress;
  children: React.ReactNode;
  className?: string;
};

/** Shows locked content with requirements — never hides what exists. */
export default function LockedContentPreview({
  unlock,
  children,
  className = "",
}: Props) {
  if (unlock.unlocked) {
    return <>{children}</>;
  }

  const nextReq = unlock.requirements.find((r) => !r.met);

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
          href="/achievements"
          className="pointer-events-auto text-[11px] font-extrabold text-grass hover:underline"
        >
          View progression →
        </Link>
      </div>
    </div>
  );
}
