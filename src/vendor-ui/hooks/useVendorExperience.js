import { useMemo, useState, useEffect, useCallback } from "react";
import yeboAIService from "../../services/yeboAIService";
import { createCommerceEngine } from "../../ai/commerce";
import { createExperienceOrchestrator } from "../../ai/experience";
import { isLocalAIFallbackEnabled } from "../../ai/gateway/gatewayFallback";

/** Vendor experience hook — backend gateway only in production */
export const useVendorExperience = (vendorId = "demo-vendor") => {
  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(true);

  const localOrchestrator = useMemo(() => {
    if (!isLocalAIFallbackEnabled()) return null;
    const commerce = createCommerceEngine({ vendorId });
    const exp = createExperienceOrchestrator({ commerceEngine: commerce });
    exp.initialize({ vendorId });
    return exp;
  }, [vendorId]);

  const loadRemote = useCallback(async () => {
    setLoading(true);
    try {
      const dashboard = await yeboAIService.getVendorDashboard();
      setRemote(dashboard?.data || dashboard);
    } catch {
      setRemote(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRemote();
  }, [loadRemote]);

  const getDashboard = () => {
    if (remote) {
      return {
        viewModel: {
          credits: remote.credits,
          subscription: remote.subscription,
          usage: remote.usage,
          recommendations: remote.recommendations,
        },
      };
    }
    if (localOrchestrator) {
      return localOrchestrator.vendor.getDashboard(vendorId);
    }
    return { viewModel: { credits: null, subscription: null, usage: null, recommendations: [] } };
  };

  const getCredits = () => {
    if (remote?.credits) {
      return {
        viewModel: {
          remaining: remote.credits.remainingCredits ?? remote.credits.currentCredits ?? 0,
          allocated: remote.credits.monthlyAllocation ?? 0,
          consumed: remote.credits.consumedCredits ?? 0,
        },
      };
    }
    if (localOrchestrator) {
      return localOrchestrator.vendor.getCredits(vendorId);
    }
    return { viewModel: { remaining: 0, allocated: 0, consumed: 0 } };
  };

  const getSubscription = () => {
    if (remote?.subscription) {
      return {
        viewModel: {
          planLabel: remote.subscription.planLabel || remote.subscription.planId,
          active: remote.subscription.active !== false,
        },
      };
    }
    if (localOrchestrator) {
      return localOrchestrator.vendor.getSubscription(vendorId);
    }
    return { viewModel: { planLabel: "Starter", active: false } };
  };

  const getAnalytics = () => {
    if (remote?.usage) {
      return {
        viewModel: {
          metrics: {
            aiUsageCount: remote.usage.previewRequests || 0,
            creditsConsumed: remote.usage.creditsConsumed || 0,
          },
          topItems: remote.history || [],
        },
      };
    }
    if (localOrchestrator) {
      return localOrchestrator.vendor.getAnalytics(vendorId);
    }
    return { viewModel: { metrics: {}, topItems: [] } };
  };

  const getROI = () => {
    if (remote?.usage) {
      return {
        roiPercent: 0,
        revenueLift: remote.usage.revenueGenerated || 0,
      };
    }
    if (localOrchestrator) {
      return localOrchestrator.vendor.getROI(vendorId);
    }
    return { roiPercent: 0, revenueLift: 0 };
  };

  const getRecommendations = () =>
    remote?.recommendations ||
    (localOrchestrator ? localOrchestrator.vendor.getRecommendations(vendorId) : []);

  const getUsage = () => {
    if (remote?.usage) {
      return {
        totalCredits: remote.usage.creditsConsumed || 0,
        byService: {},
      };
    }
    if (localOrchestrator) {
      return localOrchestrator.vendor.getUsage(vendorId);
    }
    return { totalCredits: 0, byService: {} };
  };

  const getBillingSummary = () =>
    localOrchestrator ? localOrchestrator.vendor.getBillingSummary(vendorId) : {};

  return {
    orchestrator: localOrchestrator,
    vendorId,
    loading,
    refresh: loadRemote,
    getDashboard,
    getCredits,
    getSubscription,
    getAnalytics,
    getROI,
    getRecommendations,
    getUsage,
    getBillingSummary,
  };
};

export default useVendorExperience;
