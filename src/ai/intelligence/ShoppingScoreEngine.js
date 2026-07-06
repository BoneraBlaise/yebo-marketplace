import { normalizeScore } from "./IntelligenceHelpers";
import { SCORE_TYPE } from "./IntelligenceTypes";

/** Mock shopping scores — architecture only */
export class ShoppingScoreEngine {
  static computeAll(signals = {}, profile = {}) {
    const base = signals.preference || signals.brand_affinity || 65;
    return {
      [SCORE_TYPE.PURCHASE_LIKELIHOOD]: normalizeScore(base + (signals.cart || 0) * 0.1),
      [SCORE_TYPE.DISCOVERY]: normalizeScore(signals.recent_views || 60),
      [SCORE_TYPE.BUNDLE]: normalizeScore((signals.cart || 40) + 15),
      [SCORE_TYPE.FASHION_MATCH]: normalizeScore((profile.preferredColors?.length || 1) * 20),
      [SCORE_TYPE.TREND]: normalizeScore(signals.trending || 68),
      [SCORE_TYPE.PRICE_VALUE]: normalizeScore(signals.discount || 62),
      [SCORE_TYPE.URGENCY]: normalizeScore(signals.inventory ? 100 - signals.inventory : 35),
      [SCORE_TYPE.CUSTOMER_FIT]: normalizeScore(signals.customer_similarity || 71),
      [SCORE_TYPE.VENDOR_QUALITY]: normalizeScore(signals.vendor_affinity || 60),
    };
  }

  static get(scores, type) {
    return scores[type] ?? null;
  }
}

export default ShoppingScoreEngine;
