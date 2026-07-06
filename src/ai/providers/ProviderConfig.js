/** Unified provider SDK configuration */
export const defaultProviderConfig = {
  preferredProvider: "mock",
  fallbackEnabled: true,
  streamingEnabled: false,
  offlineMode: true,
  debugMode: false,
  textProvider: "gemini",
  imageProvider: "fashion",
  embeddingProvider: "openai",
  mockMode: true,
};

export const mergeProviderConfig = (partial = {}) => ({
  ...defaultProviderConfig,
  ...partial,
});

export default defaultProviderConfig;
