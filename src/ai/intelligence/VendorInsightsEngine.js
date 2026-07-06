/** Vendor intelligence insights — mock */
export class VendorInsightsEngine {
  static generate(memory = {}) {
    const vendor = memory.dashboards?.vendor || {};
    return {
      trendingInterests: vendor.recentInterests || [],
      topComparisons: vendor.frequentlyCompared || [],
      restockHint: vendor.restockHint,
      confidence: 82,
      reason: "Based on session customer interest signals.",
    };
  }
}

export default VendorInsightsEngine;
