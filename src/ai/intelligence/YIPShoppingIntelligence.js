/**
 * YIP Shopping Intelligence — routes through YEBO AI Gateway in production.
 * Mock fallback retained only when REACT_APP_AI_GATEWAY_FALLBACK=true.
 */
import { YIPAnalytics } from "../utils/analytics";
import yeboAIService from "../../services/yeboAIService";
import { YIPGatewayClient } from "../gateway/YIPGatewayClient";
import { isLocalAIFallbackEnabled } from "../gateway/gatewayFallback";
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
    try {
      const response = await YIPGatewayClient.search(query);
      const payload = response?.data || {};
      const toolPayload = payload.tool || {};
      const toolData = toolPayload.data || {};
      const searchProducts = toolPayload.success ? toolData.products || [] : [];
      YIPAnalytics.trackSearch(query);
      return {
        query,
        results: searchProducts.map((product) => ({
          _id: product._id,
          name: product.name,
          discountPrice: product.discountPrice,
          images: product.images,
          shop: product.shop,
          reason: payload.message,
        })),
        summary: payload.message,
        searchRequest: payload.searchRequest || null,
        meta: toolData.meta || null,
        displayBrand: "YEBO AI",
      };
    } catch (err) {
      if (!isLocalAIFallbackEnabled()) throw err;
      await delay(700 + Math.random() * 300);
      const result = MOCK_SMART_SEARCH(query, products);
      YIPAnalytics.trackSearch(query);
      return result;
    }
  },

  async compareProducts(products = []) {
    try {
      return await yeboAIService.compareProducts(products);
    } catch (err) {
      if (!isLocalAIFallbackEnabled()) throw err;
      await delay(500);
      return MOCK_COMPARISON(products);
    }
  },

  async budgetAdvice(selection) {
    try {
      return await yeboAIService.budgetAdvice(selection);
    } catch (err) {
      if (!isLocalAIFallbackEnabled()) throw err;
      await delay(400);
      return MOCK_BUDGET_ADVICE(selection);
    }
  },

  async giftFinder(categoryId) {
    try {
      return await yeboAIService.giftFinder(categoryId);
    } catch (err) {
      if (!isLocalAIFallbackEnabled()) throw err;
      await delay(400);
      YIPAnalytics.trackRecommendation("gift-finder", { categoryId });
      return MOCK_GIFT_RESULTS(categoryId);
    }
  },

  async getProactiveSuggestions(_memorySnapshot = {}) {
    try {
      return await yeboAIService.getProactiveSuggestions();
    } catch (err) {
      if (!isLocalAIFallbackEnabled()) throw err;
      return PROACTIVE_SUGGESTIONS;
    }
  },

  async getShoppingTips() {
    try {
      return await yeboAIService.getShoppingTips();
    } catch (err) {
      if (!isLocalAIFallbackEnabled()) throw err;
      return SHOPPING_TIPS;
    }
  },

  summarizeProduct(_product, category) {
    return {
      headline: `Why YEBO recommends this ${category || "product"}`,
      confidence: 87,
      summary:
        "Strong match for value, seller trust, and regional popularity — via YEBO AI.",
    };
  },
};

export default YIPShoppingIntelligence;
