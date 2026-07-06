import React, { createContext, useContext } from "react";

export const KnowledgeReactContext = createContext(null);

export const useKnowledgeEngine = () => {
  const ctx = useContext(KnowledgeReactContext);
  if (!ctx) throw new Error("useKnowledgeEngine must be used within KnowledgeProvider");
  return ctx;
};

export const useKnowledgeEngineOptional = () => useContext(KnowledgeReactContext);

export {
  useKnowledgeSearch,
  useKnowledgeDomains,
  useKnowledgeSnapshot,
} from "../hooks/useKnowledge";

export default { useKnowledgeEngine, useKnowledgeEngineOptional };
