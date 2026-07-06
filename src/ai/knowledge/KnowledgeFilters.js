import { KNOWLEDGE_DOMAIN } from "./KnowledgeTypes";

/** Domain filter helpers */
export const filterByDomain = (docs, domain) =>
  domain ? docs.filter((d) => d.domain === domain) : docs;

export const filterByVisibility = (docs, visibility) =>
  visibility ? docs.filter((d) => d.visibility === visibility) : docs;

export const filterByTags = (docs, tags = []) => {
  if (!tags.length) return docs;
  return docs.filter((d) => tags.some((t) => d.tags.includes(t)));
};

export const filterByMinConfidence = (docs, min = 0) =>
  docs.filter((d) => d.confidence >= min);

export const applyFilters = (docs, filters = {}) => {
  let result = docs;
  if (filters.domain) result = filterByDomain(result, filters.domain);
  if (filters.visibility) result = filterByVisibility(result, filters.visibility);
  if (filters.tags) result = filterByTags(result, filters.tags);
  if (filters.minConfidence) result = filterByMinConfidence(result, filters.minConfidence);
  return result;
};

export default { filterByDomain, filterByVisibility, filterByTags, applyFilters };
