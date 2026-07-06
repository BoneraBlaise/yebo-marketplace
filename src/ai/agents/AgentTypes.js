/** Agent platform type constants — business capabilities, not AI providers */

export const AGENT_ID = {
  SHOPPING: "shopping",
  FASHION: "fashion",
  SEARCH: "search",
  RECOMMENDATION: "recommendation",
  COMPARISON: "comparison",
  VENDOR: "vendor",
  CUSTOMER_SUPPORT: "customer_support",
  ADMIN: "admin",
  MARKETING: "marketing",
  INVENTORY: "inventory",
  PRICING: "pricing",
  CHECKOUT: "checkout",
  WISHLIST: "wishlist",
  COMMISSION: "commission",
  REFERRAL: "referral",
  ANALYTICS: "analytics",
};

export const TASK_TYPE = {
  FIND_PRODUCT: "find_product",
  COMPARE_PRODUCTS: "compare_products",
  SUGGEST_OUTFIT: "suggest_outfit",
  RECOMMEND_BUNDLE: "recommend_bundle",
  FIND_ALTERNATIVE: "find_alternative",
  RECOMMEND_VENDOR: "recommend_vendor",
  RECOMMEND_SIZE: "recommend_size",
  RECOMMEND_COLOR: "recommend_color",
  RECOMMEND_BUDGET: "recommend_budget",
  BUILD_WISHLIST: "build_wishlist",
  IMPROVE_CART: "improve_cart",
  OPTIMIZE_CHECKOUT: "optimize_checkout",
  SUGGEST_COUPON: "suggest_coupon",
  TRACK_ORDER: "track_order",
  ANALYZE_INVENTORY: "analyze_inventory",
  REVIEW_STORE: "review_store",
  MARKETING_INSIGHT: "marketing_insight",
};

export const AGENT_STATUS = {
  READY: "ready",
  BUSY: "busy",
  OFFLINE: "offline",
  DEGRADED: "degraded",
};

export default { AGENT_ID, TASK_TYPE, AGENT_STATUS };
