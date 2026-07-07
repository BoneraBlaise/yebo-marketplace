import { useMemo, useCallback } from "react";
import { createCommerceEngine } from "../../ai/commerce";
import { createInfrastructureEngine } from "../../ai/infrastructure";
import { createExperienceOrchestrator } from "../../ai/experience";

/** AI Experience Platform hook — full stack via Experience Services — Phase 8H.5 */
export const useAIExperiencePlatform = (userId = "demo-user") => {
  const orchestrator = useMemo(() => {
    const commerce = createCommerceEngine({ vendorId: userId });
    const infrastructure = createInfrastructureEngine({
      commercePreviewCache: commerce.previewCache,
    });
    const exp = createExperienceOrchestrator({
      commerceEngine: commerce,
      infrastructureEngine: infrastructure,
    });
    exp.initialize({ vendorId: userId });
    infrastructure.initialize();
    return { exp, commerce, infrastructure };
  }, [userId]);

  const { exp: orchestratorExp, commerce, infrastructure } = orchestrator;
  const customer = orchestratorExp.customer;

  const createPreview = useCallback(({ ai_preview_type, productId, inputs }) =>
    customer.createPreviewSession({ userId, ai_preview_type, productId, inputs }), [customer, userId]);

  const getSessions = useCallback(() => customer.getPreviewSessions(userId), [customer, userId]);
  const getProgress = useCallback((sessionId) => customer.getPreviewProgress(sessionId, userId), [customer, userId]);
  const getHistory = useCallback((options) => customer.getPreviewHistory(userId, options), [customer, userId]);
  const getAssets = useCallback(() => customer.getGeneratedAssets(userId), [customer, userId]);
  const getJob = useCallback((jobId) => customer.getJobStatus(jobId, userId), [customer, userId]);
  const getDownload = useCallback((assetId) => customer.getAssetDownload(assetId, userId), [customer, userId]);
  const getSharing = useCallback((assetId) => customer.getAssetSharing(assetId, userId), [customer, userId]);

  const getCredits = useCallback(() => {
    const wallet = commerce.wallet?.getSnapshot() || {};
    return {
      remaining: wallet.remainingCredits ?? 0,
      consumed: wallet.consumedCredits ?? 0,
      allocated: wallet.monthlyAllocation ?? 0,
      nextResetAt: wallet.nextResetAt ?? null,
    };
  }, [commerce]);

  const getSubscription = useCallback(() => {
    const sub = commerce.subscription?.getSubscription(userId);
    return { plan: sub?.plan?.label || "Starter", active: sub?.active !== false };
  }, [commerce, userId]);

  const getJobs = useCallback(() => infrastructure.jobs?.list() || [], [infrastructure]);

  const getRecommendations = useCallback(() =>
    commerce.recommendations?.generate(userId) || [], [commerce, userId]);

  const estimateCost = useCallback((ai_preview_type) =>
    commerce.creditPolicy?.getCost?.(ai_preview_type) ?? 1, [commerce]);

  return {
    orchestrator: orchestratorExp,
    createPreview,
    getSessions,
    getProgress,
    getHistory,
    getAssets,
    getJob,
    getDownload,
    getSharing,
    getCredits,
    getSubscription,
    getJobs,
    getRecommendations,
    estimateCost,
  };
};

export default useAIExperiencePlatform;
