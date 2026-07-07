import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Capability Engine — Phase 8D */
export class CapabilityEngine {
  constructor({ subscriptionService = null } = {}) {
    this.subscription = subscriptionService;
  }

  getCapabilities(vendorId) {
    const sub = this.subscription?.getSubscription(vendorId);
    return sub?.plan?.capabilities || [];
  }

  isEnabled(vendorId, capability) {
    const caps = this.getCapabilities(vendorId);
    const enabled = caps.includes(capability);
    logCommerceDiagnostics("capability", { vendorId, capability, enabled });
    return enabled;
  }

  getLimits(vendorId) {
    const sub = this.subscription?.getSubscription(vendorId);
    return sub?.plan?.limits || {};
  }

  checkLimit(vendorId, limitKey, currentCount) {
    const limits = this.getLimits(vendorId);
    const max = limits[limitKey];
    if (max === undefined || max === -1) return { allowed: true, unlimited: true };
    return { allowed: currentCount < max, max, current: currentCount };
  }
}

export const createCapabilityEngine = (options) => new CapabilityEngine(options);

export default CapabilityEngine;
