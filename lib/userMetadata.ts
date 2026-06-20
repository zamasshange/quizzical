import { isValidAvatarId } from "@/lib/avatars";

export type UserPublicMetadata = {
  avatarId?: string;
};

export const AVATAR_COOKIE_NAME = "quizzical_avatar";

export function getAvatarIdFromCookie(
  cookieValue: string | undefined,
): string | undefined {
  if (!cookieValue || !isValidAvatarId(cookieValue)) return undefined;
  return cookieValue;
}

export function getAvatarIdFromClaims(
  sessionClaims: Record<string, unknown> | null | undefined,
): string | undefined {
  if (!sessionClaims) return undefined;

  if (typeof sessionClaims.avatarId === "string" && sessionClaims.avatarId) {
    return sessionClaims.avatarId;
  }

  const publicMetadata = sessionClaims.publicMetadata as
    | UserPublicMetadata
    | undefined;
  if (publicMetadata?.avatarId) return publicMetadata.avatarId;

  const metadata = sessionClaims.metadata as UserPublicMetadata | undefined;
  return metadata?.avatarId;
}

export function getAvatarId(
  sessionClaims: Record<string, unknown> | null | undefined,
  cookieValue?: string,
): string | undefined {
  return getAvatarIdFromCookie(cookieValue) ?? getAvatarIdFromClaims(sessionClaims);
}
