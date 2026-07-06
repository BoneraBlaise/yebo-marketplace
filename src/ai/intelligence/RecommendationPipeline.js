import RankingEngine from "./RankingEngine";
import PersonalizationEngine from "./PersonalizationEngine";
import ShoppingScoreEngine from "./ShoppingScoreEngine";
import ConfidenceEngine from "./ConfidenceEngine";
import RecommendationExplainer from "./RecommendationExplainer";
import RecommendationRanker from "./RecommendationRanker";
import RecommendationSignals from "./RecommendationSignals";
import UserIntentAnalyzer from "./UserIntentAnalyzer";
import RecommendationStrategies from "./RecommendationStrategies";
import { buildMockSignals } from "./MockSignals";

/**
 * Memory → Signals → Ranking → Personalization → Scoring → Confidence → Recommendation
 */
export class RecommendationPipeline {
  constructor({ getMemory, getDecisions }) {
    this.getMemory = getMemory;
    this.getDecisions = getDecisions;
    this._cache = {};
    this._reasonIndex = new Map();
  }

  run(scope = "homepage") {
    const memory = this.getMemory();
    const decisions = this.getDecisions(scope) || [];
    const profile = PersonalizationEngine.buildProfile(memory);
    const intent = UserIntentAnalyzer.analyze(memory);
    const strategies = RecommendationStrategies.forScope(scope);
    const signals = buildMockSignals(memory);

    const ranked = RankingEngine.rank(decisions, memory, scope);
    const scores = ShoppingScoreEngine.computeAll(signals, profile);

    const confidenceMap = {};
    const withExplain = ranked.map((rec) => {
      const confidence = ConfidenceEngine.evaluate(rec, memory);
      const explainability = RecommendationExplainer.explain(rec, profile, intent);
      confidenceMap[rec.id] = confidence;
      this._reasonIndex.set(rec.id, {
        reason: confidence.reason,
        explainability,
      });
      return {
        ...rec,
        confidence: confidence.score,
        confidenceDetail: confidence,
        explainability,
        strategies,
        profile,
        intent,
        scores,
      };
    });

    const final = RecommendationRanker.finalize(withExplain, confidenceMap);
    const payload = {
      scope,
      recommendations: final,
      signals: RecommendationSignals.fromMemory(memory),
      profile,
      intent,
      scores,
      strategies,
    };
    this._cache[scope] = payload;
    return payload;
  }

  getReason(id) {
    return this._reasonIndex.get(id) || null;
  }

  getCached(scope) {
    return this._cache[scope] || null;
  }
}

export default RecommendationPipeline;
