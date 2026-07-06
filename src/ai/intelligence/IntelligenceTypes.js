/** YEBO Intelligence Layer types — Phase 7F */

export const INTELLIGENCE_SIGNAL = {
  RECENT_VIEWS: "recent_views",
  WISHLIST: "wishlist",
  CART: "cart",
  CATEGORY_AFFINITY: "category_affinity",
  BRAND_AFFINITY: "brand_affinity",
  VENDOR_AFFINITY: "vendor_affinity",
  POPULARITY: "popularity",
  TRENDING: "trending",
  SEASONALITY: "seasonality",
  INVENTORY: "inventory",
  DISCOUNT: "discount",
  PRICE_RANGE: "price_range",
  RATING: "rating",
  REVIEWS: "reviews",
  CUSTOMER_SIMILARITY: "customer_similarity",
};

export const SCORE_TYPE = {
  PURCHASE_LIKELIHOOD: "purchase_likelihood",
  DISCOVERY: "discovery",
  BUNDLE: "bundle",
  FASHION_MATCH: "fashion_match",
  TREND: "trend",
  PRICE_VALUE: "price_value",
  URGENCY: "urgency",
  CUSTOMER_FIT: "customer_fit",
  VENDOR_QUALITY: "vendor_quality",
};

/**
 * @typedef {Object} RankedRecommendation
 * @property {string} id
 * @property {string} title
 * @property {number} rank
 * @property {number} score
 * @property {number} confidence
 * @property {string} reason
 * @property {Object} explainability
 * @property {Object} signals
 * @property {Object} [metadata]
 */

export default { INTELLIGENCE_SIGNAL, SCORE_TYPE };
