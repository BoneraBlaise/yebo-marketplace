import { useMemo } from "react";
import { useYIPOptional } from "./useYIP";

const normalizeKnowledgeList = (value) => {
  if (Array.isArray(value)) return value;
  if (value instanceof Promise) return [];
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.documents)) return value.documents;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

export const useKnowledgeSearch = (query = "", options = {}) => {
  const yip = useYIPOptional();
  return useMemo(() => {
    if (!yip?.searchKnowledge || !query) return [];
    const result = yip.searchKnowledge(query, options);
    return normalizeKnowledgeList(result);
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
