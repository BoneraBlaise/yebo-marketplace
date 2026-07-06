import RecommendationSignals from "./RecommendationSignals";

/** Explainable confidence — mock evidence, never live AI */
export class ConfidenceEngine {
  static evaluate(recommendation = {}, memory = {}) {
    const signals = RecommendationSignals.top(RecommendationSignals.fromMemory(memory), 4);
    const score = recommendation.confidence ?? recommendation.score ?? 75;

    return {
      score: Math.round(score),
      reason: recommendation.reason || "Strong match from session signals and preferences.",
      evidence: signals.map((s) => `${s.label}: ${s.strength}%`),
      signalsUsed: signals.map((s) => s.id),
      level: score >= 85 ? "high" : score >= 70 ? "medium" : "exploratory",
    };
  }
}

export default ConfidenceEngine;
