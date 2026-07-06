import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";

export const useAgents = () => {
  const yip = useYIPOptional();
  return useMemo(() => yip?.getAgents?.() ?? [], [yip]);
};

export const useAgentCapabilities = (agentId) => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!yip?.getAgentCapabilities) return [];
    return yip.getAgentCapabilities(agentId);
  }, [yip, agentId]);
};

export const useAgentExecution = (input = "find product") => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!yip?.executeAgent || !input) return null;
    const result = yip.executeAgent(input);
    if (result instanceof Promise) return null;
    return result;
  }, [yip, input]);
};

export default { useAgents, useAgentCapabilities, useAgentExecution };
