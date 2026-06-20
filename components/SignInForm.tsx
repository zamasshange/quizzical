"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export default function SignInForm() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5 rounded-3xl border-4 border-ink bg-white p-6 shadow-[0_6px_0_0_#0d0d0d] md:p-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
        <p className="mt-1 font-semibold text-ink/60">
          Sign in with your username to track scores and manage admin content.
        </p>
      </div>

      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path="/signin"
        signUpUrl="/signin"
        forceRedirectUrl="/"
        fallbackRedirectUrl="/"
      />

      <Link
        href="/"
        className="text-center text-xs font-bold text-ink/40 hover:text-ink"
      >
        ← Back home
      </Link>
    </div>
  );
}
