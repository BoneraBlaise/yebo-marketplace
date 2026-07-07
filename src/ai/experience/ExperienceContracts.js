import { CONTRACT_PROTOCOL, EXPERIENCE_SURFACE } from "./ExperienceTypes";

/** API Contract Layer — service contracts only, no HTTP — Phase 8F */

export const CUSTOMER_CONTRACTS = {
  getPreviewSessions: {
    id: "customer.preview.sessions",
    method: "getPreviewSessions",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.MOBILE, EXPERIENCE_SURFACE.PUBLIC_API],
    input: { userId: "string" },
    output: "PreviewSessionDTO[]",
  },
  getPreviewProgress: {
    id: "customer.preview.progress",
    method: "getPreviewProgress",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.MOBILE],
    input: { sessionId: "string" },
    output: "PreviewDTO",
  },
  getPreviewHistory: {
    id: "customer.preview.history",
    method: "getPreviewHistory",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.MOBILE, EXPERIENCE_SURFACE.DESKTOP],
    input: { userId: "string", page: "number", pageSize: "number" },
    output: "HistoryDTO",
  },
  getGeneratedAssets: {
    id: "customer.assets.list",
    method: "getGeneratedAssets",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.MOBILE],
    input: { userId: "string" },
    output: "AssetDTO[]",
  },
  getJobStatus: {
    id: "customer.jobs.status",
    method: "getJobStatus",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.MOBILE, EXPERIENCE_SURFACE.PUBLIC_API],
    input: { jobId: "string" },
    output: "JobDTO",
  },
  getAssetDownload: {
    id: "customer.assets.download",
    method: "getAssetDownload",
    protocol: [CONTRACT_PROTOCOL.REST],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.MOBILE, EXPERIENCE_SURFACE.DESKTOP],
    input: { assetId: "string", userId: "string" },
    output: "AssetDownloadDTO",
  },
  getAssetSharing: {
    id: "customer.assets.sharing",
    method: "getAssetSharing",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.MOBILE],
    input: { assetId: "string" },
    output: "AssetSharingDTO",
  },
};

export const VENDOR_CONTRACTS = {
  getDashboard: {
    id: "vendor.dashboard",
    method: "getDashboard",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: { vendorId: "string" },
    output: "VendorDashboardDTO",
  },
  getCredits: {
    id: "vendor.credits",
    method: "getCredits",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.MOBILE, EXPERIENCE_SURFACE.DESKTOP],
    input: { vendorId: "string" },
    output: "CreditsDTO",
  },
  getSubscription: {
    id: "vendor.subscription",
    method: "getSubscription",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: { vendorId: "string" },
    output: "SubscriptionDTO",
  },
  getBillingSummary: {
    id: "vendor.billing",
    method: "getBillingSummary",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: { vendorId: "string" },
    output: "BillingSummaryDTO",
  },
  getROI: {
    id: "vendor.roi",
    method: "getROI",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: { vendorId: "string" },
    output: "ROIDTO",
  },
  getAnalytics: {
    id: "vendor.analytics",
    method: "getAnalytics",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP, EXPERIENCE_SURFACE.PUBLIC_API],
    input: { vendorId: "string" },
    output: "AnalyticsDTO",
  },
  getRecommendations: {
    id: "vendor.recommendations",
    method: "getRecommendations",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: { vendorId: "string" },
    output: "RecommendationDTO[]",
  },
  getUsage: {
    id: "vendor.usage",
    method: "getUsage",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: { vendorId: "string" },
    output: "UsageDTO",
  },
};

export const ADMIN_CONTRACTS = {
  getProviderMonitoring: {
    id: "admin.providers",
    method: "getProviderMonitoring",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: {},
    output: "ProviderMonitoringDTO[]",
  },
  getJobMonitoring: {
    id: "admin.jobs",
    method: "getJobMonitoring",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: {},
    output: "JobMonitoringDTO",
  },
  getInfrastructureHealth: {
    id: "admin.infrastructure",
    method: "getInfrastructureHealth",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: {},
    output: "InfrastructureHealthDTO",
  },
  getCostMonitoring: {
    id: "admin.costs",
    method: "getCostMonitoring",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: {},
    output: "CostMonitoringDTO",
  },
  getUsageMonitoring: {
    id: "admin.usage",
    method: "getUsageMonitoring",
    protocol: [CONTRACT_PROTOCOL.REST, CONTRACT_PROTOCOL.GRAPHQL],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: {},
    output: "UsageMonitoringDTO",
  },
  getDiagnostics: {
    id: "admin.diagnostics",
    method: "getDiagnostics",
    protocol: [CONTRACT_PROTOCOL.REST],
    surfaces: [EXPERIENCE_SURFACE.WEB, EXPERIENCE_SURFACE.DESKTOP],
    input: {},
    output: "DiagnosticsDTO",
  },
};

export const ALL_EXPERIENCE_CONTRACTS = {
  customer: CUSTOMER_CONTRACTS,
  vendor: VENDOR_CONTRACTS,
  admin: ADMIN_CONTRACTS,
};

export const listContracts = (role = null) => {
  if (role === "customer") return CUSTOMER_CONTRACTS;
  if (role === "vendor") return VENDOR_CONTRACTS;
  if (role === "admin") return ADMIN_CONTRACTS;
  return ALL_EXPERIENCE_CONTRACTS;
};

export default ALL_EXPERIENCE_CONTRACTS;
