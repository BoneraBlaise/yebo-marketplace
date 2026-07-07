/** View Model Layer — UI-ready, no rendering — Phase 8F */

export const buildDashboardViewModel = (vendorDTO = {}) => ({
  view: "dashboard",
  title: "AI Dashboard",
  sections: [
    { id: "credits", label: "Credits", data: vendorDTO.credits || {} },
    { id: "subscription", label: "Subscription", data: vendorDTO.subscription || {} },
    { id: "billing", label: "Billing", data: vendorDTO.billing || {} },
    { id: "roi", label: "ROI", data: vendorDTO.roi || {} },
    { id: "analytics", label: "Analytics", data: vendorDTO.analytics || {} },
    { id: "recommendations", label: "Recommendations", items: vendorDTO.recommendations || [] },
  ],
  generatedAt: new Date().toISOString(),
});

export const buildPreviewViewModel = (previewDTO = {}) => ({
  view: "preview",
  sessionId: previewDTO.sessionId,
  previewType: previewDTO.ai_preview_type,
  progress: previewDTO.progress ?? 0,
  status: previewDTO.status || "pending",
  assetId: previewDTO.assetId || null,
  metadata: previewDTO.metadata || {},
  generatedAt: new Date().toISOString(),
});

export const buildAnalyticsViewModel = (analyticsDTO = {}) => ({
  view: "analytics",
  metrics: analyticsDTO.metrics || {},
  trends: analyticsDTO.trends || {},
  topItems: analyticsDTO.topItems || [],
  generatedAt: new Date().toISOString(),
});

export const buildCreditsViewModel = (creditsDTO = {}) => ({
  view: "credits",
  remaining: creditsDTO.remaining ?? 0,
  allocated: creditsDTO.allocated ?? 0,
  consumed: creditsDTO.consumed ?? 0,
  nextResetAt: creditsDTO.nextResetAt || null,
  progressPercent: creditsDTO.allocated
    ? Math.round(((creditsDTO.consumed || 0) / creditsDTO.allocated) * 100)
    : 0,
  generatedAt: new Date().toISOString(),
});

export const buildHistoryViewModel = (historyDTO = {}) => ({
  view: "history",
  items: historyDTO.items || [],
  pagination: historyDTO.pagination || {},
  generatedAt: new Date().toISOString(),
});

export const buildSubscriptionViewModel = (subscriptionDTO = {}) => ({
  view: "subscription",
  planId: subscriptionDTO.planId,
  planLabel: subscriptionDTO.planLabel,
  capabilities: subscriptionDTO.capabilities || [],
  limits: subscriptionDTO.limits || {},
  upgradePath: subscriptionDTO.upgradePath || null,
  active: subscriptionDTO.active !== false,
  generatedAt: new Date().toISOString(),
});

export const ViewModelBuilder = {
  dashboard: buildDashboardViewModel,
  preview: buildPreviewViewModel,
  analytics: buildAnalyticsViewModel,
  credits: buildCreditsViewModel,
  history: buildHistoryViewModel,
  subscription: buildSubscriptionViewModel,
};

export default ViewModelBuilder;
