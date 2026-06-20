import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  AVATAR_COOKIE_NAME,
  ONBOARDING_COOKIE_NAME,
  hasCompletedOnboarding,
} from "@/lib/userMetadata";

// Protect admin dashboard and API routes. Unauthenticated users go to /signin.
// Next.js 16 uses proxy.ts (formerly middleware.ts) for request interception.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/admin(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/signin(.*)",
  "/signup(.*)",
  "/onboarding",
]);

// Guest play + API JSON must never redirect to onboarding (breaks fetch/image loads).
const isOnboardingBypass = createRouteMatcher([
  "/api(.*)",
  "/quiz(.*)",
  "/play(.*)",
  "/ai(.*)",
  "/profile",
  "/leaderboard",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({ unauthenticatedUrl: "/signin" });
  }

  const { userId, sessionClaims } = await auth();

  const onboardingDone = hasCompletedOnboarding(sessionClaims, {
    avatar: req.cookies.get(AVATAR_COOKIE_NAME)?.value,
    onboarded: req.cookies.get(ONBOARDING_COOKIE_NAME)?.value,
  });

  if (
    userId &&
    !isAuthRoute(req) &&
    !isOnboardingBypass(req) &&
    !onboardingDone
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
