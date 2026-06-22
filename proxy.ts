import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { CATEGORY_PATHS } from "@/lib/categorySlugs";
import {
  AVATAR_COOKIE_NAME,
  ONBOARDING_COOKIE_NAME,
  hasCompletedOnboarding,
} from "@/lib/userMetadata";

const CANONICAL_HOST = "quizzical.site";

function normalizeTopicSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function canonicalHostRedirect(req: Request): NextResponse | null {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  if (host === `www.${CANONICAL_HOST}`) {
    const url = new URL(req.url);
    url.hostname = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }
  return null;
}

function topicSlugRedirect(req: Request): NextResponse | null {
  const { pathname } = new URL(req.url);
  const prefix = "/topics/";
  if (!pathname.startsWith(prefix) || pathname.length <= prefix.length) {
    return null;
  }

  const rawSlug = decodeURIComponent(pathname.slice(prefix.length).split("/")[0] ?? "");
  const normalized = normalizeTopicSlug(rawSlug);
  if (!normalized || normalized === rawSlug) return null;

  const url = new URL(req.url);
  url.pathname = `${prefix}${normalized}`;
  return NextResponse.redirect(url, 301);
}

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

// Guest play + browsing must never redirect to onboarding (breaks fetch/image loads).
const isOnboardingBypass = createRouteMatcher([
  "/api(.*)",
  "/__clerk(.*)",
  "/quiz(.*)",
  "/play(.*)",
  "/ai(.*)",
  "/profile",
  "/leaderboard",
  "/knowledge-book",
  "/achievements",
  "/discover",
  "/country(.*)",
  "/player(.*)",
  "/celebrity(.*)",
  "/movie(.*)",
  "/landmark(.*)",
  "/figure(.*)",
  "/",
  "/topics(.*)",
  "/about",
  "/contact",
  "/founder",
  "/privacy-policy",
  "/status",
  ...CATEGORY_PATHS,
]);

export default clerkMiddleware(async (auth, req) => {
  const hostRedirect = canonicalHostRedirect(req);
  if (hostRedirect) return hostRedirect;

  const slugRedirect = topicSlugRedirect(req);
  if (slugRedirect) return slugRedirect;

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
