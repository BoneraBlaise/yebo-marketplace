/** Reusable decision rules — architecture only, no business logic. */

export const DECISION_RULES = {
  RECENTLY_VIEWED: {
    id: "recently_viewed",
    label: "Recently viewed",
    weight: 0.9,
    apply: (memory) => memory?.session?.visitedProducts?.length > 0,
  },
  FREQUENTLY_VIEWED: {
    id: "frequently_viewed",
    label: "Frequently viewed",
    weight: 0.85,
    apply: (memory) => (memory?.session?.visitedProducts?.length || 0) >= 2,
  },
  WISHLIST: {
    id: "wishlist",
    label: "Wishlist signal",
    weight: 0.8,
    apply: (memory) => (memory?.wishlist?.items?.length || 0) > 0,
  },
  CART: {
    id: "cart",
    label: "Cart context",
    weight: 0.88,
    apply: (memory) => (memory?.cart?.items?.length || 0) > 0,
  },
  BUDGET: {
    id: "budget",
    label: "Budget preference",
    weight: 0.75,
    apply: (memory) => !!memory?.preferences?.budgetRange,
  },
  FAVORITE_BRANDS: {
    id: "favorite_brands",
    label: "Favorite brands",
    weight: 0.7,
    apply: (memory) => (memory?.preferences?.favoriteBrands?.length || 0) > 0,
  },
  FAVORITE_COLORS: {
    id: "favorite_colors",
    label: "Favorite colors",
    weight: 0.65,
    apply: (memory) => (memory?.preferences?.favoriteColors?.length || 0) > 0,
  },
  PREFERRED_SIZE: {
    id: "preferred_size",
    label: "Preferred size",
    weight: 0.7,
    apply: (memory) => (memory?.preferences?.favoriteSizes?.length || 0) > 0,
  },
  TRENDING: {
    id: "trending",
    label: "Trending",
    weight: 0.6,
    apply: () => true,
  },
  POPULAR: {
    id: "popular",
    label: "Popular near you",
    weight: 0.55,
    apply: () => true,
  },
  VENDOR_REPUTATION: {
    id: "vendor_reputation",
    label: "Vendor reputation",
    weight: 0.72,
    apply: (memory) => (memory?.session?.recentVendors?.length || 0) > 0,
  },
  STOCK: {
    id: "stock",
    label: "Stock availability",
    weight: 0.68,
    apply: () => true,
  },
  SEASON: {
    id: "season",
    label: "Seasonal relevance",
    weight: 0.5,
    apply: () => true,
  },
  LOCATION: {
    id: "location",
    label: "Location context",
    weight: 0.58,
    apply: (memory) => !!memory?.preferences?.country,
  },
};

export const getActiveRules = (memorySnapshot = {}) =>
  Object.values(DECISION_RULES).filter((rule) => rule.apply(memorySnapshot));

export default DECISION_RULES;
