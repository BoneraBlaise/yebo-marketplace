/** Mock signal values derived from memory — Phase 7F */

export const buildMockSignals = (memory = {}) => {
  const prefs = memory.preferences || {};
  const session = memory.session || {};
  const viewed = session.visitedProducts || memory.recentlyViewed || [];

  return {
    recent_views: clampSignal(viewed.length * 12, 60),
    wishlist: clampSignal((memory.wishlist?.items?.length || 0) * 15, 45),
    cart: clampSignal((memory.cart?.items?.length || 0) * 18, 54),
    category_affinity: clampSignal((session.viewedCategories?.length || 2) * 10, 70),
    brand_affinity: clampSignal((prefs.favoriteBrands?.length || 1) * 14, 65),
    vendor_affinity: clampSignal((session.recentVendors?.length || 1) * 12, 60),
    popularity: 72,
    trending: 68,
    seasonality: 55,
    inventory: 80,
    discount: 62,
    price_range: prefs.budgetRange ? 85 : 60,
    rating: 78,
    reviews: 74,
    customer_similarity: 71,
  };
};

const clampSignal = (v, cap = 100) => Math.min(cap, Math.max(20, v));

export const MOCK_SIGNAL_LABELS = {
  recent_views: "Recent views",
  wishlist: "Wishlist",
  cart: "Cart",
  category_affinity: "Category affinity",
  brand_affinity: "Brand affinity",
  vendor_affinity: "Vendor affinity",
  popularity: "Popularity",
  trending: "Trending",
  seasonality: "Seasonality",
  inventory: "Inventory",
  discount: "Discount",
  price_range: "Price range",
  rating: "Rating",
  reviews: "Reviews",
  customer_similarity: "Customer similarity",
};

export default { buildMockSignals, MOCK_SIGNAL_LABELS };
