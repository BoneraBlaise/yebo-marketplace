/** Intelligence helpers — Phase 7F */

export const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));

export const weightedSum = (factors) =>
  factors.reduce((acc, { value, weight }) => acc + value * weight, 0);

export const normalizeScore = (value, max = 100) => clamp(Math.round(value), 0, max);

export const rankItems = (items, scoreKey = "score") =>
  [...items]
    .sort((a, b) => (b[scoreKey] || 0) - (a[scoreKey] || 0))
    .map((item, i) => ({ ...item, rank: i + 1 }));

export default { clamp, weightedSum, normalizeScore, rankItems };
