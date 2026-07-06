import { weightedSum, normalizeScore, rankItems } from "./IntelligenceHelpers";
import { getWeightsForScope } from "./RecommendationWeights";
import RecommendationSignals from "./RecommendationSignals";

/** Mock ranking engine — memory + signal based */
export class RankingEngine {
  static rank(decisions = [], memory = {}, scope = "homepage") {
    const signals = RecommendationSignals.fromMemory(memory);
    const signalMap = Object.fromEntries(signals.map((s) => [s.id, s.strength]));
    const weights = getWeightsForScope(scope);

    const ranked = decisions.map((dec, i) => {
      const preference = signalMap.brand_affinity || 60;
      const wishlist = signalMap.wishlist || 40;
      const trending = signalMap.trending || 65;
      const budget = signalMap.price_range || 70;
      const reviews = signalMap.rating || 75;
      const vendor = signalMap.vendor_affinity || 55;

      const score = normalizeScore(
        weightedSum([
          { value: preference, weight: weights.preference },
          { value: wishlist, weight: weights.wishlist },
          { value: trending, weight: weights.trending },
          { value: budget, weight: weights.budget },
          { value: reviews, weight: weights.reviews },
          { value: vendor, weight: weights.vendor_quality },
        ])
      );

      return {
        id: dec.id || `rank-${i}`,
        title: dec.title,
        description: dec.description,
        score,
        confidence: dec.confidence || score,
        type: dec.type,
        action: dec.action,
        metadata: dec.metadata,
        signals: {
          preference,
          wishlist,
          trending,
          budget,
          reviews,
          vendor_quality: vendor,
        },
        weights,
      };
    });

    return rankItems(ranked, "score");
  }
}

export default RankingEngine;
