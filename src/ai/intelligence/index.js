/* YIP Shopping Intelligence (Phase 7C) + YEBO Intelligence Layer (Phase 7F) */

export { YIPShoppingIntelligence, default as YIPShoppingIntelligenceDefault } from "./YIPShoppingIntelligence";
export * from "./yipMockData";

/* Phase 7F — Intelligence Layer */
export { YEBOIntelligenceEngine, createYEBOIntelligenceEngine } from "./YEBOIntelligenceEngine";
export { default as RankingEngine } from "./RankingEngine";
export { default as PersonalizationEngine } from "./PersonalizationEngine";
export { default as ConfidenceEngine } from "./ConfidenceEngine";
export { default as ShoppingScoreEngine } from "./ShoppingScoreEngine";
export { default as RecommendationPipeline } from "./RecommendationPipeline";
export { default as RecommendationRanker } from "./RecommendationRanker";
export { default as RecommendationExplainer } from "./RecommendationExplainer";
export { default as RecommendationSignals } from "./RecommendationSignals";
export { DEFAULT_WEIGHTS, getWeightsForScope } from "./RecommendationWeights";
export { RecommendationRegistry, RECOMMENDATION_STRATEGIES } from "./RecommendationRegistry";
export { default as RecommendationStrategies } from "./RecommendationStrategies";
export { default as UserIntentAnalyzer } from "./UserIntentAnalyzer";
export { default as VendorInsightsEngine } from "./VendorInsightsEngine";
export { default as AdminInsightsEngine } from "./AdminInsightsEngine";
export { IntelligenceContext, createIntelligenceContext } from "./IntelligenceContext";
export { IntelligenceProvider } from "./IntelligenceProvider";
export { useIntelligenceEngine, useIntelligenceEngineOptional } from "./IntelligenceHooks";
export * from "./IntelligenceTypes";
export * from "./IntelligenceHelpers";
export { buildMockSignals } from "./MockSignals";
