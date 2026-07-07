/** Memory TTL and expiration — Phase 8C */

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

export const isExpired = (item, ttlMs = DEFAULT_TTL_MS) => {
  if (!item) return true;
  const ts = item.expiresAt || item.metadata?.expiresAt || item.storedAt;
  if (!ts) return false;
  const expiresAt = typeof ts === "number" ? ts : new Date(ts).getTime() + ttlMs;
  if (typeof ts === "number" && item.expiresAt) {
    return Date.now() > item.expiresAt;
  }
  return Date.now() > expiresAt;
};

export const applyExpiration = (items = [], ttlMs = DEFAULT_TTL_MS) =>
  items.filter((item) => !isExpired(item, ttlMs));

export const withExpiration = (item, ttlMs = DEFAULT_TTL_MS) => ({
  ...item,
  expiresAt: Date.now() + ttlMs,
});

export default { isExpired, applyExpiration, withExpiration, DEFAULT_TTL_MS };
