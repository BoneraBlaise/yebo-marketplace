/**
 * YIP Shopping Intelligence — mock intelligence engine (Phase 7C).
 * All methods return placeholders. No external AI calls.
 */
import { YIPAnalytics } from "../utils/analytics";
import {
  MOCK_SMART_SEARCH,
  MOCK_COMPARISON,
  MOCK_BUDGET_ADVICE,
  MOCK_GIFT_RESULTS,
  PROACTIVE_SUGGESTIONS,
  SHOPPING_TIPS,
} from "./yipMockData";

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const YIPShoppingIntelligence = {
  async smartSearch(query, products = []) {
    await delay(700 + Math.random() * 300);
    const result = MOCK_SMART_SEARCH(query, products);
    YIPAnalytics.trackSearch(query);
    return result;
  },

  async compareProducts(products = []) {
    await delay(500);
    return MOCK_COMPARISON(products);
  },

  async budgetAdvice(selection) {
    await delay(400);
    return MOCK_BUDGET_ADVICE(selection);
  },

  async giftFinder(categoryId) {
    await delay(400);
    YIPAnalytics.trackRecommendation("gift-finder", { categoryId });
    return MOCK_GIFT_RESULTS(categoryId);
  },

  getProactiveSuggestions(_memorySnapshot = {}) {
    return PROACTIVE_SUGGESTIONS;
  },

  getShoppingTips() {
    return SHOPPING_TIPS;
  },

  summarizeProduct(_product, category) {
    return {
      headline: `Why YEBO recommends this ${category || "product"}`,
      confidence: 87,
      summary:
        "Strong match for value, seller trust, and regional popularity — mock intelligence via YIP.",
    };
  },
};

export default YIPShoppingIntelligence;
