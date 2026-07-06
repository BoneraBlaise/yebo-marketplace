import { TASK_TYPE } from "./AgentTypes";

/** Task definitions mapped to capable agents */
export const AGENT_TASKS = [
  { type: TASK_TYPE.FIND_PRODUCT, label: "Find Product", keywords: ["find", "search", "product", "need"] },
  { type: TASK_TYPE.COMPARE_PRODUCTS, label: "Compare Products", keywords: ["compare", "versus", "vs"] },
  { type: TASK_TYPE.SUGGEST_OUTFIT, label: "Suggest Outfit", keywords: ["outfit", "style", "wear"] },
  { type: TASK_TYPE.RECOMMEND_BUNDLE, label: "Recommend Bundle", keywords: ["bundle", "set", "together"] },
  { type: TASK_TYPE.FIND_ALTERNATIVE, label: "Find Alternative", keywords: ["alternative", "similar", "instead"] },
  { type: TASK_TYPE.RECOMMEND_VENDOR, label: "Recommend Vendor", keywords: ["vendor", "seller", "store"] },
  { type: TASK_TYPE.RECOMMEND_SIZE, label: "Recommend Size", keywords: ["size", "fit"] },
  { type: TASK_TYPE.RECOMMEND_COLOR, label: "Recommend Color", keywords: ["color", "colour"] },
  { type: TASK_TYPE.RECOMMEND_BUDGET, label: "Recommend Budget", keywords: ["budget", "price", "afford"] },
  { type: TASK_TYPE.BUILD_WISHLIST, label: "Build Wishlist", keywords: ["wishlist", "save", "favorite"] },
  { type: TASK_TYPE.IMPROVE_CART, label: "Improve Cart", keywords: ["cart", "add", "improve"] },
  { type: TASK_TYPE.OPTIMIZE_CHECKOUT, label: "Optimize Checkout", keywords: ["checkout", "pay", "order"] },
  { type: TASK_TYPE.SUGGEST_COUPON, label: "Suggest Coupon", keywords: ["coupon", "discount", "code"] },
  { type: TASK_TYPE.TRACK_ORDER, label: "Track Order", keywords: ["track", "order", "delivery"] },
  { type: TASK_TYPE.ANALYZE_INVENTORY, label: "Analyze Inventory", keywords: ["inventory", "stock"] },
  { type: TASK_TYPE.REVIEW_STORE, label: "Review Store", keywords: ["review", "rating", "feedback"] },
  { type: TASK_TYPE.MARKETING_INSIGHT, label: "Marketing Insight", keywords: ["marketing", "campaign", "promo"] },
];

export const detectTaskType = (input) => {
  const text = (input || "").toLowerCase();
  for (const task of AGENT_TASKS) {
    if (task.keywords.some((k) => text.includes(k))) return task.type;
  }
  return TASK_TYPE.FIND_PRODUCT;
};

export default { AGENT_TASKS, detectTaskType };
