/** Shared helpers for YEBO memory modules. */

export const uniqueBy = (list, key, max = 20) => {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const id = typeof item === "object" ? item[key] : item;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(item);
    if (out.length >= max) break;
  }
  return out;
};

export const pushUnique = (list, item, key, max = 20) => {
  const id = typeof item === "object" ? item[key] : item;
  const next = [item, ...list.filter((i) => (typeof i === "object" ? i[key] : i) !== id)];
  return next.slice(0, max);
};

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Recently";
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const mergeSnapshots = (...snapshots) =>
  snapshots.reduce((acc, snap) => ({ ...acc, ...snap }), {});

export const pickMockItems = (items, count = 3) =>
  (items || []).slice(0, count);

export default {
  uniqueBy,
  pushUnique,
  formatRelativeTime,
  mergeSnapshots,
  pickMockItems,
};
