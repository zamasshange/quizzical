import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAvatarIdFromClaims } from "@/lib/userMetadata";

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

  if (userId && !isAuthRoute(req) && !getAvatarIdFromClaims(sessionClaims)) {
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
