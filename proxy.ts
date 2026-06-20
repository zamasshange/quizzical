import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AVATAR_COOKIE_NAME, getAvatarId } from "@/lib/userMetadata";

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

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({ unauthenticatedUrl: "/signin" });
  }

  const { userId, sessionClaims } = await auth();

  const avatarId = getAvatarId(
    sessionClaims,
    req.cookies.get(AVATAR_COOKIE_NAME)?.value,
  );

  if (userId && !isAuthRoute(req) && !avatarId) {
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
