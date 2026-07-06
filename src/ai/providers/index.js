/* Legacy chat-panel adapters (Phase 7A) */
export { BaseAdapter } from "./BaseAdapter";
export { MockAdapter } from "./MockAdapter";
export { OpenAIAdapter } from "./OpenAIAdapter";
export { GeminiAdapter } from "./GeminiAdapter";
export { ClaudeAdapter } from "./ClaudeAdapter";
export { LocalAdapter } from "./LocalAdapter";
export {
  createProviderAdapter,
  listProviders,
  ProviderFactory,
  createProviderFactory,
  getProviderFactory,
  getProvider,
  switchProviderSDK,
} from "./ProviderFactory";

/* Provider SDK — Phase 8A.1 (aliased to avoid orchestration barrel collisions) */
export { BaseProvider } from "./BaseProvider";
export { GeminiProvider } from "./GeminiProvider";
export { GeminiClient } from "./GeminiClient";
export { getGeminiApiKey, isGeminiConfigured, logGeminiDebug } from "./GeminiConfig";
export { OpenAIProvider } from "./OpenAIProvider";
export { ClaudeProvider } from "./ClaudeProvider";
export { FashionProvider } from "./FashionProvider";
export { LocalProvider } from "./LocalProvider";
export { MockProviderClient } from "./MockProviderClient";
export { ProviderRegistry as SDKProviderRegistry, createProviderRegistry as createSDKProviderRegistry } from "./ProviderRegistry";
export { ProviderHealthMonitor as SDKProviderHealthMonitor, createHealthMonitor as createSDKHealthMonitor } from "./ProviderHealth";
export { ProviderUsageTracker as SDKProviderUsageTracker, createUsageTracker as createSDKUsageTracker } from "./ProviderUsage";
export { ProviderStream, createStream } from "./ProviderStreaming";
export { defaultProviderConfig, mergeProviderConfig as mergeSDKProviderConfig } from "./ProviderConfig";
export { SDK_CAPABILITY_PROFILES, getSDKCapabilities } from "./ProviderCapabilities";
export { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";
export {
  PROVIDER_ID as SDK_PROVIDER_ID,
  MODEL_CATEGORY,
  PROVIDER_STATUS as SDK_PROVIDER_STATUS,
  STREAM_STATE,
} from "./ProviderTypes";
export {
  ProviderError,
  AuthenticationError,
  RateLimitError,
  TimeoutError,
  ProviderUnavailableError,
  StreamingError,
  UnknownProviderError,
} from "./ProviderErrors";
export { useProviderSDK, useActiveProvider } from "./ProviderHooks";
export { ProviderSDKProvider, useProviderSDKContext } from "./ProviderProvider";
