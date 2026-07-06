import React from "react";
import { OrchestrationReactContext } from "./ProviderHooks";

/** Optional standalone orchestration provider — YIPProvider wires by default */
export const ProviderProvider = ({ children, orchestrator }) => (
  <OrchestrationReactContext.Provider value={orchestrator}>
    {children}
  </OrchestrationReactContext.Provider>
);

export default ProviderProvider;
