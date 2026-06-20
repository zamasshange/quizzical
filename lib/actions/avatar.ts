"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidAvatarId } from "@/lib/avatars";

export async function saveAvatarSelection(avatarId: string): Promise<{ ok: true }> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to pick an avatar.");
  }

  if (!isValidAvatarId(avatarId)) {
    throw new Error("Invalid avatar selection.");
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { avatarId },
  });

  revalidatePath("/");
  revalidatePath("/onboarding");

  return { ok: true };
}
