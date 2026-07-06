/** Recommendation strategies registry — architecture only */

export const RECOMMENDATION_STRATEGIES = {
  PERSONALIZED: "personalized",
  TRENDING: "trending",
  SIMILAR_CUSTOMERS: "similar_customers",
  BUNDLE: "bundle",
  BUDGET: "budget",
  VENDOR: "vendor",
};

export class RecommendationRegistry {
  static list() {
    return { ...RECOMMENDATION_STRATEGIES };
  }

  static get(id) {
    return RECOMMENDATION_STRATEGIES[id] || null;
  }
}

export default RecommendationRegistry;
