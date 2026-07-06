import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";

export const useKnowledgeSearch = (query = "", options = {}) => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!yip?.searchKnowledge || !query) return [];
    const result = yip.searchKnowledge(query, options);
    if (result instanceof Promise) return [];
    return result?.results || result || [];
  }, [yip, query, options]);
};

export const useKnowledgeDomains = () => {
  const yip = useYIPOptional();
  return useMemo(() => yip?.getKnowledgeDomains?.() ?? [], [yip]);
};

export const useKnowledgeSnapshot = () => {
  const yip = useYIPOptional();
  return useMemo(() => yip?.knowledgeSnapshot?.() ?? null, [yip]);
};

export default { useKnowledgeSearch, useKnowledgeDomains, useKnowledgeSnapshot };
