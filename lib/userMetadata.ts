export type UserPublicMetadata = {
  avatarId?: string;
};

export function getAvatarIdFromClaims(
  sessionClaims: Record<string, unknown> | null | undefined,
): string | undefined {
  if (!sessionClaims) return undefined;

  const publicMetadata = sessionClaims.publicMetadata as
    | UserPublicMetadata
    | undefined;
  if (publicMetadata?.avatarId) return publicMetadata.avatarId;

  const metadata = sessionClaims.metadata as UserPublicMetadata | undefined;
  return metadata?.avatarId;
}
