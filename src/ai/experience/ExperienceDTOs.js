/** Experience DTO Layer — Phase 8F */

export const createCustomerDTO = ({
  userId,
  previewSessions = [],
  previewHistory = [],
  assets = [],
  jobs = [],
} = {}) => ({
  type: "customer",
  userId,
  previewSessions,
  previewHistory,
  assets,
  jobs,
  generatedAt: new Date().toISOString(),
});

export const createVendorDTO = ({
  vendorId,
  dashboard = {},
  credits = {},
  subscription = {},
  billing = {},
  roi = {},
  analytics = {},
  recommendations = [],
  usage = {},
} = {}) => ({
  type: "vendor",
  vendorId,
  dashboard,
  credits,
  subscription,
  billing,
  roi,
  analytics,
  recommendations,
  usage,
  generatedAt: new Date().toISOString(),
});

export const createAdminDTO = ({
  providers = [],
  jobs = {},
  infrastructure = {},
  costs = {},
  usage = {},
  diagnostics = {},
} = {}) => ({
  type: "admin",
  providers,
  jobs,
  infrastructure,
  costs,
  usage,
  diagnostics,
  generatedAt: new Date().toISOString(),
});

export const createAnalyticsDTO = ({ metrics = {}, trends = {}, topItems = [] } = {}) => ({
  type: "analytics",
  metrics,
  trends,
  topItems,
  generatedAt: new Date().toISOString(),
});

export const createPreviewDTO = ({
  sessionId,
  ai_preview_type,
  progress = 0,
  status = "pending",
  assetId = null,
  metadata = {},
} = {}) => ({
  type: "preview",
  sessionId,
  ai_preview_type,
  progress,
  status,
  assetId,
  metadata,
  generatedAt: new Date().toISOString(),
});

export const createHistoryDTO = ({ items = [], pagination = {} } = {}) => ({
  type: "history",
  items,
  pagination,
  generatedAt: new Date().toISOString(),
});

export const createJobDTO = ({
  id,
  type,
  status,
  progress = 0,
  createdAt = null,
  updatedAt = null,
  error = null,
} = {}) => ({
  type: "job",
  id,
  jobType: type,
  status,
  progress,
  createdAt,
  updatedAt,
  error,
  generatedAt: new Date().toISOString(),
});

export const createAssetDTO = ({
  assetId,
  assetType,
  owner,
  organization = null,
  status,
  provider = null,
  feature = null,
  metadata = {},
  downloadUrl = null,
  sharing = {},
} = {}) => ({
  type: "asset",
  assetId,
  assetType,
  owner,
  organization,
  status,
  provider,
  feature,
  metadata,
  downloadUrl,
  sharing,
  generatedAt: new Date().toISOString(),
});

export const createCreditsDTO = ({
  current = 0,
  allocated = 0,
  consumed = 0,
  remaining = 0,
  nextResetAt = null,
} = {}) => ({
  type: "credits",
  current,
  allocated,
  consumed,
  remaining,
  nextResetAt,
  generatedAt: new Date().toISOString(),
});

export const createSubscriptionDTO = ({
  planId,
  planLabel,
  capabilities = [],
  limits = {},
  upgradePath = null,
  active = true,
} = {}) => ({
  type: "subscription",
  planId,
  planLabel,
  capabilities,
  limits,
  upgradePath,
  active,
  generatedAt: new Date().toISOString(),
});

export default {
  createCustomerDTO,
  createVendorDTO,
  createAdminDTO,
  createAnalyticsDTO,
  createPreviewDTO,
  createHistoryDTO,
  createJobDTO,
  createAssetDTO,
  createCreditsDTO,
  createSubscriptionDTO,
};
