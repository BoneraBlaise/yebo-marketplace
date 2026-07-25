/** Unified provider SDK configuration */
export const defaultProviderConfig = {
  preferredProvider: "mock",
  fallbackEnabled: true,
  streamingEnabled: false,
  offlineMode: true,
  debugMode: false,
  textProvider: "openrouter",
  imageProvider: "fashion",
  embeddingProvider: "openai",
  mockMode: true,
};

/** Registered SDK provider ids — "gateway" is assistant transport only (Phase 7.1) */
const SDK_PROVIDER_IDS = new Set([
  "gemini",
  "openrouter",
  "openai",
  "claude",
  "fashion",
  "local",
  "mock",
]);

export const mergeProviderConfig = (partial = {}) => {
  const merged = { ...defaultProviderConfig, ...partial };
  if (merged.preferredProvider && !SDK_PROVIDER_IDS.has(merged.preferredProvider)) {
    merged.preferredProvider = "mock";
  }
  return merged;
};

export default defaultProviderConfig;
