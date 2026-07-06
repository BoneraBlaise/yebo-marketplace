import { createDecision } from "./DecisionHelpers";
import { DecisionReasoning } from "./DecisionReasoning";
import { DECISION_TYPE, DECISION_SOURCE } from "./DecisionTypes";
import RecommendationEngine from "./RecommendationEngine";

/** Shopping-surface decision methods. */
export class ShoppingDecisionEngine extends RecommendationEngine {
  recommendVendors() {
    const vendors = this._memory().session?.recentVendors || [];
    return vendors.slice(0, 2).map((v, i) =>
      createDecision({
        id: `rec-vendor-${v.id || i}`,
        type: DECISION_TYPE.VENDOR,
        title: v.name || "Trusted vendor",
        description: "Vendor match from your session.",
        confidence: 80,
        reason: DecisionReasoning.fromRule("vendor_reputation", this._memory()),
        priority: i + 2,
        source: DECISION_SOURCE.MEMORY,
        action: "Visit store",
      })
    );
  }

  recommendBundles() {
    return [
      createDecision({
        id: "rec-bundle-1",
        type: DECISION_TYPE.BUNDLE,
        title: "Running shoes + socks bundle",
        description: "Save 12% when bought together — mock.",
        confidence: 84,
        reason: DecisionReasoning.fromRule("cart", this._memory()),
        priority: 2,
        source: DECISION_SOURCE.RULE,
        action: "View bundle",
        metadata: { savings: "12%" },
      }),
    ];
  }

  recommendSize() {
    const size = this._memory().preferences?.favoriteSizes?.[0] || "42";
    return [
      createDecision({
        id: "rec-size",
        type: DECISION_TYPE.SIZE,
        title: `Size ${size}`,
        description: "Recommended size from your profile.",
        confidence: 86,
        reason: DecisionReasoning.fromRule("preferred_size", this._memory()),
        priority: 3,
        source: DECISION_SOURCE.RULE,
        action: "Apply size filter",
      }),
    ];
  }

  recommendColor() {
    const color = this._memory().preferences?.favoriteColors?.[0] || "Black";
    return [
      createDecision({
        id: "rec-color",
        type: DECISION_TYPE.COLOR,
        title: color,
        description: "Color match from preferences.",
        confidence: 79,
        reason: DecisionReasoning.fromRule("favorite_colors", this._memory()),
        priority: 3,
        source: DECISION_SOURCE.RULE,
      }),
    ];
  }

  recommendBudget() {
    const range = this._memory().preferences?.budgetRange;
    return [
      createDecision({
        id: "rec-budget",
        type: DECISION_TYPE.BUDGET,
        title: range ? `${range.min?.toLocaleString()} – ${range.max?.toLocaleString()} ${range.currency || "RWF"}` : "Under 150,000 RWF",
        description: "Budget guidance from your preferences.",
        confidence: 88,
        reason: DecisionReasoning.fromRule("budget", this._memory()),
        priority: 2,
        source: DECISION_SOURCE.RULE,
        action: "Filter by budget",
      }),
    ];
  }

  recommendCoupons() {
    return [
      createDecision({
        id: "rec-coupon",
        type: DECISION_TYPE.COUPON,
        title: "YEBO10",
        description: "10% off eligible items — mock coupon.",
        confidence: 72,
        reason: "Because you are close to checkout.",
        priority: 3,
        source: DECISION_SOURCE.MOCK,
        action: "Apply coupon",
      }),
    ];
  }

  recommendShipping() {
    return [
      createDecision({
        id: "rec-shipping",
        type: DECISION_TYPE.SHIPPING,
        title: "Express delivery",
        description: "Arrives in 2–3 days in Kigali — mock.",
        confidence: 81,
        reason: "Because express fits your recent order pattern.",
        priority: 3,
        source: DECISION_SOURCE.MOCK,
        action: "Select shipping",
      }),
    ];
  }

  recommendPayment() {
    return [
      createDecision({
        id: "rec-payment",
        type: DECISION_TYPE.PAYMENT,
        title: "Mobile Money",
        description: "Most used payment in your region — mock.",
        confidence: 90,
        reason: "Because Mobile Money is popular near you.",
        priority: 3,
        source: DECISION_SOURCE.MOCK,
        action: "Choose payment",
      }),
    ];
  }

  recommendSearch() {
    const q = this._memory().search?.recent?.[0];
    return [
      createDecision({
        id: "rec-search",
        type: DECISION_TYPE.SEARCH,
        title: q || "white sneakers under 50000 RWF",
        description: "Resume your recent search.",
        confidence: 85,
        reason: DecisionReasoning.forSearch(q),
        priority: 1,
        source: DECISION_SOURCE.MEMORY,
        action: "Search again",
      }),
    ];
  }

  recommendTrending() {
    return [
      createDecision({
        id: "rec-trending",
        type: DECISION_TYPE.TRENDING,
        title: "Running shoes",
        description: "Trending this week across Yebone.",
        confidence: 76,
        reason: DecisionReasoning.fromRule("trending", this._memory()),
        priority: 2,
        source: DECISION_SOURCE.RULE,
        action: "Explore trending",
      }),
    ];
  }

  /** Aggregate shopping decisions for a scope */
  forScope(scope) {
    this.ctx.activate(scope);
    return [
      ...this.recommendNextAction(),
      ...this.recommendProducts(2),
      ...this.recommendSearch(),
      ...this.recommendTrending(),
      ...this.recommendBundles(),
    ];
  }
}

export default ShoppingDecisionEngine;
