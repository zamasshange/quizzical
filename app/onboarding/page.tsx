import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import AvatarPicker from "@/components/AvatarPicker";
import { getAvatarIdFromClaims } from "@/lib/userMetadata";

export const metadata: Metadata = {
  title: "Pick your avatar",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/signin");
  }

  if (getAvatarIdFromClaims(sessionClaims)) {
    redirect("/");
  }

  return (
    <SiteShell showCategories={false} centerContent>
      <AvatarPicker />
    </SiteShell>
  );
}
