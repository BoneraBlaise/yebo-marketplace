export const SHOP_STATUS_LABELS = {
  open: { label: "Open", tone: "open" },
  closed: { label: "Closed", tone: "closed" },
  busy: { label: "Busy", tone: "busy" },
  vacation: { label: "On Vacation", tone: "vacation" },
};

export const formatJoinedDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
};

export const aggregateReviews = (products = []) => {
  const reviews = products.flatMap((p) =>
    (p.reviews || []).map((r) => ({ ...r, productName: p.name, productId: p._id }))
  );
  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export default SHOP_STATUS_LABELS;
