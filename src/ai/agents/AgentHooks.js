import React, { createContext, useContext } from "react";

export const AgentReactContext = createContext(null);

export const useAgentPlatform = () => {
  const ctx = useContext(AgentReactContext);
  if (!ctx) throw new Error("useAgentPlatform must be used within AgentProvider");
  return ctx;
};

export const useAgentPlatformOptional = () => useContext(AgentReactContext);

export { useAgentExecution, useAgents, useAgentCapabilities } from "../hooks/useAgents";

export default { useAgentPlatform, useAgentPlatformOptional };
