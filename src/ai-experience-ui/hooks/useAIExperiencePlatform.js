import { useMemo, useCallback, useState, useEffect } from "react";
import yeboAIService from "../../services/yeboAIService";
import { createCommerceEngine } from "../../ai/commerce";
import { createInfrastructureEngine } from "../../ai/infrastructure";
import { createExperienceOrchestrator } from "../../ai/experience";
import { isLocalAIFallbackEnabled } from "../../ai/gateway/gatewayFallback";

/** AI Experience Platform hook — gateway-backed; local fallback only with dev flag */
export const useAIExperiencePlatform = (userId = "demo-user") => {
  const [sessions, setSessions] = useState([]);
  const [creditsRemote, setCreditsRemote] = useState(null);
  const [subscriptionRemote, setSubscriptionRemote] = useState(null);

  const localStack = useMemo(() => {
    if (!isLocalAIFallbackEnabled()) return null;
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

  const customer = localStack?.exp?.customer || null;
  const commerce = localStack?.commerce || null;
  const infrastructure = localStack?.infrastructure || null;

  useEffect(() => {
    yeboAIService.getVendorCredits().then((r) => setCreditsRemote(r?.data)).catch(() => {});
    yeboAIService.getVendorSubscription().then((r) => setSubscriptionRemote(r?.data)).catch(() => {});
  }, [userId]);

  const createPreview = useCallback(async ({ ai_preview_type, productId, inputs, vendorId, customerId }) => {
    const response = await yeboAIService.createPreview({
      ai_preview_type,
      productId,
      vendorId,
      customerId: customerId || (userId !== "guest" && userId !== "demo-user" ? userId : null),
      inputs,
      idempotencyKey: `preview-${productId}-${ai_preview_type}-${Date.now()}`,
    });
    const session = response?.data?.session || response?.data;
    if (session) {
      setSessions((prev) => [...prev, session]);
      return session;
    }
    if (customer) {
      const local = customer.createPreviewSession({ userId, ai_preview_type, productId, inputs });
      setSessions((prev) => [...prev, local]);
      return local;
    }
    throw new Error("Preview request failed — YEBO AI gateway unavailable.");
  }, [customer, userId]);

  const getSessions = useCallback(() => ({ previewSessions: sessions }), [sessions]);

  const getProgress = useCallback(
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
              previewImageUrl: session.previewImageUrl || null,
            },
          };
        }
      } catch {
        // fall through
      }
      if (customer) {
        return customer.getPreviewProgress(sessionId, userId);
      }
      return { dto: { sessionId }, viewModel: { status: "unknown", progress: 0 } };
    },
    [customer, userId]
  );

  const getHistory = useCallback(
    (options) => (customer ? customer.getPreviewHistory(userId, options) : { viewModel: { items: sessions } }),
    [customer, sessions, userId]
  );
  const getAssets = useCallback(
    () => (customer ? customer.getGeneratedAssets(userId) : { assets: [] }),
    [customer, userId]
  );
  const getJob = useCallback(
    (jobId) => (customer ? customer.getJobStatus(jobId, userId) : { id: jobId, status: "not_found" }),
    [customer, userId]
  );
  const getDownload = useCallback(
    (assetId) => (customer ? customer.getAssetDownload(assetId, userId) : { ok: false }),
    [customer, userId]
  );
  const getSharing = useCallback(
    (assetId) => (customer ? customer.getAssetSharing(assetId, userId) : { shareable: false }),
    [customer, userId]
  );

  const getCredits = useCallback(() => {
    if (creditsRemote) {
      return {
        remaining: creditsRemote.remainingCredits ?? creditsRemote.currentCredits ?? 0,
        consumed: creditsRemote.consumedCredits ?? 0,
        allocated: creditsRemote.monthlyAllocation ?? 0,
        nextResetAt: creditsRemote.nextResetAt ?? null,
      };
    }
    const wallet = commerce?.wallet?.getSnapshot() || {};
    return {
      remaining: wallet.remainingCredits ?? 0,
      consumed: wallet.consumedCredits ?? 0,
      allocated: wallet.monthlyAllocation ?? 0,
      nextResetAt: wallet.nextResetAt ?? null,
    };
  }, [commerce, creditsRemote]);

  const getSubscription = useCallback(() => {
    if (subscriptionRemote) {
      return { plan: subscriptionRemote.planLabel || subscriptionRemote.planId || "Starter", active: subscriptionRemote.active !== false };
    }
    const sub = commerce?.subscription?.getSubscription(userId);
    return { plan: sub?.plan?.label || "Starter", active: sub?.active !== false };
  }, [commerce, subscriptionRemote, userId]);

  const getJobs = useCallback(() => infrastructure?.jobs?.list() || [], [infrastructure]);
  const getRecommendations = useCallback(
    () => commerce?.recommendations?.generate(userId) || [],
    [commerce, userId]
  );
  const estimateCost = useCallback(
    (ai_preview_type) => commerce?.creditPolicy?.getCost?.(ai_preview_type) ?? 1,
    [commerce]
  );

  return {
    orchestrator: localStack?.exp || null,
    commerce,
    infrastructure,
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
