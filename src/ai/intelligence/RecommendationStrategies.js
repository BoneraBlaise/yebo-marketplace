import { RECOMMENDATION_STRATEGIES } from "./RecommendationRegistry";

/** Strategy presets for ranking pipeline */
export const RecommendationStrategies = {
  forScope(scope) {
    if (scope === "search") return [RECOMMENDATION_STRATEGIES.TRENDING, RECOMMENDATION_STRATEGIES.PERSONALIZED];
    if (scope === "cart" || scope === "checkout") return [RECOMMENDATION_STRATEGIES.BUNDLE, RECOMMENDATION_STRATEGIES.BUDGET];
    if (scope === "vendor-dashboard") return [RECOMMENDATION_STRATEGIES.VENDOR];
    if (scope === "admin-dashboard") return [RECOMMENDATION_STRATEGIES.TRENDING];
    return [RECOMMENDATION_STRATEGIES.PERSONALIZED, RECOMMENDATION_STRATEGIES.SIMILAR_CUSTOMERS];
  },
};

export default RecommendationStrategies;
