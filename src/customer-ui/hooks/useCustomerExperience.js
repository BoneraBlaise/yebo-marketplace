import { useMemo } from "react";
import { createExperienceOrchestrator } from "../../ai/experience";

/** Customer experience hook — uses Experience Services only — Phase 8H.2 */
export const useCustomerExperience = (userId = "demo-user") => {
  const orchestrator = useMemo(() => createExperienceOrchestrator(), []);

  const getPreviewSessions = () => orchestrator.customer.getPreviewSessions(userId);
  const getPreviewHistory = (options) => orchestrator.customer.getPreviewHistory(userId, options);
  const getGeneratedAssets = () => orchestrator.customer.getGeneratedAssets(userId);
  const getPreviewProgress = (sessionId) => orchestrator.customer.getPreviewProgress(sessionId, userId);

  return {
    orchestrator,
    getPreviewSessions,
    getPreviewHistory,
    getGeneratedAssets,
    getPreviewProgress,
    contracts: orchestrator.getContracts("customer"),
  };
};

export default useCustomerExperience;
