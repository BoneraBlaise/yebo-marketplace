import { mergeCommerceConfig } from "./CommerceConfig";
import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Subscription Service — Phase 8D */
export class SubscriptionService {
  constructor({ config = null } = {}) {
    this.config = mergeCommerceConfig(config);
    this.currentPlanId = this.config.defaultPlan;
    this.subscriptions = new Map();
  }

  getPlans() {
    return { ...this.config.subscriptionPlans };
  }

  getPlan(planId = this.currentPlanId) {
    return this.config.subscriptionPlans[planId] || null;
  }

  getCurrentPlan() {
    return this.getPlan(this.currentPlanId);
  }

  subscribe(vendorId, planId) {
    const plan = this.getPlan(planId);
    if (!plan) throw new Error(`SubscriptionService: unknown plan "${planId}"`);

    const subscription = {
      vendorId,
      planId,
      plan,
      startedAt: new Date().toISOString(),
      active: true,
    };

    this.subscriptions.set(vendorId, subscription);
    logCommerceDiagnostics("subscription", { vendorId, planId, monthlyCredits: plan.monthlyCredits });
    return subscription;
  }

  getSubscription(vendorId) {
    return this.subscriptions.get(vendorId) || {
      vendorId,
      planId: this.currentPlanId,
      plan: this.getCurrentPlan(),
      active: true,
    };
  }

  getUpgradePath(planId = this.currentPlanId) {
    const plan = this.getPlan(planId);
    return plan?.upgradePath || null;
  }

  canUpgrade(vendorId) {
    const sub = this.getSubscription(vendorId);
    return Boolean(this.getUpgradePath(sub.planId));
  }
}

export const createSubscriptionService = (options) => new SubscriptionService(options);

export default SubscriptionService;
