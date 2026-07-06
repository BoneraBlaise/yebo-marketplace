import { rankItems } from "./IntelligenceHelpers";

/** Final ranker — merges scores + confidence */
export class RecommendationRanker {
  static finalize(ranked = [], confidenceMap = {}) {
    return rankItems(
      ranked.map((rec) => ({
        ...rec,
        confidence: confidenceMap[rec.id]?.score ?? rec.confidence,
        confidenceDetail: confidenceMap[rec.id],
      })),
      "score"
    );
  }
}

export default RecommendationRanker;
