import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Usage Engine — Phase 8D */
export class UsageEngine {
  constructor({ creditPolicyEngine = null } = {}) {
    this.creditPolicy = creditPolicyEngine;
    this.records = [];
  }

  recordUsage({ vendorId, service, featureKey, credits, metadata = {} } = {}) {
    const cost = credits ?? this.creditPolicy?.getCost(featureKey || service) ?? 0;
    const entry = {
      id: `usage-${Date.now()}-${this.records.length}`,
      vendorId,
      service,
      featureKey: featureKey || service,
      credits: cost,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.records.push(entry);
    logCommerceDiagnostics("usage", { service, featureKey: entry.featureKey, credits: cost });
    return entry;
  }

  getUsage(vendorId = null, options = {}) {
    let filtered = this.records;
    if (vendorId) filtered = filtered.filter((r) => r.vendorId === vendorId);
    if (options.service) filtered = filtered.filter((r) => r.service === options.service);
    if (options.since) {
      const since = new Date(options.since).getTime();
      filtered = filtered.filter((r) => new Date(r.timestamp).getTime() >= since);
    }
    return filtered;
  }

  getTotalCreditsConsumed(vendorId = null) {
    return this.getUsage(vendorId).reduce((sum, r) => sum + r.credits, 0);
  }

  getUsageByService(vendorId = null) {
    const usage = this.getUsage(vendorId);
    return usage.reduce((acc, r) => {
      acc[r.service] = (acc[r.service] || 0) + r.credits;
      return acc;
    }, {});
  }
}

export const createUsageEngine = (options) => new UsageEngine(options);

export default UsageEngine;
