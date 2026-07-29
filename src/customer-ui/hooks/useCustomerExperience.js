import { useMemo, useCallback, useState, useEffect } from "react";
import yeboAIService from "../../services/yeboAIService";
import { createExperienceOrchestrator } from "../../ai/experience";
import { isLocalAIFallbackEnabled } from "../../ai/gateway/gatewayFallback";

/** Customer experience hook — gateway-backed; local fallback only with REACT_APP_AI_GATEWAY_FALLBACK=true */
export const useCustomerExperience = (userId = "demo-user") => {
  const [remoteSessions, setRemoteSessions] = useState([]);

  const localOrchestrator = useMemo(() => {
    if (!isLocalAIFallbackEnabled()) return null;
    return createExperienceOrchestrator();
  }, []);

  useEffect(() => {
    if (!userId || userId === "guest" || userId === "demo-user") return;
    yeboAIService
      .listCustomerPreviews?.()
      .then((response) => setRemoteSessions(response?.data?.sessions || []))
      .catch(() => {});
  }, [userId]);

  const getPreviewSessions = useCallback(() => {
    if (remoteSessions.length) {
      return { userId, previewSessions: remoteSessions };
    }
    if (localOrchestrator) {
      return localOrchestrator.customer.getPreviewSessions(userId);
    }
    return { userId, previewSessions: [] };
  }, [localOrchestrator, remoteSessions, userId]);

  const getPreviewHistory = useCallback(
    (options) => {
      if (localOrchestrator) {
        return localOrchestrator.customer.getPreviewHistory(userId, options);
      }
      return { dto: { items: remoteSessions, pagination: {} }, viewModel: { items: remoteSessions } };
    },
    [localOrchestrator, remoteSessions, userId]
  );

  const getGeneratedAssets = useCallback(() => {
    if (localOrchestrator) {
      return localOrchestrator.customer.getGeneratedAssets(userId);
    }
    return { userId, assets: [] };
  }, [localOrchestrator, userId]);

  const getPreviewProgress = useCallback(
    async (sessionId) => {
      try {
        const response = await yeboAIService.getPreviewSession(sessionId);
        const session = response?.data?.session || response?.data;
        if (session) {
          return {
            dto: session,
            viewModel: {
              status: session.status,
              progress: session.progress ?? 100,
            },
          };
        }
      } catch {
        // fall through
      }
      if (localOrchestrator) {
        return localOrchestrator.customer.getPreviewProgress(sessionId, userId);
      }
      return { dto: { sessionId, status: "unknown" }, viewModel: { status: "unknown", progress: 0 } };
    },
    [localOrchestrator, userId]
  );

  return {
    orchestrator: localOrchestrator,
    getPreviewSessions,
    getPreviewHistory,
    getGeneratedAssets,
    getPreviewProgress,
    contracts: localOrchestrator?.getContracts("customer") || {},
  };
};

export default useCustomerExperience;
