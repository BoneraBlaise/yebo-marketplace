import React from "react";
import { AgentReactContext } from "./AgentHooks";

/** Optional standalone agent provider — YIPProvider wires by default */
export const AgentProvider = ({ children, agentPlatform }) => (
  <AgentReactContext.Provider value={agentPlatform}>
    {children}
  </AgentReactContext.Provider>
);

export default AgentProvider;
