/** Shared user avatar URL + error fallback for auth/profile UI. */

export const DEFAULT_USER_AVATAR_URL = "/logo512.png";

export function getUserAvatarUrl(userOrUrl) {
  if (typeof userOrUrl === "string") {
    const trimmed = userOrUrl.trim();
    return trimmed || DEFAULT_USER_AVATAR_URL;
  }

  const url = userOrUrl?.avatar?.url;
  if (typeof url === "string" && url.trim()) {
    return url.trim();
  }

  return DEFAULT_USER_AVATAR_URL;
}

export function handleAvatarImgError(event) {
  const img = event?.currentTarget;
  if (!img || img.dataset.fallbackApplied === "true") return;
  img.dataset.fallbackApplied = "true";
  img.onerror = null;
  img.src = DEFAULT_USER_AVATAR_URL;
}
