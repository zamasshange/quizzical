import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import AvatarPicker from "@/components/AvatarPicker";
import { AVATAR_COOKIE_NAME, getAvatarId } from "@/lib/userMetadata";

export const metadata: Metadata = {
  title: "Pick your avatar",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/signup");
  }

  const cookieStore = await cookies();
  if (
    getAvatarId(sessionClaims, cookieStore.get(AVATAR_COOKIE_NAME)?.value)
  ) {
    redirect("/");
  }

  return (
    <SiteShell showCategories={false} centerContent>
      <AvatarPicker />
    </SiteShell>
  );
}
