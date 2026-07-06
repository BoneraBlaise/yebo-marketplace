import React, { createContext, useContext } from "react";

export const OrchestrationReactContext = createContext(null);

export const useOrchestrationEngine = () => {
  const ctx = useContext(OrchestrationReactContext);
  if (!ctx) throw new Error("useOrchestrationEngine must be used within ProviderProvider");
  return ctx;
};

export const useOrchestrationEngineOptional = () => useContext(OrchestrationReactContext);

export {
  useCurrentProvider,
  useAvailableProviders,
  useProviderHealth,
} from "../hooks/useOrchestration";

export default {
  useOrchestrationEngine,
  useOrchestrationEngineOptional,
};
