/**
 * Presentation-only AI Picks prioritization for homepage.
 * Does not modify Redux or backend recommendation logic.
 */

const CATEGORY_TIERS = [
  {
    tier: 1,
    patterns: [
      /fashion|cloth|dress|wear|apparel|outfit|garment/i,
      /shoe|sneaker|footwear|boot|sandal/i,
      /beauty|skin|cosmetic|makeup|fragrance/i,
      /accessori|bag|jewel|watch|belt|scarf/i,
    ],
  },
  {
    tier: 2,
    patterns: [
      /electronic|phone|tablet|laptop|computer|gadget|tech/i,
      /lifestyle|home|decor|furniture|sport|fitness|book/i,
    ],
  },
  {
    tier: 3,
    patterns: [/grocery|grocer|food|produce|pantry/i],
  },
];

const getProductTier = (product) => {
  const text = `${product.category || ""} ${product.name || ""}`.toLowerCase();
  for (const { tier, patterns } of CATEGORY_TIERS) {
    if (patterns.some((p) => p.test(text))) return tier;
  }
  return 2;
};

export const getAIPicksProducts = (allProducts = [], limit = 4) => {
  if (!allProducts?.length) return [];

  const scored = allProducts.map((product) => ({
    product,
    tier: getProductTier(product),
    featured: product.featured ? 1 : 0,
  }));

  scored.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (a.featured !== b.featured) return b.featured - a.featured;
    return (b.product.sold_out || 0) - (a.product.sold_out || 0);
  });

  const picks = [];
  const seen = new Set();

  for (const { product, tier } of scored) {
    if (picks.length >= limit) break;
    if (tier === 3 && picks.length >= 2) continue;
    if (seen.has(product._id)) continue;
    seen.add(product._id);
    picks.push(product);
  }

  return picks;
};
