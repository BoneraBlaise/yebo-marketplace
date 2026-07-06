import { SELECTION_STRATEGY } from "./ProviderTypes";

/** Orchestration configuration — single object, no env vars required */
export const defaultOrchestrationConfig = {
  preferredProvider: "mock",
  fallbackEnabled: true,
  streamingEnabled: false,
  localModelEnabled: true,
  offlineMode: false,
  selectionStrategy: SELECTION_STRATEGY.AUTO,
};

export const mergeOrchestrationConfig = (partial = {}) => ({
  ...defaultOrchestrationConfig,
  ...partial,
});

export default defaultOrchestrationConfig;
