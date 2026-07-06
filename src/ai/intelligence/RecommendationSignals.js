import { buildMockSignals, MOCK_SIGNAL_LABELS } from "./MockSignals";
import { INTELLIGENCE_SIGNAL } from "./IntelligenceTypes";

/** Signal extraction from memory snapshot */
export class RecommendationSignals {
  static fromMemory(memory = {}) {
    const raw = buildMockSignals(memory);
    return Object.entries(raw).map(([key, strength]) => ({
      id: key,
      type: INTELLIGENCE_SIGNAL[key.toUpperCase()] || key,
      label: MOCK_SIGNAL_LABELS[key] || key,
      strength,
      source: "memory",
    }));
  }

  static top(signals, limit = 5) {
    return [...signals].sort((a, b) => b.strength - a.strength).slice(0, limit);
  }
}

export default RecommendationSignals;
