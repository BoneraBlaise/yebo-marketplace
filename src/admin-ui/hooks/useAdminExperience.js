import { useMemo, useState, useEffect, useCallback } from "react";
import yeboAIService from "../../services/yeboAIService";
import { createCommerceEngine } from "../../ai/commerce";
import { createInfrastructureEngine } from "../../ai/infrastructure";
import { createExperienceOrchestrator } from "../../ai/experience";
import { isLocalAIFallbackEnabled } from "../../ai/gateway/gatewayFallback";

/** Admin experience hook — super-admin gateway endpoints; local fallback only with dev flag */
export const useAdminExperience = () => {
  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(true);

  const localOrchestrator = useMemo(() => {
    if (!isLocalAIFallbackEnabled()) return null;
    const commerce = createCommerceEngine({ vendorId: "platform" });
    const infrastructure = createInfrastructureEngine({
      commercePreviewCache: commerce.previewCache,
    });
    const exp = createExperienceOrchestrator({
      commerceEngine: commerce,
      infrastructureEngine: infrastructure,
    });
    exp.initialize({ vendorId: "platform" });
    infrastructure.initialize();
    return exp;
  }, []);

  const loadRemote = useCallback(async () => {
    setLoading(true);
    try {
      const [health, analytics] = await Promise.all([
        yeboAIService.health(),
        yeboAIService.getAdminAnalytics?.().catch(() => null),
      ]);
      setRemote({
        health: health?.data || health,
        analytics: analytics?.data || analytics,
      });
    } catch {
      setRemote(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRemote();
  }, [loadRemote]);

  const getDiagnostics = () => {
    if (remote) {
      return {
        providers: remote.health?.providers || {},
        jobs: remote.health?.metrics || {},
        infrastructure: remote.health || {},
        costs: remote.analytics?.runtime || {},
        usage: remote.analytics?.persisted || {},
        diagnostics: { gateway: true, displayBrand: "YEBO AI" },
      };
    }
    return localOrchestrator?.admin.getDiagnostics() || {
      providers: { yebo_ai: { status: "active", displayBrand: "YEBO AI" } },
      diagnostics: { gateway: true },
    };
  };

  const getProviderMonitoring = () => {
    if (remote?.health?.providers) {
      const providers = remote.health.providers;
      if (providers.yebo_ai) {
        return [{ ...providers.yebo_ai, source: "YEBO AI Gateway" }];
      }
      return Object.entries(providers).map(([id, value]) => ({
        id,
        ...value,
        source: "Super Admin",
      }));
    }
    return localOrchestrator?.admin.getProviderMonitoring() || [
      { status: "active", displayBrand: "YEBO AI", source: "YEBO AI Gateway" },
    ];
  };

  const getJobMonitoring = () =>
    remote?.health?.metrics || localOrchestrator?.admin.getJobMonitoring() || { total: 0 };

  const getInfrastructureHealth = () =>
    remote?.health || localOrchestrator?.admin.getInfrastructureHealth() || { gateway: true };

  const getCostMonitoring = () =>
    remote?.analytics?.runtime ||
    localOrchestrator?.admin.getCostMonitoring() ||
    { creditsConsumed: 0, usageByService: {} };

  const getUsageMonitoring = () =>
    remote?.analytics?.persisted ||
    localOrchestrator?.admin.getUsageMonitoring() ||
    { commerce: {}, infrastructure: {} };

  return {
    orchestrator: localOrchestrator,
    loading,
    refresh: loadRemote,
    getDiagnostics,
    getProviderMonitoring,
    getJobMonitoring,
    getInfrastructureHealth,
    getCostMonitoring,
    getUsageMonitoring,
  };
};

export default useAdminExperience;
