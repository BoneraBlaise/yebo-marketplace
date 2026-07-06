/** YEBO Decision object types — architecture only (Phase 7E). */

export const DECISION_TYPE = {
  PRODUCT: "product",
  CATEGORY: "category",
  BRAND: "brand",
  VENDOR: "vendor",
  BUNDLE: "bundle",
  SIZE: "size",
  COLOR: "color",
  BUDGET: "budget",
  COUPON: "coupon",
  SHIPPING: "shipping",
  PAYMENT: "payment",
  ACTION: "action",
  SEARCH: "search",
  TRENDING: "trending",
  VENDOR_INSIGHT: "vendor_insight",
  ADMIN_INSIGHT: "admin_insight",
};

export const DECISION_SOURCE = {
  MEMORY: "memory",
  CONTEXT: "context",
  RULE: "rule",
  MOCK: "mock",
};

export const DECISION_PRIORITY = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

/**
 * @typedef {Object} YEBODecision
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} description
 * @property {number} confidence
 * @property {string} reason
 * @property {number} priority
 * @property {string} source
 * @property {string} [action]
 * @property {Record<string, unknown>} [metadata]
 */

export default { DECISION_TYPE, DECISION_SOURCE, DECISION_PRIORITY };
