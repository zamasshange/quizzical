"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { AccountIcon } from "./icons";

export default function NavbarAuth() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="redirect" forceRedirectUrl="/signin">
          <button
            type="button"
            aria-label="Sign in"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink/15 text-ink transition-colors hover:border-ink hover:bg-black/5"
          >
            <AccountIcon className="h-6 w-6" />
          </button>
        </SignInButton>
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
