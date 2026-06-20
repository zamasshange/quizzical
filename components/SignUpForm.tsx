"use client";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export default function SignUpForm() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5 rounded-3xl border-4 border-ink bg-white p-6 shadow-[0_6px_0_0_#0d0d0d] md:p-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold">Join the fun</h1>
        <p className="mt-1 font-semibold text-ink/60">
          Pick your player name and start tracking quiz scores.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center">
        <SignUp
          appearance={clerkAppearance}
          routing="path"
          path="/signup"
          signInUrl="/signin"
          forceRedirectUrl="/onboarding"
          fallbackRedirectUrl="/onboarding"
        />
      </div>

      <p className="text-center text-sm font-bold text-ink/60">
        Already have an account?{" "}
        <Link href="/signin" className="text-grass hover:underline">
          Sign in
        </Link>
      </p>

      <Link
        href="/"
        className="text-center text-xs font-bold text-ink/40 hover:text-ink"
      >
        ← Back home
      </Link>
    </div>
  );
}
