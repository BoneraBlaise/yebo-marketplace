import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Billing Engine — Phase 8D */
export class BillingEngine {
  constructor({ subscriptionService = null, wallet = null } = {}) {
    this.subscription = subscriptionService;
    this.wallet = wallet;
  }

  getBillingState(vendorId) {
    const sub = this.subscription?.getSubscription(vendorId);
    const wallet = this.wallet?.getSnapshot() || {};
    const now = Date.now();
    const validUntil = wallet.nextResetAt ? new Date(wallet.nextResetAt).getTime() : null;
    const isValid = validUntil ? now < validUntil : true;

    const state = {
      vendorId,
      planId: sub?.planId || null,
      planLabel: sub?.plan?.label || null,
      remainingCredits: wallet.remainingCredits ?? 0,
      monthlyAllocation: wallet.monthlyAllocation ?? 0,
      consumedCredits: wallet.consumedCredits ?? 0,
      subscriptionValid: sub?.active !== false,
      billingValid: isValid,
      cycleStartedAt: wallet.cycleStartedAt || null,
      nextResetAt: wallet.nextResetAt || null,
      upgradeEligible: this.subscription?.canUpgrade(vendorId) || false,
      upgradePath: this.subscription?.getUpgradePath(sub?.planId) || null,
    };

    logCommerceDiagnostics("billing", {
      vendorId,
      remainingCredits: state.remainingCredits,
      upgradeEligible: state.upgradeEligible,
    });

    return state;
  }

  syncWalletFromSubscription(vendorId) {
    const sub = this.subscription?.getSubscription(vendorId);
    if (!sub?.plan || !this.wallet) return null;
    return this.wallet.allocate(sub.plan.monthlyCredits, { vendorId, planId: sub.planId });
  }

  shouldReset(vendorId) {
    const wallet = this.wallet?.getSnapshot();
    if (!wallet?.nextResetAt) return false;
    return Date.now() >= new Date(wallet.nextResetAt).getTime();
  }

  processReset(vendorId) {
    if (!this.shouldReset(vendorId)) return null;
    this.syncWalletFromSubscription(vendorId);
    return this.wallet?.reset();
  }
}

export const createBillingEngine = (options) => new BillingEngine(options);

export default BillingEngine;
