import { mergeCommerceConfig } from "./CommerceConfig";
import { createSubscriptionService } from "./SubscriptionService";
import { createCreditsWallet } from "./CreditsWallet";
import { createCreditPolicyEngine } from "./CreditPolicyEngine";
import { createUsageEngine } from "./UsageEngine";
import { createBillingEngine } from "./BillingEngine";
import { createCapabilityEngine } from "./CapabilityEngine";
import { createPreviewCache } from "./PreviewCache";
import { createPreviewOrchestrator } from "./PreviewOrchestrator";
import { createROIEngine } from "./ROIEngine";
import { createAnalyticsEngine } from "./AnalyticsEngine";
import { createRecommendationEngine } from "./RecommendationEngine";
import { createServiceRegistry } from "./ServiceRegistry";
import { createProviderSelectionLayer } from "./ProviderSelectionLayer";
import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** YEBO AI Commerce Platform — main orchestrator — Phase 8D */
export class CommerceEngine {
  constructor({ config = null, factory = null, vendorId = "default" } = {}) {
    this.config = mergeCommerceConfig(config);
    this.vendorId = vendorId;
    this.factory = factory;

    this.subscription = createSubscriptionService({ config: this.config });
    this.creditPolicy = createCreditPolicyEngine({ creditPolicy: this.config.creditPolicy });
    this.wallet = createCreditsWallet({
      monthlyAllocation: this.subscription.getCurrentPlan()?.monthlyCredits || 0,
      billingCycleDays: this.config.billingCycleDays,
    });
    this.usage = createUsageEngine({ creditPolicyEngine: this.creditPolicy });
    this.billing = createBillingEngine({
      subscriptionService: this.subscription,
      wallet: this.wallet,
    });
    this.capabilities = createCapabilityEngine({ subscriptionService: this.subscription });
    this.previewCache = createPreviewCache({ ttlMs: this.config.previewCacheTtlMs });
    this.previewOrchestrator = createPreviewOrchestrator({
      previewCache: this.previewCache,
      creditPolicy: this.creditPolicy,
      capabilityEngine: this.capabilities,
    });
    this.roi = createROIEngine();
    this.analytics = createAnalyticsEngine({ usageEngine: this.usage });
    this.recommendations = createRecommendationEngine({
      analyticsEngine: this.analytics,
      billingEngine: this.billing,
      roiEngine: this.roi,
    });
    this.services = createServiceRegistry();
    this.providerSelection = createProviderSelectionLayer({
      factory,
      config: this.config.providerSelection,
    });

    this._initialized = false;
  }

  initialize(vendorId = this.vendorId, planId = null) {
    const plan = planId || this.config.defaultPlan;
    this.vendorId = vendorId;
    this.subscription.subscribe(vendorId, plan);
    this.billing.syncWalletFromSubscription(vendorId);
    this._initialized = true;
    logCommerceDiagnostics("commerce", { action: "initialized", vendorId, planId: plan });
    return this.getSnapshot();
  }

  setProviderFactory(factory) {
    this.factory = factory;
    this.providerSelection.setFactory(factory);
    return this;
  }

  /**
   * Execute an AI service request through the commerce platform.
   * Routes provider calls via ProviderFactory only.
   */
  async executeService({
    service,
    featureKey = null,
    ai_preview_type = null,
    productId = null,
    inputs = {},
    input = "",
    options = {},
  } = {}) {
    const vendorId = options.vendorId || this.vendorId;
    const key = featureKey || ai_preview_type || service;

    if (!this.capabilities.isEnabled(vendorId, service)) {
      return { ok: false, error: "capability_disabled", service };
    }

    if (ai_preview_type) {
      const orchestration = this.previewOrchestrator.orchestrate({
        vendorId,
        ai_preview_type,
        productId,
        inputs,
      });
      if (!orchestration.ok) return orchestration;

      if (orchestration.fromCache) {
        this.roi.recordPreview({ vendorId, productId, ai_preview_type });
        return { ok: true, orchestration, creditsConsumed: 0, fromCache: true };
      }

      const cost = orchestration.creditCost;
      const debit = this.wallet.consume(cost, { service, featureKey: key, ai_preview_type, productId });
      if (!debit.ok) return { ok: false, error: debit.error, orchestration };

      this.usage.recordUsage({
        vendorId,
        service,
        featureKey: key,
        credits: cost,
        metadata: { ai_preview_type, productId },
      });
      this.analytics.trackAdoption({ vendorId, feature: service });
      this.roi.recordPreview({ vendorId, productId, ai_preview_type });

      const providerResult = this.providerSelection.selectProvider({ service });
      return {
        ok: true,
        orchestration,
        providerSelection: providerResult,
        creditsConsumed: cost,
        billing: this.billing.getBillingState(vendorId),
      };
    }

    const cost = this.creditPolicy.getCost(key);
    const debit = this.wallet.consume(cost, { service, featureKey: key });
    if (!debit.ok) return { ok: false, error: debit.error, service };

    this.usage.recordUsage({ vendorId, service, featureKey: key, credits: cost, metadata: { productId } });
    this.analytics.trackAdoption({ vendorId, feature: service });

    const providerResult = this.providerSelection.selectProvider({ service });
    let providerResponse = null;

    if (providerResult.ok && providerResult.provider && input) {
      try {
        providerResponse = await providerResult.provider.chat(input, options);
      } catch (err) {
        providerResponse = { error: err.message };
      }
    }

    return {
      ok: true,
      service,
      creditsConsumed: cost,
      providerSelection: providerResult,
      providerResponse,
      billing: this.billing.getBillingState(vendorId),
    };
  }

  getSnapshot() {
    return {
      initialized: this._initialized,
      vendorId: this.vendorId,
      subscription: this.subscription.getSubscription(this.vendorId),
      wallet: this.wallet.getSnapshot(),
      billing: this.billing.getBillingState(this.vendorId),
      capabilities: this.capabilities.getCapabilities(this.vendorId),
      analytics: this.analytics.getAnalytics(this.vendorId),
      roi: this.roi.getMetrics(this.vendorId),
      recommendations: this.recommendations.generate(this.vendorId),
      services: this.services.list().map((s) => s.id),
      creditPolicy: this.creditPolicy.getAllPolicies(),
      previewCache: this.previewCache.snapshot(),
    };
  }
}

export const createCommerceEngine = (options) => new CommerceEngine(options);

export default CommerceEngine;
