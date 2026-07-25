export const SHOP_STATUS_LABELS = {
  open: { label: "Open", tone: "open", color: "#166534" },
  closed: { label: "Closed", tone: "closed", color: "#991b1b" },
  busy: { label: "Busy", tone: "busy", color: "#92400e" },
  vacation: { label: "Vacation", tone: "vacation", color: "#3730a3" },
};

export const formatJoinedDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

/** Compact number for social stats — e.g. 12500 → 12.5K */
export const formatCompactNumber = (value) => {
  const n = Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
};

/** Derive visibility metric from loaded products — no new API */
export const deriveProductViews = (products = []) =>
  products.reduce(
    (sum, p) =>
      sum +
      (Number(p.sold_out) || 0) * 8 +
      (Array.isArray(p.likes) ? p.likes.length : 0) * 4 +
      (Array.isArray(p.reviews) ? p.reviews.length : 0) * 6,
    0
  );

export const aggregateReviews = (products = []) => {
  const reviews = products.flatMap((p) =>
    (p.reviews || []).map((r) => ({ ...r, productName: p.name, productId: p._id }))
  );
  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export default SHOP_STATUS_LABELS;
