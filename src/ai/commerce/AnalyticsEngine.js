import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Analytics Engine — Phase 8D */
export class AnalyticsEngine {
  constructor({ usageEngine = null } = {}) {
    this.usageEngine = usageEngine;
    this.adoptionEvents = [];
    this.featureUsage = new Map();
  }

  trackAdoption({ vendorId, feature, metadata = {} } = {}) {
    const entry = { vendorId, feature, timestamp: new Date().toISOString(), metadata };
    this.adoptionEvents.push(entry);
    const key = `${vendorId}:${feature}`;
    this.featureUsage.set(key, (this.featureUsage.get(key) || 0) + 1);
    logCommerceDiagnostics("analytics", { event: "adoption", feature });
    return entry;
  }

  getAnalytics(vendorId = null) {
    const usage = this.usageEngine?.getUsage(vendorId) || [];
    const creditsConsumed = usage.reduce((sum, r) => sum + r.credits, 0);
    const byService = this.usageEngine?.getUsageByService(vendorId) || {};

    const previewTypes = {};
    usage
      .filter((r) => r.metadata?.ai_preview_type)
      .forEach((r) => {
        const t = r.metadata.ai_preview_type;
        previewTypes[t] = (previewTypes[t] || 0) + 1;
      });

    const productUsage = {};
    usage
      .filter((r) => r.metadata?.productId)
      .forEach((r) => {
        const p = r.metadata.productId;
        productUsage[p] = (productUsage[p] || 0) + 1;
      });

    const topProducts = Object.entries(productUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId, count]) => ({ productId, count }));

    const topPreviewTypes = Object.entries(previewTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ai_preview_type, count]) => ({ ai_preview_type, count }));

    const adoption = vendorId
      ? this.adoptionEvents.filter((e) => e.vendorId === vendorId)
      : this.adoptionEvents;

    return {
      aiUsageCount: usage.length,
      creditsConsumed,
      usageByService: byService,
      topProducts,
      topPreviewTypes,
      customerAdoption: adoption.length,
      featurePopularity: Object.fromEntries(this.featureUsage),
      usageTrends: this._buildTrends(usage),
    };
  }

  _buildTrends(usage) {
    const byDay = {};
    usage.forEach((r) => {
      const day = r.timestamp.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });
    return byDay;
  }
}

export const createAnalyticsEngine = (options) => new AnalyticsEngine(options);

export default AnalyticsEngine;
