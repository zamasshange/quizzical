"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { AccountIcon } from "./icons";

const signInClassName =
  "flex h-10 items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 text-sm font-extrabold text-ink shadow-[0_3px_0_0_#0d0d0d] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:px-4";

export default function NavbarAuth() {
  return (
    <>
      <Show when="signed-out">
        <Link href="/signin" className={signInClassName} aria-label="Sign in">
          <AccountIcon className="h-4 w-4 shrink-0" />
          <span>Sign In</span>
        </Link>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox:
                "h-10 w-10 rounded-full border-2 border-ink/15 shadow-none",
            },
          }}
        />
      </Show>
    </>
  );
}
