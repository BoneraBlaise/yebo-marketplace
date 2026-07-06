import RecommendationPipeline from "./RecommendationPipeline";
import PersonalizationEngine from "./PersonalizationEngine";
import ShoppingScoreEngine from "./ShoppingScoreEngine";
import ConfidenceEngine from "./ConfidenceEngine";
import VendorInsightsEngine from "./VendorInsightsEngine";
import AdminInsightsEngine from "./AdminInsightsEngine";
import IntelligenceContext from "./IntelligenceContext";
import { SHOPPING_SCOPES } from "../memory/YEBOShoppingContext";

/**
 * YEBO Intelligence Engine — transforms Memory + Decision into ranked intelligence.
 * Phase 7F — mock only, no ML providers.
 */
export class YEBOIntelligenceEngine {
  constructor({ memoryEngine, decisionEngine } = {}) {
    this.context = new IntelligenceContext({ memoryEngine, decisionEngine });
    this.pipeline = new RecommendationPipeline({
      getMemory: () => this.context.getMemory(),
      getDecisions: (scope) => this.context.getDecisions(scope),
    });
    this._scores = {};
  }

  getRankedRecommendations(scope = SHOPPING_SCOPES.HOMEPAGE) {
    this.context.setScope(scope);
    const result = this.pipeline.run(scope);
    this._scores[scope] = result.scores;
    return result.recommendations;
  }

  getShoppingScore(type, scope = SHOPPING_SCOPES.HOMEPAGE) {
    if (!this._scores[scope]) this.getRankedRecommendations(scope);
    return ShoppingScoreEngine.get(this._scores[scope], type);
  }

  getConfidence(recommendationId, scope = SHOPPING_SCOPES.HOMEPAGE) {
    const cached = this.pipeline.getCached(scope);
    const rec = cached?.recommendations?.find((r) => r.id === recommendationId);
    if (rec?.confidenceDetail) return rec.confidenceDetail;
    return ConfidenceEngine.evaluate(rec || {}, this.context.getMemory());
  }

  getRecommendationReason(id) {
    return this.pipeline.getReason(id);
  }

  getPersonalization() {
    return PersonalizationEngine.buildProfile(this.context.getMemory());
  }

  getVendorInsights() {
    return VendorInsightsEngine.generate(this.context.getMemory());
  }

  getAdminInsights() {
    return AdminInsightsEngine.generate(this.context.getMemory());
  }

  getSnapshot() {
    return {
      context: this.context.getSnapshot(),
      personalization: this.getPersonalization(),
      vendor: this.getVendorInsights(),
      admin: this.getAdminInsights(),
      cachedScopes: Object.keys(this.pipeline._cache || {}),
    };
  }
}

export const createYEBOIntelligenceEngine = (deps) => new YEBOIntelligenceEngine(deps);

export default YEBOIntelligenceEngine;
