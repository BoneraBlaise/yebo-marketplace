/** Memory relevance scoring — Phase 8C */

export const scoreMemoryItem = (item, query = "") => {
  const q = String(query || "").toLowerCase().trim();
  let score = item.score ?? 0.5;

  if (item.scope === "short_term") score += 0.1;
  if (item.scope === "long_term") score += 0.05;

  if (q) {
    const text = JSON.stringify(item.data || item).toLowerCase();
    if (text.includes(q)) score += 0.3;
    const tokens = q.split(/\s+/).filter(Boolean);
    const matched = tokens.filter((t) => text.includes(t)).length;
    if (tokens.length) score += (matched / tokens.length) * 0.2;
  }

  if (item.metadata?.priority) score += item.metadata.priority * 0.1;

  return { ...item, score: Math.min(1, Math.max(0, score)) };
};

export const rankMemoryItems = (items = [], query = "") =>
  items
    .map((item) => scoreMemoryItem(item, query))
    .sort((a, b) => b.score - a.score);

export default { scoreMemoryItem, rankMemoryItems };
