import { createDecision } from "./DecisionHelpers";
import { DecisionReasoning } from "./DecisionReasoning";
import { DECISION_TYPE, DECISION_SOURCE } from "./DecisionTypes";
import { getActiveRules } from "./DecisionRules";

/** Base recommendation engine — mock structured decisions from memory. */
export class RecommendationEngine {
  constructor(decisionContext) {
    this.ctx = decisionContext;
  }

  _memory() {
    return this.ctx.getMemory();
  }

  _reason(ruleId) {
    return DecisionReasoning.fromRule(ruleId, this._memory());
  }

  recommendProducts(limit = 3) {
    const viewed = this._memory().session?.visitedProducts || [];
    return viewed.slice(0, limit).map((p, i) =>
      createDecision({
        id: `rec-product-${p.id || i}`,
        type: DECISION_TYPE.PRODUCT,
        title: p.name || "Recommended product",
        description: "Strong match from your session — mock via YEBO Decision Engine.",
        confidence: 82 + i * 2,
        reason: DecisionReasoning.fromRule("recently_viewed", this._memory()),
        priority: i + 1,
        source: DECISION_SOURCE.MEMORY,
        action: "View product",
        metadata: { productId: p.id, price: p.price },
      })
    );
  }

  recommendCategories() {
    const cats = this._memory().session?.viewedCategories || [];
    return cats.slice(0, 3).map((c, i) =>
      createDecision({
        id: `rec-cat-${c.id || i}`,
        type: DECISION_TYPE.CATEGORY,
        title: c.label || c,
        description: "Category aligned with your browsing.",
        confidence: 78,
        reason: DecisionReasoning.forCategory(c.label || c),
        priority: i + 2,
        source: DECISION_SOURCE.MEMORY,
        action: "Browse category",
      })
    );
  }

  recommendBrands() {
    const brands = this._memory().preferences?.favoriteBrands || ["Nike", "Samsung"];
    return brands.slice(0, 3).map((b, i) =>
      createDecision({
        id: `rec-brand-${i}`,
        type: DECISION_TYPE.BRAND,
        title: b,
        description: "Based on your brand preferences.",
        confidence: 75,
        reason: this._reason("favorite_brands"),
        priority: i + 2,
        source: DECISION_SOURCE.RULE,
        action: "Shop brand",
      })
    );
  }

  recommendNextAction() {
    const goal = this._memory().session?.shoppingGoal;
    return [
      createDecision({
        id: "rec-next-action",
        type: DECISION_TYPE.ACTION,
        title: goal?.label || "Continue shopping",
        description: "YEBO suggests your next best step.",
        confidence: goal?.progress || 70,
        reason: goal ? `Because your goal is: ${goal.label}.` : this._reason("recently_viewed"),
        priority: 1,
        source: DECISION_SOURCE.MEMORY,
        action: "Continue",
      }),
    ];
  }

  getActiveRuleIds() {
    return getActiveRules(this._memory()).map((r) => r.id);
  }
}

export default RecommendationEngine;
