import { STORAGE_PROVIDER } from "./InfrastructureTypes";

/** Configurable infrastructure defaults — Phase 8E */

export const defaultInfrastructureConfig = {
  storageProvider: STORAGE_PROVIDER.LOCAL,
  storageProviders: {
    [STORAGE_PROVIDER.LOCAL]: { enabled: true },
    [STORAGE_PROVIDER.SUPABASE]: { enabled: false },
    [STORAGE_PROVIDER.S3]: { enabled: false },
    [STORAGE_PROVIDER.R2]: { enabled: false },
    [STORAGE_PROVIDER.GCS]: { enabled: false },
    [STORAGE_PROVIDER.AZURE]: { enabled: false },
  },
  previewCacheTtlMs: 24 * 60 * 60 * 1000,
  assetDefaultTtlMs: 7 * 24 * 60 * 60 * 1000,
  jobMaxRetries: 3,
  historyPageSize: 20,
  notificationChannels: [],
};

export const mergeInfrastructureConfig = (overrides = {}) => ({
  ...defaultInfrastructureConfig,
  ...overrides,
  storageProviders: {
    ...defaultInfrastructureConfig.storageProviders,
    ...(overrides.storageProviders || {}),
  },
});

export default defaultInfrastructureConfig;
