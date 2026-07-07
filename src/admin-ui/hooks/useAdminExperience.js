import { useMemo } from "react";
import { createCommerceEngine } from "../../ai/commerce";
import { createInfrastructureEngine } from "../../ai/infrastructure";
import { createExperienceOrchestrator } from "../../ai/experience";

/** Admin experience hook — Experience Services + Commerce + Infrastructure — Phase 8H.4 */
export const useAdminExperience = () => {
  const orchestrator = useMemo(() => {
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

  const admin = orchestrator.admin;

  return {
    orchestrator,
    getDiagnostics: () => admin.getDiagnostics(),
    getProviderMonitoring: () => admin.getProviderMonitoring(),
    getJobMonitoring: () => admin.getJobMonitoring(),
    getInfrastructureHealth: () => admin.getInfrastructureHealth(),
    getCostMonitoring: () => admin.getCostMonitoring(),
    getUsageMonitoring: () => admin.getUsageMonitoring(),
  };
};

export default useAdminExperience;
