import {
  createVendorDTO,
  createCreditsDTO,
  createSubscriptionDTO,
  createAnalyticsDTO,
} from "./ExperienceDTOs";
import {
  buildDashboardViewModel,
  buildCreditsViewModel,
  buildAnalyticsViewModel,
  buildSubscriptionViewModel,
} from "./ViewModels";
import { logExperienceDiagnostics } from "./ExperienceDiagnostics";

/** Vendor Experience Service — Phase 8F */
export class VendorExperienceService {
  constructor({ commerce = null, permissions = null } = {}) {
    this.commerce = commerce;
    this.permissions = permissions;
  }

  _check(permission, vendorId) {
    return this.permissions?.check({
      role: "vendor",
      permission,
      userId: vendorId,
    }) || { allowed: true };
  }

  getDashboard(vendorId) {
    this._check("dashboard:read", vendorId);
    const dto = createVendorDTO({
      vendorId,
      credits: this.getCredits(vendorId).dto,
      subscription: this.getSubscription(vendorId).dto,
      billing: this.getBillingSummary(vendorId),
      roi: this.getROI(vendorId),
      analytics: this.getAnalytics(vendorId).dto,
      recommendations: this.getRecommendations(vendorId),
      usage: this.getUsage(vendorId),
    });
    logExperienceDiagnostics("dto", { type: "vendor", vendorId });
    return { dto, viewModel: buildDashboardViewModel(dto) };
  }

  getCredits(vendorId) {
    this._check("credits:read", vendorId);
    const wallet = this.commerce?.wallet?.getSnapshot() || {};
    const dto = createCreditsDTO({
      current: wallet.currentCredits,
      allocated: wallet.monthlyAllocation,
      consumed: wallet.consumedCredits,
      remaining: wallet.remainingCredits,
      nextResetAt: wallet.nextResetAt,
    });
    return { dto, viewModel: buildCreditsViewModel(dto) };
  }

  getSubscription(vendorId) {
    this._check("subscription:read", vendorId);
    const sub = this.commerce?.subscription?.getSubscription(vendorId);
    const plan = sub?.plan || {};
    const dto = createSubscriptionDTO({
      planId: sub?.planId,
      planLabel: plan.label,
      capabilities: plan.capabilities || [],
      limits: plan.limits || {},
      upgradePath: this.commerce?.subscription?.getUpgradePath(sub?.planId),
      active: sub?.active !== false,
    });
    return { dto, viewModel: buildSubscriptionViewModel(dto) };
  }

  getBillingSummary(vendorId) {
    this._check("billing:read", vendorId);
    return this.commerce?.billing?.getBillingState(vendorId) || {};
  }

  getROI(vendorId) {
    this._check("roi:read", vendorId);
    return this.commerce?.roi?.getMetrics(vendorId) || {};
  }

  getAnalytics(vendorId) {
    this._check("analytics:read", vendorId);
    const analytics = this.commerce?.analytics?.getAnalytics(vendorId) || {};
    const dto = createAnalyticsDTO({
      metrics: {
        aiUsageCount: analytics.aiUsageCount,
        creditsConsumed: analytics.creditsConsumed,
        customerAdoption: analytics.customerAdoption,
      },
      trends: analytics.usageTrends || {},
      topItems: [
        ...(analytics.topProducts || []),
        ...(analytics.topPreviewTypes || []),
      ],
    });
    return { dto, viewModel: buildAnalyticsViewModel(dto) };
  }

  getRecommendations(vendorId) {
    this._check("recommendations:read", vendorId);
    return this.commerce?.recommendations?.generate(vendorId) || [];
  }

  getUsage(vendorId) {
    this._check("usage:read", vendorId);
    return {
      byService: this.commerce?.usage?.getUsageByService(vendorId) || {},
      totalCredits: this.commerce?.usage?.getTotalCreditsConsumed(vendorId) || 0,
    };
  }
}

export const createVendorExperienceService = (options) => new VendorExperienceService(options);

export default VendorExperienceService;
