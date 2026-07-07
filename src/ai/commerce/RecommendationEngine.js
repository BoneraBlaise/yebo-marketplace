import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Recommendation Engine — rule-driven vendor recommendations — Phase 8D */
export class RecommendationEngine {
  constructor({ analyticsEngine = null, billingEngine = null, roiEngine = null } = {}) {
    this.analytics = analyticsEngine;
    this.billing = billingEngine;
    this.roi = roiEngine;
    this.rules = [
      {
        id: "increase_product_photos",
        when: ({ analytics }) => (analytics?.topProducts?.length || 0) < 3,
        recommend: () => "Increase product photos to improve AI preview quality.",
      },
      {
        id: "promote_high_performers",
        when: ({ analytics }) => (analytics?.topProducts?.[0]?.count || 0) > 5,
        recommend: ({ analytics }) =>
          `Promote high-performing product ${analytics.topProducts[0].productId}.`,
      },
      {
        id: "upgrade_subscription",
        when: ({ billing }) => billing?.upgradeEligible && (billing?.remainingCredits || 0) < 20,
        recommend: ({ billing }) =>
          `Upgrade to ${billing.upgradePath} for more credits and capabilities.`,
      },
      {
        id: "use_ai_preview",
        when: ({ roi }) => (roi?.aiPreviews || 0) === 0,
        recommend: () => "Use AI Preview to increase customer engagement and conversion.",
      },
      {
        id: "reduce_ai_costs",
        when: ({ analytics, billing }) =>
          (analytics?.creditsConsumed || 0) > (billing?.monthlyAllocation || 0) * 0.8,
        recommend: () => "Reduce AI costs by enabling preview cache and optimizing usage.",
      },
      {
        id: "improve_conversion",
        when: ({ roi }) => (roi?.conversionIncrease || 0) < 0.05 && (roi?.aiPreviews || 0) > 10,
        recommend: () => "Improve conversion by adding more preview types for top products.",
      },
    ];
  }

  generate(vendorId) {
    const analytics = this.analytics?.getAnalytics(vendorId) || {};
    const billing = this.billing?.getBillingState(vendorId) || {};
    const roi = this.roi?.getMetrics(vendorId) || {};
    const context = { analytics, billing, roi, vendorId };

    const recommendations = this.rules
      .filter((rule) => {
        try {
          return rule.when(context);
        } catch {
          return false;
        }
      })
      .map((rule) => ({
        id: rule.id,
        message: rule.recommend(context),
        vendorId,
        generatedAt: new Date().toISOString(),
      }));

    logCommerceDiagnostics("recommendations", { vendorId, count: recommendations.length });
    return recommendations;
  }

  registerRule(rule) {
    this.rules.push(rule);
    return rule;
  }
}

export const createRecommendationEngine = (options) => new RecommendationEngine(options);

export default RecommendationEngine;
